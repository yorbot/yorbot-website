
import React, { useState, useEffect } from "react";
import { useSearchParams, useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Search, Filter, Grid, List, ChevronRight } from "lucide-react";
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
  const { categorySlug, subcategorySlug, baseCategorySlug } = useParams();
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
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [currentSubcategory, setCurrentSubcategory] = useState<Subcategory | null>(null);
  const [currentBaseCategory, setCurrentBaseCategory] = useState<BaseCategory | null>(null);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (categorySlug) {
      setSelectedCategory(categorySlug);
    }
    if (subcategorySlug) {
      setSelectedSubcategory(subcategorySlug);
    }
    if (baseCategorySlug) {
      setSelectedBaseCategory(baseCategorySlug);
    }
  }, [categorySlug, subcategorySlug, baseCategorySlug]);

  useEffect(() => {
    filterProducts();
    updateCurrentEntities();
  }, [products, categories, subcategories, baseCategories, selectedCategory, selectedSubcategory, selectedBaseCategory, searchTerm, sortBy, priceRange]);

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

  const updateCurrentEntities = () => {
    if (selectedCategory || categorySlug) {
      const slug = selectedCategory || categorySlug;
      const category = categories.find(cat => cat.slug === slug);
      setCurrentCategory(category || null);
    } else {
      setCurrentCategory(null);
    }

    if (selectedSubcategory || subcategorySlug) {
      const slug = selectedSubcategory || subcategorySlug;
      const subcategory = subcategories.find(sub => sub.slug === slug);
      setCurrentSubcategory(subcategory || null);
    } else {
      setCurrentSubcategory(null);
    }

    if (selectedBaseCategory || baseCategorySlug) {
      const slug = selectedBaseCategory || baseCategorySlug;
      const baseCategory = baseCategories.find(base => base.slug === slug);
      setCurrentBaseCategory(baseCategory || null);
    } else {
      setCurrentBaseCategory(null);
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
    if (selectedCategory || categorySlug) {
      const slug = selectedCategory || categorySlug;
      const category = categories.find(cat => cat.slug === slug);
      if (category) {
        filtered = filtered.filter(product => product.category_id === category.id);
      }
    }

    // Subcategory filter
    if (selectedSubcategory || subcategorySlug) {
      const slug = selectedSubcategory || subcategorySlug;
      const subcategory = subcategories.find(sub => sub.slug === slug);
      if (subcategory) {
        filtered = filtered.filter(product => product.subcategory_id === subcategory.id);
      }
    }

    // Base category filter
    if (selectedBaseCategory || baseCategorySlug) {
      const slug = selectedBaseCategory || baseCategorySlug;
      const baseCategory = baseCategories.find(base => base.slug === slug);
      if (baseCategory) {
        filtered = filtered.filter(product => product.base_category_id === baseCategory.id);
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
    if (!currentCategory) return [];
    return subcategories.filter(sub => sub.category_id === currentCategory.id);
  };

  // Get filtered base categories based on selected subcategory
  const getFilteredBaseCategories = () => {
    if (!currentSubcategory) return [];
    return baseCategories.filter(base => base.subcategory_id === currentSubcategory.id);
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

  // If we're showing categories/subcategories/base categories instead of products
  const showingCategories = !baseCategorySlug && (!subcategorySlug || !currentSubcategory);
  const showingSubcategories = categorySlug && !subcategorySlug;
  const showingBaseCategories = categorySlug && subcategorySlug && !baseCategorySlug;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
          <Link to="/shop" className="hover:text-yorbot-orange">Shop</Link>
          {currentCategory && (
            <>
              <ChevronRight className="w-4 h-4" />
              <Link to={`/shop/${currentCategory.slug}`} className="hover:text-yorbot-orange">
                {currentCategory.name}
              </Link>
            </>
          )}
          {currentSubcategory && (
            <>
              <ChevronRight className="w-4 h-4" />
              <Link to={`/shop/${currentCategory?.slug}/${currentSubcategory.slug}`} className="hover:text-yorbot-orange">
                {currentSubcategory.name}
              </Link>
            </>
          )}
          {currentBaseCategory && (
            <>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900">{currentBaseCategory.name}</span>
            </>
          )}
        </div>

        {/* Show Categories if no category selected */}
        {!categorySlug && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Categories</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link key={category.id} to={`/shop/${category.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4 text-center">
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Show Subcategories if category selected but no subcategory */}
        {showingSubcategories && currentCategory && (
          <div>
            <h1 className="text-2xl font-bold mb-6">{currentCategory.name} - Subcategories</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {getFilteredSubcategories().map((subcategory) => (
                <Link key={subcategory.id} to={`/shop/${currentCategory.slug}/${subcategory.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4 text-center">
                      <h3 className="font-semibold text-lg">{subcategory.name}</h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Show Base Categories if subcategory selected but no base category */}
        {showingBaseCategories && currentSubcategory && (
          <div>
            <h1 className="text-2xl font-bold mb-6">{currentSubcategory.name} - Base Categories</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {getFilteredBaseCategories().map((baseCategory) => (
                <Link key={baseCategory.id} to={`/shop/${currentCategory?.slug}/${currentSubcategory.slug}/${baseCategory.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4 text-center">
                      <h3 className="font-semibold text-lg">{baseCategory.name}</h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Show Products */}
        {(baseCategorySlug || (!categorySlug && !subcategorySlug)) && (
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
                      setPriceRange({ min: "", max: "" });
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
                                className="w-full h-48 object-cover rounded-lg"
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
                              <span className="font-bold text-yorbot-orange">
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
        )}
      </div>
    </Layout>
  );
};

export default Shop;
