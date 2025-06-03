import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number) => void;
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

  const addToCart = async (item: Omit<CartItem, 'quantity'>) => {
    try {
      if (user) {
        const { error } = await supabase.rpc("add_to_cart", {
          p_user_id: user.id,
          p_product_id: item.id,
          p_product_name: item.name,
          p_product_image: item.image,
          p_price: item.price,
          p_quantity: 1,
        });

        if (error) {
          console.error("Error adding item to cart:", error);
          toast("Failed to add to cart", {
            description: "Please try again",
            duration: 2000,
          });
          return;
        }

        const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);
        if (existingItem) {
          setCartItems(cartItems.map((cartItem) =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          ));
        } else {
          setCartItems([...cartItems, { ...item, quantity: 1 }]);
        }
      } else {
        const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);
        if (existingItem) {
          setCartItems(cartItems.map((cartItem) =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          ));
        } else {
          setCartItems([...cartItems, { ...item, quantity: 1 }]);
        }
      }

      toast("Added to cart", {
        description: `${item.name} has been added to your cart`,
        duration: 2000,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast("Failed to add to cart", {
        description: "Please try again",
        duration: 2000,
      });
    }
  };

  const removeFromCart = async (id: number) => {
    try {
      if (user) {
        const { error } = await supabase.rpc("remove_from_cart", {
          p_user_id: user.id,
          p_product_id: id,
        });

        if (error) {
          console.error("Error removing item from cart:", error);
          toast("Failed to remove item", {
            description: "Please try again",
            duration: 2000,
          });
          return;
        }
      }

      setCartItems(cartItems.filter((item) => item.id !== id));
      toast("Item removed", {
        description: "Item has been removed from your cart",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast("Failed to remove item", {
        description: "Please try again",
        duration: 2000,
      });
    }
  };

  const updateQuantity = async (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    try {
      if (user) {
        const { error } = await supabase.rpc("update_cart_item_quantity", {
          p_user_id: user.id,
          p_product_id: id,
          p_quantity: quantity,
        });

        if (error) {
          console.error("Error updating cart item quantity:", error);
          toast("Failed to update quantity", {
            description: "Please try again",
            duration: 2000,
          });
          return;
        }
      }

      setCartItems(cartItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ));
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast("Failed to update quantity", {
        description: "Please try again",
        duration: 2000,
      });
    }
  };

  const clearCart = async () => {
    try {
      if (user) {
        const { error } = await supabase.rpc("clear_cart", {
          p_user_id: user.id,
        });

        if (error) {
          console.error("Error clearing cart:", error);
          toast("Failed to clear cart", {
            description: "Please try again",
            duration: 2000,
          });
          return;
        }
      }

      setCartItems([]);
      toast("Cart cleared", {
        description: "All items have been removed from your cart",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast("Failed to clear cart", {
        description: "Please try again",
        duration: 2000,
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
