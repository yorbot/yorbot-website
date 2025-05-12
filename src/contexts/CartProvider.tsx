
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';

// Define types for cart items and context
export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  name: string;
  price: number;
  image: string;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  addToCart: (product: Omit<CartItem, "id">) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  cartCount: 0,
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateQuantity: async () => {},
  clearCart: async () => {},
  isLoading: false
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadCartItems();
    } else {
      // If no user, use localStorage cart
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          setCart(Array.isArray(parsedCart) ? parsedCart : []);
        } catch (error) {
          console.error("Failed to parse cart from localStorage", error);
          setCart([]);
        }
      }
    }
  }, [user]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!user) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, user]);

  const loadCartItems = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      if (data) {
        // Transform the data to match our CartItem interface
        const transformedData: CartItem[] = data.map(item => ({
          id: item.id.toString(),
          product_id: item.product_id.toString(),
          quantity: item.quantity,
          name: item.product_name,
          price: item.price,
          image: item.product_image || ''
        }));
        
        setCart(transformedData);
      }
    } catch (error) {
      console.error('Error loading cart items:', error);
      toast({
        description: "Failed to load your cart items",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product: Omit<CartItem, "id">) => {
    setIsLoading(true);
    
    try {
      // Check if product is already in cart
      const existingItem = cart.find(item => item.product_id === product.product_id);
      
      if (existingItem) {
        await updateQuantity(existingItem.id, existingItem.quantity + product.quantity);
        toast({
          description: "Product quantity updated in cart",
          duration: 3000,
        });
        return;
      }
      
      if (user) {
        // Add to database if user is logged in
        const { data, error } = await supabase
          .from('cart_items')
          .insert([
            {
              user_id: user.id,
              product_id: parseInt(product.product_id),
              quantity: product.quantity,
              product_name: product.name,
              price: product.price,
              product_image: product.image
            }
          ])
          .select();
          
        if (error) throw error;
        
        if (data && data[0]) {
          const newItem: CartItem = {
            id: data[0].id.toString(),
            product_id: data[0].product_id.toString(),
            quantity: data[0].quantity,
            name: data[0].product_name,
            price: data[0].price,
            image: data[0].product_image || ''
          };
          
          setCart(prevCart => [...prevCart, newItem]);
        }
      } else {
        // Add to local cart if not logged in
        const newItem: CartItem = {
          ...product,
          id: Date.now().toString() // Generate a temporary ID
        };
        setCart(prevCart => [...prevCart, newItem]);
      }
      
      toast({
        description: "Product added to cart",
        duration: 3000,
      });
      
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast({
        description: "Failed to add product to cart",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (id: string) => {
    setIsLoading(true);
    
    try {
      if (user) {
        // Remove from database if user is logged in
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', parseInt(id));
          
        if (error) throw error;
      }
      
      // Remove from local state
      setCart(prevCart => prevCart.filter(item => item.id !== id));
      
      toast({
        description: "Product removed from cart",
        duration: 3000,
      });
      
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast({
        description: "Failed to remove product from cart",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    setIsLoading(true);
    
    try {
      if (quantity < 1) {
        await removeFromCart(id);
        return;
      }
      
      if (user) {
        // Update database if user is logged in
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', parseInt(id));
          
        if (error) throw error;
      }
      
      // Update local state
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
      
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      toast({
        description: "Failed to update product quantity",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    
    try {
      if (user) {
        // Clear database cart if user is logged in
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);
          
        if (error) throw error;
      }
      
      // Clear local state
      setCart([]);
      
      toast({
        description: "Cart cleared successfully",
        duration: 3000,
      });
      
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        description: "Failed to clear cart",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount: cart.reduce((total, item) => total + item.quantity, 0),
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isLoading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
