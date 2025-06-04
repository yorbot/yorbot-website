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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{item.name}</h3>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-yorbot-orange">₹{item.price.toFixed(2)}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      item.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.inStock}
                      className="flex-1 bg-yorbot-orange text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist(item.id, item.name)}
                      className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-gray-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
