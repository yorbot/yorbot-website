
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const { user } = useAuth();

  // Load wishlist items from localStorage or database on mount
  useEffect(() => {
    const loadWishlistItems = async () => {
      try {
        if (user) {
          // Fetch wishlist items from database
          const { data, error } = await supabase
            .from('wishlist_items')
            .select('*')
            .eq('user_id', user.id);

          if (error) {
            console.error("Error fetching wishlist items:", error);
            return;
          }

          // Transform database items to WishlistItem format
          const items = data.map((item: any): WishlistItem => ({
            id: item.product_id,
            name: item.product_name,
            price: item.price,
            image: item.product_image
          }));

          setWishlistItems(items);
        } else {
          // Load from localStorage if not logged in
          const storedWishlist = localStorage.getItem("wishlist");
          if (storedWishlist) {
            setWishlistItems(JSON.parse(storedWishlist));
          }
        }
      } catch (error) {
        console.error("Error loading wishlist:", error);
      }
    };

    loadWishlistItems();
  }, [user]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (!user) {
      localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, user]);

  // Add item to wishlist
  const addToWishlist = async (item: WishlistItem) => {
    try {
      // Check if item already exists in wishlist
      if (isInWishlist(item.id)) {
        toast("Already in wishlist", {
          description: `${item.name} is already in your wishlist`
        });
        return;
      }

      if (user) {
        // Add to database if logged in
        const { error } = await supabase.from("wishlist_items").insert({
          user_id: user.id,
          product_id: item.id,
          product_name: item.name,
          price: item.price,
          product_image: item.image,
        });

        if (error) {
          console.error("Error adding item to wishlist:", error);
          toast("Failed to add to wishlist", {
            description: "Please try again"
          });
          return;
        }
      }

      // Update local state
      setWishlistItems([...wishlistItems, item]);
      toast("Added to wishlist", {
        description: `${item.name} has been added to your wishlist`
      });
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast("Failed to add to wishlist", {
        description: "Please try again"
      });
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (id: string) => {
    try {
      if (user) {
        // Remove from database if logged in
        const { error } = await supabase
          .from("wishlist_items")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", id);

        if (error) {
          console.error("Error removing item from wishlist:", error);
          toast("Failed to remove item", {
            description: "Please try again"
          });
          return;
        }
      }

      // Update local state
      setWishlistItems(wishlistItems.filter((item) => item.id !== id));
      toast("Item removed", {
        description: "Item has been removed from your wishlist"
      });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast("Failed to remove item", {
        description: "Please try again"
      });
    }
  };

  // Check if item is in wishlist
  const isInWishlist = (id: string) => {
    return wishlistItems.some((item) => item.id === id);
  };

  // Clear entire wishlist
  const clearWishlist = async () => {
    try {
      if (user) {
        // Clear all items from database if logged in
        const { error } = await supabase
          .from("wishlist_items")
          .delete()
          .eq("user_id", user.id);

        if (error) {
          console.error("Error clearing wishlist:", error);
          toast("Failed to clear wishlist", {
            description: "Please try again"
          });
          return;
        }
      }

      // Update local state
      setWishlistItems([]);
      toast("Wishlist cleared", {
        description: "All items have been removed from your wishlist"
      });
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      toast("Failed to clear wishlist", {
        description: "Please try again"
      });
    }
  };

  // Calculate total items in wishlist
  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
