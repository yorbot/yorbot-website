import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

export interface WishlistItem {
  id: number; // id is product_id, number type
  name: string;
  price: number;
  image: string;
  inStock?: boolean | null; // now matches backend structure
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: number) => void;
  isInWishlist: (id: number) => boolean;
  clearWishlist: () => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const loadWishlistItems = async () => {
      try {
        if (user) {
          const { data, error } = await supabase
            .from('wishlist_items')
            .select('*')
            .eq('user_id', user.id);

          if (error) {
            console.error("Error fetching wishlist items:", error);
            return;
          }

          const items = data.map((item: any): WishlistItem => ({
            id: item.product_id,
            name: item.product_name,
            price: Number(item.price),
            image: item.product_image || "",
            inStock: item.in_stock ?? null
          }));

          setWishlistItems(items);
        } else {
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

  useEffect(() => {
    if (!user) {
      localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, user]);

  const addToWishlist = async (item: WishlistItem) => {
    try {
      if (isInWishlist(item.id)) {
        toast("Already in wishlist", {
          description: `${item.name} is already in your wishlist`,
          duration: 2000,
        });
        return;
      }

      if (user) {
        const { error } = await supabase.from("wishlist_items").insert({
          user_id: user.id,
          product_id: item.id,
          product_name: item.name,
          price: item.price,
          product_image: item.image,
          in_stock: item.inStock
        });

        if (error) {
          console.error("Error adding item to wishlist:", error);
          toast("Failed to add to wishlist", {
            description: "Please try again",
            duration: 2000,
          });
          return;
        }
      }

      setWishlistItems([...wishlistItems, item]);
      toast("Added to wishlist", {
        description: `${item.name} has been added to your wishlist`,
        duration: 2000,
      });
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast("Failed to add to wishlist", {
        description: "Please try again",
        duration: 2000,
      });
    }
  };

  const removeFromWishlist = async (id: number) => {
    try {
      if (user) {
        const { error } = await supabase
          .from("wishlist_items")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", id);

        if (error) {
          console.error("Error removing item from wishlist:", error);
          toast("Failed to remove item", {
            description: "Please try again",
            duration: 2000,
          });
          return;
        }
      }

      setWishlistItems(wishlistItems.filter((item) => item.id !== id));
      toast("Item removed", {
        description: "Item has been removed from your wishlist",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast("Failed to remove item", {
        description: "Please try again",
        duration: 2000,
      });
    }
  };

  const isInWishlist = (id: number) => {
    return wishlistItems.some((item) => item.id === id);
  };

  const clearWishlist = async () => {
    try {
      if (user) {
        const { error } = await supabase
          .from("wishlist_items")
          .delete()
          .eq("user_id", user.id);

        if (error) {
          console.error("Error clearing wishlist:", error);
          toast("Failed to clear wishlist", {
            description: "Please try again",
            duration: 2000,
          });
          return;
        }
      }

      setWishlistItems([]);
      toast("Wishlist cleared", {
        description: "All items have been removed from your wishlist",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      toast("Failed to clear wishlist", {
        description: "Please try again",
        duration: 2000,
      });
    }
  };

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
