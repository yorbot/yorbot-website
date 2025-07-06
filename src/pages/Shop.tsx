import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Search, Filter, Grid, List } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  price: number;
  sale_price?: number;
  image_url?: string;
  slug: string;
  category_id?: number;
  subcategory_id?: number;
  base_category_id?: number;
  discount_percentage?: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Subcategory {
  id: number;
  name: string;
  slug: string;
  category_id?: number;
}

interface BaseCategory {
  id: number;
  name: string;
  slug: string;
  subcategory_id?: number;
}

const Shop: React.FC = () => {
  
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [baseCategories, setBaseCategories] = useState<BaseCategory[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [selectedBaseCategory, setSelectedBaseCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const category = searchParams.get("category");
    const subcategoryParam = searchParams.get("subcategory");
    const baseCategoryParam = searchParams.get("base_category");
    
    if (category) setSelectedCategory(category);
    if (subcategoryParam) setSelectedSubcategory(subcategoryParam);
    if (baseCategoryParam) setSelectedBaseCategory(baseCategoryParam);
  }, [searchParams]);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory, selectedSubcategory, selectedBaseCategory, sortBy, priceRange]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      const [productsRes, categoriesRes, subcategoriesRes, baseCategoriesRes] = await Promise.all([
        supabase.from("products").select("*"),
        supabase.from("categories").select("*"),
        supabase.from("subcategories").select("*"),
        supabase.from("base_categories").select("*")
      ]);

      if (productsRes.data) setProducts(productsRes.data);
      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (subcategoriesRes.data) setSubcategories(subcategoriesRes.data);
      if (baseCategoriesRes.data) setBaseCategories(baseCategoriesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast("Error loading products", { description: "Please try again later." });
    } finally {
      setIsLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      const category = categories.find(cat => cat.slug === selectedCategory);
      if (category) {
        filtered = filtered.filter(product => product.category_id === category.id);
      }
    }

    // Subcategory filter
    if (selectedSubcategory) {
      const subcategory = subcategories.find(sub => sub.slug === selectedSubcategory);
      if (subcategory) {
        // Only show products that belong to this subcategory AND its parent category
        filtered = filtered.filter(product => {
          if (product.subcategory_id === subcategory.id) {
            // If category is also selected, ensure it matches
            if (selectedCategory) {
              const category = categories.find(cat => cat.slug === selectedCategory);
              return category && subcategory.category_id === category.id;
            }
            return true;
          }
          return false;
        });
      }
    }

    // Base category filter
    if (selectedBaseCategory) {
      const baseCategory = baseCategories.find(base => base.slug === selectedBaseCategory);
      if (baseCategory) {
        // Only show products that belong to this base category AND match the subcategory hierarchy
        filtered = filtered.filter(product => {
          if (product.base_category_id === baseCategory.id) {
            // If subcategory is selected, ensure base category belongs to that subcategory
            if (selectedSubcategory) {
              const subcategory = subcategories.find(sub => sub.slug === selectedSubcategory);
              return subcategory && baseCategory.subcategory_id === subcategory.id;
            }
            return true;
          }
          return false;
        });
      }
    }

    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter(product => product.price >= parseFloat(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(product => product.price <= parseFloat(priceRange.max));
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.sale_price || product.price,
      image: product.image_url || "/placeholder.svg"
    });
  };

  const handleWishlistToggle = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.sale_price || product.price,
        image: product.image_url || "/placeholder.svg",
        inStock: true
      });
    }
  };

  const getDisplayPrice = (product: Product) => {
    if (product.sale_price && product.sale_price < product.price) {
      return {
        current: product.sale_price,
        original: product.price,
        discount: product.discount_percentage
      };
    }
    return { current: product.price };
  };

  // Get filtered subcategories based on selected category
  const getFilteredSubcategories = () => {
    if (!selectedCategory) return subcategories;
    const category = categories.find(cat => cat.slug === selectedCategory);
    return subcategories.filter(sub => sub.category_id === category?.id);
  };

  // Get filtered base categories based on selected subcategory
  const getFilteredBaseCategories = () => {
    if (!selectedSubcategory) return baseCategories;
    const subcategory = subcategories.find(sub => sub.slug === selectedSubcategory);
    return baseCategories.filter(base => base.subcategory_id === subcategory?.id);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yorbot-orange"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </h3>
                
                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Search Products</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Subcategories */}
                {selectedCategory && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Subcategory</label>
                    <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Subcategories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Subcategories</SelectItem>
                        {getFilteredSubcategories().map((subcategory) => (
                          <SelectItem key={subcategory.id} value={subcategory.slug}>
                            {subcategory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Base Categories */}
                {selectedSubcategory && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Base Category</label>
                    <Select value={selectedBaseCategory} onValueChange={setSelectedBaseCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Base Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Base Categories</SelectItem>
                        {getFilteredBaseCategories().map((baseCategory) => (
                          <SelectItem key={baseCategory.id} value={baseCategory.slug}>
                            {baseCategory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Price Range</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("");
                    setSelectedSubcategory("");
                    setSelectedBaseCategory("");
                    setPriceRange({ min: "", max: "" });
                    setSearchParams({});
                  }}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold">Products</h1>
                <p className="text-gray-600">{filteredProducts.length} products found</p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name A-Z</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500">No products found</p>
                <p className="text-gray-400">Try adjusting your filters</p>
              </div>
            ) : (
              <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
                {filteredProducts.map((product) => {
                  const pricing = getDisplayPrice(product);
                  return (
                    <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="relative mb-3">
                          <Link to={`/product/${product.slug}`}>
                            <img
                              src={product.image_url || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-36 object-cover rounded-lg"
                            />
                          </Link>
                          {pricing.discount && (
                            <Badge className="absolute top-2 left-2 bg-red-500">
                              -{pricing.discount}%
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleWishlistToggle(product)}
                          >
                            <Heart
                              className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-red-500 text-red-500" : ""}`}
                            />
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          <Link to={`/product/${product.slug}`}>
                            <h3 className="font-medium text-sm leading-tight hover:text-yorbot-orange transition-colors line-clamp-2">
                              {product.name}
                            </h3>
                          </Link>
                          
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-yorbot-orange text-lg">
                              ₹{pricing.current.toFixed(2)}
                            </span>
                            {pricing.original && (
                              <span className="text-gray-500 line-through text-sm">
                                ₹{pricing.original.toFixed(2)}
                              </span>
                            )}
                          </div>
                          
                          <Button
                            onClick={() => handleAddToCart(product)}
                            className="w-full bg-yorbot-orange hover:bg-orange-600 text-sm py-2"
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
