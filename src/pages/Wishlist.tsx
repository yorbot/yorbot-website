
import React from "react";
import Layout from "@/components/layout/Layout";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const Wishlist: React.FC = () => {
  const { addToCart } = useCart();
  const { wishlistItems, removeFromWishlist } = useWishlist();

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      image: item.image,
      price: item.price
    });

    toast("Added to cart!", {
      description: `${item.name} has been added to your cart.`,
      duration: 2000,
    });
  };

  const handleRemoveFromWishlist = (itemId: number, itemName: string) => {
    removeFromWishlist(itemId);
    toast("Removed from wishlist", {
      description: `${itemName} has been removed from your wishlist.`,
      duration: 2000,
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

        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Add some products to your wishlist to see them here.</p>
            <Link
              to="/shop"
              className="inline-flex items-center px-6 py-3 bg-yorbot-orange text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {wishlistItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row p-4">
                  {/* Product Image */}
                  <div className="w-full sm:w-32 h-32 flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between">
                    <div className="flex-1 mb-4 sm:mb-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                      <div className="flex items-center space-x-4 mb-2">
                        <span className="text-xl font-bold text-yorbot-orange">₹{item.price.toFixed(2)}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          item.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.inStock}
                        className="bg-yorbot-orange text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>
                      <button
                        onClick={() => handleRemoveFromWishlist(item.id, item.name)}
                        className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-gray-600"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Wishlist;
