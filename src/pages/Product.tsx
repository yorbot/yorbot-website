
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ProductImage {
  url: string;
}

interface ProductSpecification {
  name: string;
  value: string;
}

interface ProductAdditionalInfo {
  name: string;
  value: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  sale_price: number | null;
  category_id: number | null;
  subcategory_id: number | null;
  description: string | null;
  image_url: string | null;
  specifications: ProductSpecification[] | null;
  additional_images: ProductImage[] | null;
  stock: number | null;
  discount_percentage: number | null;
  category_name?: string;
  subcategory_name?: string;
}

interface RelatedProduct {
  id: number;
  name: string;
  price: number;
  sale_price: number | null;
  discount_percentage: number | null;
  image_url: string | null;
  slug: string;
  stock: number | null;
}

const Product: React.FC = () => {
  const { toast } = useToast();
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch product data
  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      
      if (!slug) return;

      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single();

      if (productError) {
        console.error("Error fetching product:", productError);
        setLoading(false);
        return;
      }
      
      if (!productData) {
        console.error("Product not found");
        setLoading(false);
        return;
      }
      
      // Fetch category and subcategory names if available
      if (productData.category_id) {
        const { data: categoryData } = await supabase
          .from("categories")
          .select("name")
          .eq("id", productData.category_id)
          .single();
        
        if (categoryData) {
          productData.category_name = categoryData.name;
        }
      }
      
      if (productData.subcategory_id) {
        const { data: subcategoryData } = await supabase
          .from("subcategories")
          .select("name")
          .eq("id", productData.subcategory_id)
          .single();
        
        if (subcategoryData) {
          productData.subcategory_name = subcategoryData.name;
        }
      }
      
      setProduct(productData);
      setMainImage(productData.image_url);
      
      // Fetch related products (same category or subcategory)
      let query = supabase.from("products").select("id, name, price, sale_price, discount_percentage, image_url, slug, stock");
      
      if (productData.subcategory_id) {
        query = query.eq("subcategory_id", productData.subcategory_id);
      } else if (productData.category_id) {
        query = query.eq("category_id", productData.category_id);
      }
      
      // Exclude current product and limit to 4
      query = query.neq("id", productData.id).limit(4);
      
      const { data: relatedData, error: relatedError } = await query;
      
      if (!relatedError && relatedData) {
        setRelatedProducts(relatedData);
      } else {
        console.error("Error fetching related products:", relatedError);
      }
      
      setLoading(false);
    }
    
    fetchProduct();
  }, [slug]);

  // Handle quantity change
  const updateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
  };

  // Handle add to cart
  const addToCart = () => {
    if (!product) return;
    
    toast({
      title: "Added to cart!",
      description: `${product.name} (Qty: ${quantity}) has been added to your cart.`,
      variant: "default",
    });
  };

  // Handle add to wishlist
  const toggleWishlist = () => {
    setIsInWishlist(!isInWishlist);
    
    if (!product) return;
    
    toast({
      title: isInWishlist ? "Removed from wishlist" : "Added to wishlist!",
      description: `${product.name} has been ${isInWishlist ? "removed from" : "added to"} your wishlist.`,
      variant: "default",
    });
  };

  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="animate-pulse bg-gray-200 rounded-lg aspect-square"></div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Product not found
  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/shop" className="bg-yorbot-orange text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors">
            Browse our products
          </Link>
        </div>
      </Layout>
    );
  }

  // Determine if product is in stock
  const inStock = product.stock === null || product.stock > 0;
  
  // Calculate discount percentage if not explicitly provided
  const discountPercentage = product.discount_percentage || 
    (product.sale_price ? Math.round((1 - product.sale_price / product.price) * 100) : 0);
  
  // Get all product images
  const allImages = [
    product.image_url,
    ...(product.additional_images?.map(img => img.url) || [])
  ].filter(Boolean) as string[];
  
  // Extract specifications and additional info from product data
  const specifications = product.specifications || [];
  const additionalInfo = [
    { name: "Warranty", value: "6 months" },
    { name: "Origin", value: "Made in India" },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to="/" className="text-gray-500 hover:text-yorbot-orange">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="text-gray-500 hover:text-yorbot-orange">Shop</Link>
          {product.category_name && (
            <>
              <span className="mx-2">/</span>
              <Link 
                to={`/shop/${product.category_name.toLowerCase().replace(/\s+/g, "-")}`} 
                className="text-gray-500 hover:text-yorbot-orange"
              >
                {product.category_name}
              </Link>
            </>
          )}
          {product.subcategory_name && (
            <>
              <span className="mx-2">/</span>
              <Link 
                to={`/shop/${product.category_name?.toLowerCase().replace(/\s+/g, "-")}/${product.subcategory_name.toLowerCase().replace(/\s+/g, "-")}`} 
                className="text-gray-500 hover:text-yorbot-orange"
              >
                {product.subcategory_name}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="font-semibold">{product.name}</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Product Images */}
          <div>
            <div className="grid grid-cols-12 gap-4">
              {/* Thumbnails */}
              <div className="col-span-2 space-y-4">
                {allImages.length > 0 ? (
                  allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setMainImage(image)}
                      className={`border rounded-md overflow-hidden w-full ${
                        mainImage === image ? "border-yorbot-orange" : "border-gray-200"
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`${product.name} - Thumbnail ${index + 1}`} 
                        className="w-full h-auto object-cover aspect-square"
                      />
                    </button>
                  ))
                ) : (
                  <button className="border rounded-md overflow-hidden w-full">
                    <div className="bg-gray-100 aspect-square flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No image</span>
                    </div>
                  </button>
                )}
              </div>
              
              {/* Main Image */}
              <div className="col-span-10">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  {mainImage ? (
                    <img 
                      src={mainImage} 
                      alt={product.name} 
                      className="w-full h-auto object-contain aspect-square"
                    />
                  ) : (
                    <div className="bg-gray-100 aspect-square flex items-center justify-center">
                      <span className="text-gray-400 text-lg">No image available</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Details */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
              <span className={`px-3 py-1 rounded-full text-sm ${
                inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}>
                {inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
            
            <div className="mb-6">
              {product.sale_price ? (
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-yorbot-orange mr-2">
                    ₹{product.sale_price.toFixed(2)}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    ₹{product.price.toFixed(2)}
                  </span>
                  {discountPercentage > 0 && (
                    <span className="ml-2 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                      {discountPercentage}% OFF
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-2xl font-bold">
                  ₹{product.price.toFixed(2)}
                </span>
              )}
            </div>
            
            {product.description && (
              <div className="mb-6">
                <p className="text-gray-700">{product.description}</p>
              </div>
            )}
            
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <span className="mr-4">Quantity</span>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => updateQuantity(quantity - 1)}
                    className="px-3 py-1 text-gray-600 hover:text-yorbot-orange"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-3 py-1 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(quantity + 1)}
                    className="px-3 py-1 text-gray-600 hover:text-yorbot-orange"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={addToCart}
                  disabled={!inStock}
                  className={`flex items-center px-6 py-3 rounded-md ${
                    inStock
                      ? "bg-yorbot-orange text-white hover:bg-orange-600"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  } transition-colors`}
                >
                  <ShoppingCart size={20} className="mr-2" />
                  <span>Add to Cart</span>
                </button>
                
                <button
                  onClick={toggleWishlist}
                  className={`flex items-center justify-center w-12 h-12 rounded-full border ${
                    isInWishlist 
                      ? "border-yorbot-orange bg-yorbot-orange text-white" 
                      : "border-gray-300 bg-white text-yorbot-orange hover:border-yorbot-orange"
                  } transition-colors`}
                >
                  <Heart size={20} className={isInWishlist ? "fill-white" : ""} />
                </button>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <p className="text-sm text-gray-600">
                {product.category_name && (
                  <>
                    Category: <Link 
                      to={`/shop/${product.category_name.toLowerCase().replace(/\s+/g, "-")}`} 
                      className="text-yorbot-orange hover:underline"
                    >
                      {product.category_name}
                    </Link>
                  </>
                )}
                
                {product.subcategory_name && (
                  <span> / <Link 
                    to={`/shop/${product.category_name?.toLowerCase().replace(/\s+/g, "-")}/${product.subcategory_name.toLowerCase().replace(/\s+/g, "-")}`} 
                    className="text-yorbot-orange hover:underline"
                  >
                    {product.subcategory_name}
                  </Link></span>
                )}
              </p>
            </div>
          </div>
        </div>
        
        {/* Product Information Tabs */}
        <div className="mb-10">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("description")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "description"
                    ? "border-yorbot-orange text-yorbot-orange"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("specifications")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "specifications"
                    ? "border-yorbot-orange text-yorbot-orange"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab("additional")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "additional"
                    ? "border-yorbot-orange text-yorbot-orange"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Additional Information
              </button>
            </nav>
          </div>
          
          <div className="py-6">
            {activeTab === "description" && (
              <div className="prose max-w-none">
                {product.description ? (
                  <p>{product.description}</p>
                ) : (
                  <p className="text-gray-500">No description available for this product.</p>
                )}
              </div>
            )}
            
            {activeTab === "specifications" && (
              <div className="overflow-x-auto">
                {specifications.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="divide-y divide-gray-200">
                      {specifications.map((spec, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 w-1/3">{spec.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500">No specifications available for this product.</p>
                )}
              </div>
            )}
            
            {activeTab === "additional" && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="divide-y divide-gray-200">
                    {additionalInfo.map((info, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 w-1/3">{info.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{info.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((product) => (
                <Link 
                  key={product.id}
                  to={`/product/${product.slug}`}
                  className="group"
                >
                  <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow p-4">
                    <div className="relative mb-3 aspect-square overflow-hidden rounded-md">
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No image</span>
                        </div>
                      )}
                      
                      {product.stock !== null && product.stock <= 0 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-white font-medium">Out of Stock</span>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-medium mb-1 group-hover:text-yorbot-orange transition-colors">
                      {product.name}
                    </h3>
                    
                    <div>
                      {product.sale_price ? (
                        <div className="flex items-center">
                          <span className="font-semibold text-yorbot-orange">
                            ₹{product.sale_price.toFixed(2)}
                          </span>
                          <span className="ml-1 text-sm text-gray-500 line-through">
                            ₹{product.price.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="font-semibold">
                          ₹{product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Product;
