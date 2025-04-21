
import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

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

// Helper type for the database rows
type CartItemRow = {
  id: number;
  user_id: string;
  product_id: number;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
  created_at: string;
  updated_at: string;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast: uiToast } = useToast();
  const { user } = useAuth();

  // Calculate cart count
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const loadCartItems = async () => {
      if (user) {
        try {
          // Using a raw query for now since types aren't updated
          const { data, error } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', user.id);

          if (error) {
            console.error("Error loading cart items:", error);
            return;
          }
          
          if (data) {
            const formattedItems = data.map((item: any) => ({
              id: item.product_id,
              name: item.product_name,
              image: item.product_image,
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

    const existingItemIndex = cartItems.findIndex((i) => i.id === item.id);

    if (existingItemIndex > -1) {
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += 1;
      setCartItems(updatedCartItems);

      try {
        // Update DB quantity
        await supabase.rpc('update_cart_item_quantity', {
          p_user_id: user.id,
          p_product_id: item.id,
          p_quantity: updatedCartItems[existingItemIndex].quantity
        });
      } catch (err) {
        console.error("Error updating cart quantity:", err);
      }
    } else {
      const newItem = { ...item, quantity: 1 };
      setCartItems([...cartItems, newItem]);

      try {
        // Insert to DB
        await supabase.rpc('add_to_cart', {
          p_user_id: user.id,
          p_product_id: item.id,
          p_product_name: item.name,
          p_product_image: item.image,
          p_price: item.price,
          p_quantity: 1
        });
      } catch (err) {
        console.error("Error adding item to cart:", err);
      }
    }

    toast("Item added to cart", {
      description: `${item.name} has been added to your cart.`,
    });
  };

  const removeFromCart = async (id: number) => {
    if (!user) {
      toast("Sign in required", {
        description: "Please sign in to remove items from your cart",
      });
      return;
    }

    setCartItems(cartItems.filter((item) => item.id !== id));

    try {
      await supabase.rpc('remove_from_cart', {
        p_user_id: user.id,
        p_product_id: id
      });
    } catch (err) {
      console.error("Error removing from cart:", err);
    }

    toast("Item removed", {
      description: "Item has been removed from your cart.",
    });
  };

  const updateQuantity = async (id: number, quantity: number) => {
    if (!user) {
      toast("Sign in required", {
        description: "Please sign in to update cart items",
      });
      return;
    }
    
    if (quantity < 1) return;

    const updatedCartItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    setCartItems(updatedCartItems);

    try {
      await supabase.rpc('update_cart_item_quantity', {
        p_user_id: user.id,
        p_product_id: id,
        p_quantity: quantity
      });
    } catch (err) {
      console.error("Error updating cart quantity:", err);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    setCartItems([]);
    
    try {
      await supabase.rpc('clear_cart', {
        p_user_id: user.id
      });
    } catch (err) {
      console.error("Error clearing cart:", err);
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
