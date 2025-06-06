
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Heart, ShoppingCart, Star, Minus, Plus } from "lucide-react";
import { useShopProducts } from "@/hooks/useShopProducts";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Product: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { products, loading } = useShopProducts();
  const { addToCart } = useCart();
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.slug === slug);
  const isInWishlist = wishlistItems.some(item => item.id === product?.id);

  useEffect(() => {
    if (!loading && !product && products.length > 0) {
      navigate("/404");
    }
  }, [product, loading, navigate, products.length]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[70vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-yorbot-orange"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return null;
  }

  const handleAddToCart = () => {
    if (!user) {
      toast("Sign in required", {
        description: "Please sign in to add items to your cart",
        duration: 2000,
      });
      navigate("/sign-in", { state: { from: { pathname: `/product/${slug}` } } });
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      image: product.image_url || "/placeholder.svg",
      price: product.sale_price || product.price
    });

    toast("Added to cart!", {
      description: `${product.name} has been added to your cart.`,
      duration: 2000,
    });
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast("Removed from wishlist", {
        description: `${product.name} has been removed from your wishlist.`,
        duration: 2000,
      });
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        image: product.image_url || "/placeholder.svg",
        price: product.sale_price || product.price,
        inStock: (product.stock || 0) > 0
      });
      toast("Added to wishlist!", {
        description: `${product.name} has been added to your wishlist.`,
        duration: 2000,
      });
    }
  };

  const handleQuantityChange = (action: "increase" | "decrease") => {
    setQuantity((prev) => {
      if (action === "increase") {
        return Math.min(prev + 1, product.stock || 99);
      } else {
        return Math.max(prev - 1, 1);
      }
    });
  };

  const images = [
    product.image_url || "/placeholder.svg",
    ...(product.additional_images || []).filter(img => img)
  ];

  const discount = product.sale_price 
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center mb-6">
          <Link to="/" className="text-gray-500 hover:text-yorbot-orange">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="text-gray-500 hover:text-yorbot-orange">Shop</Link>
          <span className="mx-2">/</span>
          <span className="font-semibold">{product.name}</span>
        </div>

        {/* Main Product Section - Side by Side Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images - Left Side */}
          <div className="space-y-4">
            {/* Main Product Image - Square with blurred black border */}
            <div className="w-full aspect-square border-4 border-black rounded-lg overflow-hidden bg-white shadow-lg" style={{filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.3))'}}>
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain p-4"
              />
            </div>
            
            {/* Image Thumbnails without borders */}
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100 ${
                      selectedImage === index ? "ring-2 ring-yorbot-orange" : ""
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details - Right Side */}
          <div className="space-y-6">
            {/* Product Name */}
            <div>
              <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
              {product.sku && (
                <p className="text-sm text-gray-600 mb-3">SKU: {product.sku}</p>
              )}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(4.5 - 23 reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                {product.sale_price ? (
                  <>
                    <span className="text-2xl font-bold text-yorbot-orange">
                      ₹{product.sale_price.toFixed(2)}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      ₹{product.price.toFixed(2)}
                    </span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                      {discount}% OFF
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-yorbot-orange">
                    ₹{product.price.toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">Inclusive of all taxes</p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${(product.stock || 0) > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-sm ${(product.stock || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {(product.stock || 0) > 0 ? `In Stock (${product.stock || 0} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleQuantityChange("decrease")}
                  disabled={quantity <= 1}
                  className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange("increase")}
                  disabled={quantity >= (product.stock || 0)}
                  className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={(product.stock || 0) <= 0}
                className="flex-1 bg-yorbot-orange text-white py-2 px-4 rounded-md font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
              
              <button
                onClick={handleWishlistToggle}
                className={`p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors ${
                  isInWishlist ? 'bg-red-50 border-red-300 text-red-600' : 'text-gray-600'
                }`}
              >
                <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Description and Specifications Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-4">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                <div className="prose max-w-none">
                  {product.description ? (
                    <p className="text-gray-700 leading-relaxed">{product.description}</p>
                  ) : (
                    <p className="text-gray-500 italic">No description available for this product.</p>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-4">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Product Specifications</h3>
                {product.specifications && Object.keys(product.specifications).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(product.specifications as Record<string, any>).map(([key, value]) => (
                      <div key={key} className="py-2 border-b border-gray-100">
                        <div className="flex flex-col space-y-1">
                          <span className="font-medium text-gray-700 capitalize">{key.replace('_', ' ')}</span>
                          <span className="text-gray-600">{String(value)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No specifications available for this product.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Product;
