
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Mock product data
const product = {
  id: 1,
  name: "Arduino Uno R3",
  price: 550,
  discountedPrice: 495,
  discount: 10,
  inStock: true,
  category: "Development Boards",
  subcategory: "Arduino",
  rating: 4.8,
  reviewCount: 124,
  description: "Arduino Uno R3 is a microcontroller board based on the ATmega328P. It has 14 digital input/output pins, 6 analog inputs, a 16 MHz ceramic resonator, a USB connection, a power jack, an ICSP header and a reset button.",
  images: [
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80",
  ],
  specifications: [
    { name: "Microcontroller", value: "ATmega328P" },
    { name: "Operating Voltage", value: "5V" },
    { name: "Input Voltage (recommended)", value: "7-12V" },
    { name: "Digital I/O Pins", value: "14 (of which 6 provide PWM output)" },
    { name: "Analog Input Pins", value: "6" },
    { name: "DC Current per I/O Pin", value: "20 mA" },
    { name: "Flash Memory", value: "32 KB (ATmega328P)" },
    { name: "SRAM", value: "2 KB (ATmega328P)" },
    { name: "EEPROM", value: "1 KB (ATmega328P)" },
    { name: "Clock Speed", value: "16 MHz" },
  ],
  additionalInfo: [
    { name: "Package Contents", value: "1 x Arduino Uno R3, 1 x USB Cable" },
    { name: "Warranty", value: "6 months" },
    { name: "Origin", value: "Made in Italy" },
    { name: "Dimensions", value: "68.6 x 53.4 mm" },
    { name: "Weight", value: "25g" },
  ],
};

// Mock related products
const relatedProducts = [
  {
    id: 2,
    name: "Arduino Nano",
    price: 450,
    discountedPrice: null,
    discount: 0,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80",
    inStock: true,
  },
  {
    id: 3,
    name: "Arduino Mega 2560",
    price: 950,
    discountedPrice: 855,
    discount: 10,
    image: "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?auto=format&fit=crop&w=300&q=80",
    inStock: true,
  },
  {
    id: 4,
    name: "ESP32 Development Board",
    price: 650,
    discountedPrice: null,
    discount: 0,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=300&q=80",
    inStock: true,
  },
  {
    id: 5,
    name: "ESP8266 NodeMCU",
    price: 350,
    discountedPrice: null,
    discount: 0,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=300&q=80",
    inStock: false,
  },
];

const Product: React.FC = () => {
  const { toast } = useToast();
  const [mainImage, setMainImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Handle quantity change
  const updateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
  };

  // Handle add to cart
  const addToCart = () => {
    toast({
      title: "Added to cart!",
      description: `${product.name} (Qty: ${quantity}) has been added to your cart.`,
      variant: "default",
    });
  };

  // Handle add to wishlist
  const toggleWishlist = () => {
    setIsInWishlist(!isInWishlist);
    toast({
      title: isInWishlist ? "Removed from wishlist" : "Added to wishlist!",
      description: `${product.name} has been ${isInWishlist ? "removed from" : "added to"} your wishlist.`,
      variant: "default",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to="/" className="text-gray-500 hover:text-yorbot-orange">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="text-gray-500 hover:text-yorbot-orange">Shop</Link>
          <span className="mx-2">/</span>
          <Link 
            to={`/shop/${product.category.toLowerCase().replace(/\s+/g, "-")}`} 
            className="text-gray-500 hover:text-yorbot-orange"
          >
            {product.category}
          </Link>
          <span className="mx-2">/</span>
          <span className="font-semibold">{product.name}</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Product Images */}
          <div>
            <div className="grid grid-cols-12 gap-4">
              {/* Thumbnails */}
              <div className="col-span-2 space-y-4">
                {product.images.map((image, index) => (
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
                ))}
              </div>
              
              {/* Main Image */}
              <div className="col-span-10">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src={mainImage} 
                    alt={product.name} 
                    className="w-full h-auto object-contain aspect-square"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Details */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
              <span className={`px-3 py-1 rounded-full text-sm ${
                product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
            
            <div className="flex items-center mb-4">
              <div className="flex mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(product.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
            
            <div className="mb-6">
              {product.discountedPrice ? (
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-yorbot-orange mr-2">
                    ₹{product.discountedPrice.toFixed(2)}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    ₹{product.price.toFixed(2)}
                  </span>
                  <span className="ml-2 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                    {product.discount}% OFF
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold">
                  ₹{product.price.toFixed(2)}
                </span>
              )}
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700">{product.description}</p>
            </div>
            
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
                  disabled={!product.inStock}
                  className={`flex items-center px-6 py-3 rounded-md ${
                    product.inStock
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
                Category: <Link to={`/shop/${product.category.toLowerCase().replace(/\s+/g, "-")}`} className="text-yorbot-orange hover:underline">{product.category}</Link>
                {product.subcategory && (
                  <span> / <Link to={`/shop/${product.category.toLowerCase().replace(/\s+/g, "-")}/${product.subcategory.toLowerCase().replace(/\s+/g, "-")}`} className="text-yorbot-orange hover:underline">{product.subcategory}</Link></span>
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
                <p>
                  The Arduino Uno R3 is the most used and documented board in the Arduino family. It is a microcontroller board based on the ATmega328P, featuring 14 digital input/output pins (of which 6 can be used as PWM outputs), 6 analog inputs, a 16 MHz ceramic resonator, a USB connection, a power jack, an ICSP header, and a reset button.
                </p>
                <p className="mt-4">
                  This board contains everything needed to support the microcontroller; simply connect it to a computer with a USB cable or power it with an AC-to-DC adapter or battery to get started. The Uno differs from all preceding boards in that it does not use the FTDI USB-to-serial driver chip. Instead, it features the Atmega16U2 programmed as a USB-to-serial converter.
                </p>
                <p className="mt-4">
                  "Uno" means one in Italian and was chosen to mark the release of Arduino Software (IDE) 1.0. The Uno board and version 1.0 of Arduino Software (IDE) were the reference versions of Arduino, now evolved to newer releases. The Uno board is the first in a series of USB Arduino boards, and the reference model for the Arduino platform.
                </p>
              </div>
            )}
            
            {activeTab === "specifications" && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="divide-y divide-gray-200">
                    {product.specifications.map((spec, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 w-1/3">{spec.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {activeTab === "additional" && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="divide-y divide-gray-200">
                    {product.additionalInfo.map((info, index) => (
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
        <div>
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((product) => (
              <Link 
                key={product.id}
                to={`/product/${product.id}`}
                className="group"
              >
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow p-4">
                  <div className="relative mb-3 aspect-square overflow-hidden rounded-md">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-medium">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-medium mb-1 group-hover:text-yorbot-orange transition-colors">
                    {product.name}
                  </h3>
                  
                  <div>
                    {product.discountedPrice ? (
                      <div className="flex items-center">
                        <span className="font-semibold text-yorbot-orange">
                          ₹{product.discountedPrice.toFixed(2)}
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
      </div>
    </Layout>
  );
};

export default Product;
