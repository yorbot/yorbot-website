import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, ChevronRight } from "lucide-react";
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
  discount_percentage?: number;
  base_category_id?: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  image_url?: string;
}

interface Subcategory {
  id: number;
  name: string;
  slug: string;
  category_id?: number;
  image_url?: string;
}

interface BaseCategory {
  id: number;
  name: string;
  slug: string;
  subcategory_id?: number;
  image_url?: string;
}

const Shop: React.FC = () => {
  const { categorySlug, subcategorySlug, baseCategorySlug } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [baseCategories, setBaseCategories] = useState<BaseCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [currentSubcategory, setCurrentSubcategory] = useState<Subcategory | null>(null);
  const [currentBaseCategory, setCurrentBaseCategory] = useState<BaseCategory | null>(null);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    fetchData();
  }, [categorySlug, subcategorySlug, baseCategorySlug]);

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

      // Set current entities after data is loaded
      if (categoriesRes.data && categorySlug) {
        const category = categoriesRes.data.find((cat: Category) => cat.slug === categorySlug);
        setCurrentCategory(category || null);
      }

      if (subcategoriesRes.data && subcategorySlug) {
        const subcategory = subcategoriesRes.data.find((sub: Subcategory) => sub.slug === subcategorySlug);
        setCurrentSubcategory(subcategory || null);
      }

      if (baseCategoriesRes.data && baseCategorySlug) {
        const baseCategory = baseCategoriesRes.data.find((base: BaseCategory) => base.slug === baseCategorySlug);
        setCurrentBaseCategory(baseCategory || null);
      }

      // Special handling for "arduino-boards-&-kits" route - set base category ID 8
      if (baseCategorySlug === "arduino-boards-&-kits") {
        const targetBaseCategory = baseCategoriesRes.data?.find((base: BaseCategory) => base.id === 8);
        if (targetBaseCategory) {
          setCurrentBaseCategory(targetBaseCategory);
        } else {
          // Create a fallback base category if ID 8 doesn't exist
          setCurrentBaseCategory({
            id: 8,
            name: "Boards Compatible with Arduino",
            slug: "arduino-boards-&-kits",
            image_url: null
          });
        }
      }

    } catch (error) {
      console.error("Error fetching data:", error);
      toast("Error loading data", { description: "Please try again later." });
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredSubcategories = () => {
    if (!currentCategory) return [];
    return subcategories.filter(sub => sub.category_id === currentCategory.id);
  };

  const getFilteredBaseCategories = () => {
    if (!currentSubcategory) return [];
    return baseCategories.filter(base => base.subcategory_id === currentSubcategory.id);
  };

  const getFilteredProducts = () => {
    if (!currentBaseCategory) return [];
    
    // Special handling for base category ID 8
    if (currentBaseCategory.id === 8) {
      return products.filter(product => product.base_category_id === 8);
    }
    
    return products.filter(product => product.base_category_id === currentBaseCategory.id);
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

        {/* Show Categories */}
        {!categorySlug && (
          <div>
            <h1 className="text-3xl font-bold mb-8 text-center">Shop by Categories</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {categories.map((category) => (
                <Link key={category.id} to={`/shop/${category.slug}`}>
                  <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={category.image_url || "/placeholder.svg"}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-3 text-center">
                      <h3 className="font-medium text-sm group-hover:text-yorbot-orange transition-colors line-clamp-2">
                        {category.name}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Show Subcategories - Made bigger */}
        {categorySlug && !subcategorySlug && currentCategory && (
          <div>
            <h1 className="text-3xl font-bold mb-8 text-center">{currentCategory.name}</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {getFilteredSubcategories().map((subcategory) => (
                <Link key={subcategory.id} to={`/shop/${currentCategory.slug}/${subcategory.slug}`}>
                  <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={subcategory.image_url || "/placeholder.svg"}
                        alt={subcategory.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-3 text-center">
                      <h3 className="font-medium text-sm group-hover:text-yorbot-orange transition-colors line-clamp-2">
                        {subcategory.name}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Show Base Categories - Made bigger with reduced gaps */}
        {categorySlug && subcategorySlug && !baseCategorySlug && currentSubcategory && (
          <div>
            <h1 className="text-3xl font-bold mb-8 text-center">{currentSubcategory.name}</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {getFilteredBaseCategories().map((baseCategory) => (
                <Link key={baseCategory.id} to={`/shop/${currentCategory?.slug}/${currentSubcategory.slug}/${baseCategory.slug}`}>
                  <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={baseCategory.image_url || "/placeholder.svg"}
                        alt={baseCategory.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-3 text-center">
                      <h3 className="font-medium text-sm group-hover:text-yorbot-orange transition-colors line-clamp-2">
                        {baseCategory.name}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Show Products - Made smaller with reduced gaps */}
        {baseCategorySlug && currentBaseCategory && (
          <div>
            <h1 className="text-3xl font-bold mb-8 text-center">{currentBaseCategory.name}</h1>
            {getFilteredProducts().length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500">No products found in this category</p>
                <p className="text-gray-400">Please check back later</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {getFilteredProducts().map((product) => {
                  const pricing = getDisplayPrice(product);
                  return (
                    <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                      <CardContent className="p-3">
                        <div className="relative mb-2">
                          <Link to={`/product/${product.slug}`}>
                            <img
                              src={product.image_url || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          </Link>
                          {pricing.discount && (
                            <Badge className="absolute top-1 left-1 bg-red-500 text-xs px-1 py-0">
                              -{pricing.discount}%
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleWishlistToggle(product)}
                          >
                            <Heart
                              className={`w-3 h-3 ${isInWishlist(product.id) ? "fill-red-500 text-red-500" : ""}`}
                            />
                          </Button>
                        </div>
                        
                        <div className="space-y-1">
                          <Link to={`/product/${product.slug}`}>
                            <h3 className="font-medium text-xs leading-tight hover:text-yorbot-orange transition-colors line-clamp-2">
                              {product.name}
                            </h3>
                          </Link>
                          
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-yorbot-orange text-sm">
                              ₹{pricing.current.toFixed(2)}
                            </span>
                            {pricing.original && (
                              <span className="text-gray-500 line-through text-xs">
                                ₹{pricing.original.toFixed(2)}
                              </span>
                            )}
                          </div>
                          
                          <Button
                            onClick={() => handleAddToCart(product)}
                            className="w-full bg-yorbot-orange hover:bg-orange-600 text-xs py-1 h-7"
                          >
                            <ShoppingCart className="w-3 h-3 mr-1" />
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
        )}
      </div>
    </Layout>
  );
};

export default Shop;
