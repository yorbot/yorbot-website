import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

export type CartItem = {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Calculate cart count
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Load cart items from local storage or database when component mounts
  useEffect(() => {
    const loadCartItems = async () => {
      if (user) {
        // If user is logged in, load cart from database
        const { data, error } = await supabase
          .from('cart_items')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error loading cart items:', error);
          return;
        }
        
        if (data) {
          const formattedItems: CartItem[] = data.map(item => ({
            id: item.product_id,
            name: item.product_name,
            image: item.product_image,
            price: item.price,
            quantity: item.quantity
          }));
          setCartItems(formattedItems);
        }
      } else {
        // If no user, try to load from localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            setCartItems(JSON.parse(savedCart));
          } catch (error) {
            console.error('Error parsing cart from localStorage', error);
          }
        }
      }
    };

    loadCartItems();
  }, [user]);

  // Save cart items to local storage or database whenever they change
  useEffect(() => {
    const saveCartItems = async () => {
      if (user) {
        // If a user is logged in, we'll handle this via database operations
        // Each operation (add, remove, update) will handle its own database updates
      } else {
        // Otherwise save to localStorage
        localStorage.setItem('cart', JSON.stringify(cartItems));
      }
    };

    saveCartItems();
  }, [cartItems, user]);

  const addToCart = async (item: Omit<CartItem, "quantity">) => {
    // Check if the item is already in the cart
    const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id);

    if (existingItemIndex > -1) {
      // Item already exists, increment quantity
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += 1;
      setCartItems(updatedCartItems);
      
      if (user) {
        // Update in database
        await supabase
          .from('cart_items')
          .update({ quantity: updatedCartItems[existingItemIndex].quantity })
          .eq('user_id', user.id)
          .eq('product_id', item.id);
      }
    } else {
      // Item doesn't exist, add it with quantity 1
      const newItem = { ...item, quantity: 1 };
      setCartItems([...cartItems, newItem]);
      
      if (user) {
        // Insert into database
        await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: item.id,
            product_name: item.name,
            product_image: item.image,
            price: item.price,
            quantity: 1
          });
      }
    }

    toast({
      title: "Item added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const removeFromCart = async (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
    
    if (user) {
      // Remove from database
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', id);
    }

    toast({
      title: "Item removed",
      description: "Item has been removed from your cart.",
    });
  };

  const updateQuantity = async (id: number, quantity: number) => {
    if (quantity < 1) return;

    const updatedCartItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );

    setCartItems(updatedCartItems);
    
    if (user) {
      // Update in database
      await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('product_id', id);
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    
    if (user) {
      // Clear all items from database
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
