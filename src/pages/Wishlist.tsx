
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { ShoppingCart, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Mock data for wishlist items
const initialWishlistItems = [
  {
    id: 1,
    name: "Arduino Uno R3",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=300&q=80",
    price: 550,
    inStock: true,
  },
  {
    id: 2,
    name: "Raspberry Pi 4 Model B",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80",
    price: 4200,
    inStock: true,
  },
  {
    id: 3,
    name: "Ultrasonic Sensor HC-SR04",
    image: "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?auto=format&fit=crop&w=300&q=80",
    price: 80,
    inStock: false,
  },
  {
    id: 4,
    name: "Robot Chassis Kit",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=300&q=80",
    price: 650,
    inStock: true,
  },
];

const Wishlist: React.FC = () => {
  const { toast } = useToast();
  const [wishlistItems, setWishlistItems] = useState(initialWishlistItems);

  // Remove item from wishlist
  const removeItem = (id: number) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id));
    toast({
      title: "Item removed",
      description: "Item has been removed from your wishlist.",
      variant: "default",
    });
  };

  // Add item to cart
  const addToCart = (item: typeof initialWishlistItems[0]) => {
    // In a real implementation, this would add the item to the cart
    console.log("Added to cart:", item);
    
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
      variant: "default",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to="/" className="text-gray-500 hover:text-yorbot-orange">Home</Link>
          <span className="mx-2">/</span>
          <span className="font-semibold">Wishlist</span>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold mb-8">My Wishlist</h1>
        
        {wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">You haven't added any items to your wishlist yet.</p>
            <Link 
              to="/shop" 
              className="bg-yorbot-orange text-white px-6 py-3 rounded-md font-medium hover:bg-orange-600 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-4 px-4 font-semibold">Product</th>
                    <th className="text-center py-4 px-4 font-semibold">Price</th>
                    <th className="text-center py-4 px-4 font-semibold">Stock Status</th>
                    <th className="text-center py-4 px-4 font-semibold">Action</th>
                    <th className="text-center py-4 px-4 font-semibold">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {wishlistItems.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-16 h-16 object-cover rounded mr-3"
                          />
                          <Link 
                            to={`/product/${item.id}`}
                            className="hover:text-yorbot-orange transition-colors"
                          >
                            {item.name}
                          </Link>
                        </div>
                      </td>
                      <td className="text-center py-4 px-4 font-medium">₹{item.price.toFixed(2)}</td>
                      <td className="text-center py-4 px-4">
                        <span 
                          className={`inline-block px-3 py-1 rounded-full text-sm ${
                            item.inStock 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td className="text-center py-4 px-4">
                        <button 
                          onClick={() => addToCart(item)}
                          disabled={!item.inStock}
                          className={`flex items-center mx-auto px-4 py-2 rounded-md transition-colors ${
                            item.inStock 
                              ? "bg-yorbot-orange text-white hover:bg-orange-600" 
                              : "bg-gray-200 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          <ShoppingCart size={16} className="mr-1" />
                          <span>Add to Cart</span>
                        </button>
                      </td>
                      <td className="text-center py-4 px-4">
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X size={20} className="mx-auto" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Wishlist;
