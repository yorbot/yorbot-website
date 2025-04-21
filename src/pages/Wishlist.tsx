
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { ShoppingCart, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useWishlist, WishlistItem } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

const Wishlist: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { wishlistItems, wishlistCount, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();

  // Add item to cart
  const handleAddToCart = (item: WishlistItem) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart",
      });
      navigate("/sign-in", { state: { from: { pathname: "/wishlist" } } });
      return;
    }
    
    addToCart({
      id: item.id,
      name: item.name,
      image: item.image,
      price: item.price
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
        
        {wishlistCount === 0 ? (
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
                          onClick={() => handleAddToCart(item)}
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
                          onClick={() => removeFromWishlist(item.id)}
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
