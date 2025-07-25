import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Heart, ShoppingCart, Star, Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useShopProducts } from "@/hooks/useShopProducts";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";

const Product: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { products, loading } = useShopProducts();
  const { addToCart } = useCart();
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [validImages, setValidImages] = useState<string[]>([]);

  const product = products.find((p) => p.slug === slug);
  const isInWishlist = wishlistItems.some(item => item.id === product?.id);

  // Get recommended products from the same category/subcategory
  const { products: recommendedProducts } = useShopProducts(
    product?.category_id, 
    product?.subcategory_id
  );
  
  // Filter out current product and limit to 10
  const filteredRecommendedProducts = recommendedProducts
    .filter(p => p.id !== product?.id)
    .slice(0, 10);

  // Function to check if an image is valid
  const isValidImage = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!url || url.trim() === '') {
        resolve(false);
        return;
      }
      
      // Check for error keywords in URL
      if (url.includes('error') || url.includes('404') || url.includes('not-found')) {
        resolve(false);
        return;
      }

      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  // Function to format description text into paragraphs
  const formatDescription = (text: string) => {
    if (!text) return null;
    
    // Split by double newlines first (paragraph breaks), then by single newlines
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      // Handle single line breaks within paragraphs
      const lines = paragraph.split('\n').filter(line => line.trim());
      return (
        <p key={index} className="text-gray-700 leading-relaxed mb-4 last:mb-0">
          {lines.map((line, lineIndex) => (
            <React.Fragment key={lineIndex}>
              {line.trim()}
              {lineIndex < lines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      );
    });
  };

  // Validate images when product changes
  useEffect(() => {
    if (!product) return;

    const validateImages = async () => {
      const allImages = [
        product.image_url,
        ...(product.additional_images || [])
      ].filter(img => img && img.trim() !== '');

      const imageValidations = await Promise.all(
        allImages.map(async (img) => ({
          url: img,
          isValid: await isValidImage(img)
        }))
      );

      const validImageUrls = imageValidations
        .filter(item => item.isValid)
        .map(item => item.url);

      if (validImageUrls.length === 0) {
        setValidImages(["/placeholder.svg"]);
      } else {
        setValidImages(validImageUrls);
      }
      
      // Reset selected image if current selection is invalid
      setSelectedImage(0);
    };

    validateImages();
  }, [product]);

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
            {/* Main Product Image - Larger rectangle */}
            <div className="w-full max-w-lg mx-auto lg:mx-0 aspect-[4/3] rounded-lg overflow-hidden bg-white" style={{boxShadow: '0 0 20px rgba(0, 0, 0, 0.15)'}}>
              <img
                src={validImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain p-4"
              />
            </div>
            
            {/* Image Thumbnails - Only show if more than 1 valid image */}
            {validImages.length > 1 && (
              <div className="w-full max-w-lg mx-auto lg:mx-0">
                <div className="flex space-x-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
                  {validImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-50 border-2 transition-all duration-200 ${
                        selectedImage === index 
                          ? "border-yorbot-orange shadow-md scale-105" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-contain p-2"
                      />
                    </button>
                  ))}
                </div>
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
        <div className="bg-white rounded-lg shadow-sm mb-12">
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
                    <div>{formatDescription(product.description)}</div>
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
                  <Table>
                    <TableBody>
                      {Object.entries(product.specifications as Record<string, any>).map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell className="font-medium text-gray-700 capitalize w-1/3 text-center">
                            {key.replace('_', ' ')}
                          </TableCell>
                          <TableCell className="text-gray-600 text-center">
                            {String(value)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-gray-500 italic">No specifications available for this product.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Recommended Products Section */}
        {filteredRecommendedProducts.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-6">Recommended Products</h3>
              <Carousel
                opts={{
                  align: "start",
                  loop: false,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {filteredRecommendedProducts.map((recommendedProduct) => (
                    <CarouselItem key={recommendedProduct.id} className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                      <Link to={`/product/${recommendedProduct.slug}`}>
                        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow h-full">
                          <div className="aspect-square overflow-hidden bg-gray-50 flex items-center justify-center">
                            <img
                              src={recommendedProduct.image_url || "/placeholder.svg"}
                              alt={recommendedProduct.name}
                              className="max-w-full max-h-full object-contain hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="p-3">
                            <h4 className="text-sm font-semibold line-clamp-2 mb-2 hover:text-yorbot-orange transition-colors">
                              {recommendedProduct.name}
                            </h4>
                            <div className="flex items-center justify-between">
                              {recommendedProduct.sale_price ? (
                                <>
                                  <span className="text-sm font-bold text-yorbot-orange">
                                    ₹{recommendedProduct.sale_price.toFixed(2)}
                                  </span>
                                  <span className="text-xs text-gray-500 line-through">
                                    ₹{recommendedProduct.price.toFixed(2)}
                                  </span>
                                </>
                              ) : (
                                <span className="text-sm font-bold text-yorbot-orange">
                                  ₹{recommendedProduct.price.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Product;
