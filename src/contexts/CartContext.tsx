
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../integrations/supabase/client";
import { useAuth } from "./AuthContext"; 
import { toast } from "sonner";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  // Load cart items from localStorage or database on mount
  useEffect(() => {
    const loadCartItems = async () => {
      try {
        if (user) {
          // Fetch cart items from database
          const { data, error } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', user.id);

          if (error) {
            console.error("Error fetching cart items:", error);
            return;
          }

          // Transform database items to CartItem format
          const items = data.map((item: any): CartItem => ({
            id: item.product_id,
            name: item.product_name,
            price: item.price,
            quantity: item.quantity,
            image: item.product_image
          }));

          setCartItems(items);
        } else {
          // Load from localStorage if not logged in
          const storedCart = localStorage.getItem("cart");
          if (storedCart) {
            setCartItems(JSON.parse(storedCart));
          }
        }
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    };

    loadCartItems();
  }, [user]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!user) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  // Add item to cart
  const addToCart = async (item: CartItem) => {
    try {
      // Check if item already exists in cart
      const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        // Update quantity if item exists
        updateQuantity(item.id, existingItem.quantity + 1);
        return;
      }

      if (user) {
        // Add to database if logged in
        const { error } = await supabase.from("cart_items").insert({
          user_id: user.id,
          product_id: item.id,
          product_name: item.name,
          price: item.price,
          quantity: item.quantity,
          product_image: item.image,
        });

        if (error) {
          console.error("Error adding item to cart:", error);
          toast("Failed to add to cart", {
            description: "Please try again"
          });
          return;
        }
      }

      // Update local state
      setCartItems([...cartItems, item]);
      toast("Added to cart", {
        description: `${item.name} has been added to your cart`
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast("Failed to add to cart", {
        description: "Please try again"
      });
    }
  };

  // Remove item from cart
  const removeFromCart = async (id: string) => {
    try {
      if (user) {
        // Remove from database if logged in
        const { error } = await supabase
          .from("cart_items")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", id);

        if (error) {
          console.error("Error removing item from cart:", error);
          toast("Failed to remove item", {
            description: "Please try again"
          });
          return;
        }
      }

      // Update local state
      setCartItems(cartItems.filter((item) => item.id !== id));
      toast("Item removed", {
        description: "Item has been removed from your cart"
      });
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast("Failed to remove item", {
        description: "Please try again"
      });
    }
  };

  // Update item quantity
  const updateQuantity = async (id: string, quantity: number) => {
    try {
      // Don't allow quantities less than 1
      if (quantity < 1) {
        removeFromCart(id);
        return;
      }

      if (user) {
        // Update quantity in database if logged in
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity })
          .eq("user_id", user.id)
          .eq("product_id", id);

        if (error) {
          console.error("Error updating cart quantity:", error);
          toast("Failed to update quantity", {
            description: "Please try again"
          });
          return;
        }
      }

      // Update local state
      setCartItems(
        cartItems.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast("Failed to update quantity", {
        description: "Please try again"
      });
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      if (user) {
        // Clear all items from database if logged in
        const { error } = await supabase
          .from("cart_items")
          .delete()
          .eq("user_id", user.id);

        if (error) {
          console.error("Error clearing cart:", error);
          toast("Failed to clear cart", {
            description: "Please try again"
          });
          return;
        }
      }

      // Update local state
      setCartItems([]);
      toast("Cart cleared", {
        description: "All items have been removed from your cart"
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast("Failed to clear cart", {
        description: "Please try again"
      });
    }
  };

  // Calculate total items in cart
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
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
