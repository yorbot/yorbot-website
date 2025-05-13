
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

export interface CartItem {
  id: number; // changed to number for product_id consistency
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void; // updated to number type
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const loadCartItems = async () => {
      try {
        if (user) {
          const { data, error } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', user.id);

          if (error) {
            console.error("Error fetching cart items:", error);
            return;
          }

          const items = data.map((item: any): CartItem => ({
            id: item.product_id,
            name: item.product_name,
            price: Number(item.price),
            quantity: item.quantity || 1,
            image: item.product_image || ""
          }));

          setCartItems(items);
        } else {
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

  useEffect(() => {
    if (!user) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = async (item: CartItem) => {
    try {
      const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        updateQuantity(item.id, existingItem.quantity + 1);
        return;
      }

      if (user) {
        // Correct property mapping and use product_id as number
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

  const removeFromCart = async (id: number) => {
    try {
      if (user) {
        // product_id should be a number
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

  const updateQuantity = async (id: number, quantity: number) => {
    try {
      if (quantity < 1) {
        removeFromCart(id);
        return;
      }

      if (user) {
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

  const clearCart = async () => {
    try {
      if (user) {
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
