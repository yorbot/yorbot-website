
import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { toast } from "sonner";
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
  const { user } = useAuth();
  
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const loadCartItems = async () => {
      if (user) {
        try {
          const { data: cartData, error } = await supabase
            .rpc('load_cart_items', { p_user_id: user.id });

          if (error) {
            console.error("Error loading cart items:", error);
            return;
          }
          
          if (cartData) {
            const formattedItems: CartItem[] = cartData.map((item: any) => ({
              id: item.product_id,
              name: item.product_name,
              image: item.product_image || '',
              price: item.price,
              quantity: item.quantity,
            }));
            setCartItems(formattedItems);
          }
        } catch (err) {
          console.error("Error in loadCartItems:", err);
        }
      } else {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          try {
            setCartItems(JSON.parse(savedCart));
          } catch (error) {
            console.error("Error parsing cart from localStorage", error);
          }
        }
      }
    };

    loadCartItems();
  }, [user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = async (item: Omit<CartItem, "quantity">) => {
    if (!user) {
      toast("Sign in required", {
        description: "Please sign in to add items to your cart",
      });
      return;
    }

    try {
      const { error } = await supabase.rpc('add_to_cart', {
        p_user_id: user.id,
        p_product_id: item.id,
        p_product_name: item.name,
        p_product_image: item.image,
        p_price: item.price,
        p_quantity: 1
      });

      if (error) throw error;

      const existingItemIndex = cartItems.findIndex((i) => i.id === item.id);
      if (existingItemIndex > -1) {
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex].quantity += 1;
        setCartItems(updatedCartItems);
      } else {
        setCartItems([...cartItems, { ...item, quantity: 1 }]);
      }

      toast("Item added to cart", {
        description: `${item.name} has been added to your cart.`,
      });
    } catch (err) {
      console.error("Error adding item to cart:", err);
      toast("Error", {
        description: "Could not add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const removeFromCart = async (id: number) => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('remove_from_cart', {
        p_user_id: user.id,
        p_product_id: id
      });

      if (error) throw error;

      setCartItems(cartItems.filter((item) => item.id !== id));
      toast("Item removed", {
        description: "Item has been removed from your cart.",
      });
    } catch (err) {
      console.error("Error removing from cart:", err);
      toast("Error", {
        description: "Could not remove item from cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateQuantity = async (id: number, quantity: number) => {
    if (!user || quantity < 1) return;

    try {
      const { error } = await supabase.rpc('update_cart_item_quantity', {
        p_user_id: user.id,
        p_product_id: id,
        p_quantity: quantity
      });

      if (error) throw error;

      const updatedCartItems = cartItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
      setCartItems(updatedCartItems);
    } catch (err) {
      console.error("Error updating cart quantity:", err);
      toast("Error", {
        description: "Could not update quantity. Please try again.",
        variant: "destructive",
      });
    }
  };

  const clearCart = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase.rpc('clear_cart', {
        p_user_id: user.id
      });

      if (error) throw error;

      setCartItems([]);
    } catch (err) {
      console.error("Error clearing cart:", err);
      toast("Error", {
        description: "Could not clear cart. Please try again.",
        variant: "destructive",
      });
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
