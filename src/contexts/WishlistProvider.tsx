
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';

// Define types for wishlist items and context
export interface WishlistItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  wishlistCount: number;
  addToWishlist: (product: WishlistItem) => Promise<void>;
  removeFromWishlist: (id: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  wishlistCount: 0,
  addToWishlist: async () => {},
  removeFromWishlist: async () => {},
  clearWishlist: async () => {},
  isInWishlist: () => false,
  isLoading: false
});

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadWishlistItems();
    } else {
      // If no user, use localStorage wishlist
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        try {
          const parsedWishlist = JSON.parse(savedWishlist);
          setWishlist(Array.isArray(parsedWishlist) ? parsedWishlist : []);
        } catch (error) {
          console.error("Failed to parse wishlist from localStorage", error);
          setWishlist([]);
        }
      }
    }
  }, [user]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (!user) {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  const loadWishlistItems = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;
      setWishlist(data || []);
    } catch (error) {
      console.error('Error loading wishlist items:', error);
      toast({
        description: "Failed to load your wishlist",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addToWishlist = async (product: WishlistItem) => {
    setIsLoading(true);
    
    try {
      // Check if product is already in wishlist
      const existingItem = wishlist.find(item => item.product_id === product.product_id);
      
      if (existingItem) {
        toast({
          description: "Product is already in your wishlist",
          duration: 3000,
        });
        setIsLoading(false);
        return;
      }
      
      if (user) {
        // Add to database if user is logged in
        const { data, error } = await supabase
          .from('wishlist_items')
          .insert([
            {
              user_id: user.id,
              product_id: product.product_id,
              name: product.name,
              price: product.price,
              image: product.image
            }
          ])
          .select();
          
        if (error) throw error;
        setWishlist(prevWishlist => [...prevWishlist, data[0]]);
      } else {
        // Add to local wishlist if not logged in
        setWishlist(prevWishlist => [...prevWishlist, product]);
      }
      
      toast({
        description: "Product added to wishlist",
        duration: 3000,
      });
      
    } catch (error) {
      console.error('Error adding item to wishlist:', error);
      toast({
        description: "Failed to add product to wishlist",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (id: string) => {
    setIsLoading(true);
    
    try {
      if (user) {
        // Remove from database if user is logged in
        const { error } = await supabase
          .from('wishlist_items')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
      }
      
      // Remove from local state
      setWishlist(prevWishlist => prevWishlist.filter(item => item.id !== id));
      
      toast({
        description: "Product removed from wishlist",
        duration: 3000,
      });
      
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
      toast({
        description: "Failed to remove product from wishlist",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearWishlist = async () => {
    setIsLoading(true);
    
    try {
      if (user) {
        // Clear database wishlist if user is logged in
        const { error } = await supabase
          .from('wishlist_items')
          .delete()
          .eq('user_id', user.id);
          
        if (error) throw error;
      }
      
      // Clear local state
      setWishlist([]);
      
      toast({
        description: "Wishlist cleared successfully",
        duration: 3000,
      });
      
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast({
        description: "Failed to clear wishlist",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.product_id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
        isLoading
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
