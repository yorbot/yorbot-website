
import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

export type WishlistItem = {
  id: number;
  name: string;
  image: string;
  price: number;
  inStock: boolean;
};

type WishlistContextType = {
  wishlistItems: WishlistItem[];
  wishlistCount: number;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: number) => void;
  isInWishlist: (id: number) => boolean;
  clearWishlist: () => void;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const wishlistCount = wishlistItems.length;

  // Load wishlist items from localStorage or database when component mounts
  useEffect(() => {
    const loadWishlistItems = async () => {
      if (user) {
        // If user is logged in, load wishlist from database
        const { data, error } = await supabase
          .from('wishlist_items')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error loading wishlist items:', error);
          return;
        }
        
        if (data) {
          const formattedItems: WishlistItem[] = data.map(item => ({
            id: item.product_id,
            name: item.product_name,
            image: item.product_image,
            price: item.price,
            inStock: item.in_stock
          }));
          setWishlistItems(formattedItems);
        }
      } else {
        // If no user, try to load from localStorage
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
          try {
            setWishlistItems(JSON.parse(savedWishlist));
          } catch (error) {
            console.error('Error parsing wishlist from localStorage', error);
          }
        }
      }
    };

    loadWishlistItems();
  }, [user]);

  // Save wishlist items to localStorage whenever they change
  useEffect(() => {
    const saveWishlistItems = async () => {
      if (!user) {
        localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
      }
      // If user is logged in, we handle database operations in the individual functions
    };

    saveWishlistItems();
  }, [wishlistItems, user]);

  const isInWishlist = (id: number) => {
    return wishlistItems.some(item => item.id === id);
  };

  const addToWishlist = async (item: WishlistItem) => {
    if (isInWishlist(item.id)) {
      toast({
        title: "Already in wishlist",
        description: `${item.name} is already in your wishlist.`,
      });
      return;
    }

    setWishlistItems([...wishlistItems, item]);
    
    if (user) {
      // Insert into database
      await supabase
        .from('wishlist_items')
        .insert({
          user_id: user.id,
          product_id: item.id,
          product_name: item.name,
          product_image: item.image,
          price: item.price,
          in_stock: item.inStock
        });
    }

    toast({
      title: "Added to wishlist",
      description: `${item.name} has been added to your wishlist.`,
    });
  };

  const removeFromWishlist = async (id: number) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
    
    if (user) {
      // Remove from database
      await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', id);
    }

    toast({
      title: "Removed from wishlist",
      description: "Item has been removed from your wishlist.",
    });
  };

  const clearWishlist = async () => {
    setWishlistItems([]);
    
    if (user) {
      // Clear all items from database
      await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', user.id);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
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
