
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

// Define type for the cart_items table row
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
  const { toast } = useToast();
  const { user } = useAuth();

  // Calculate cart count
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const loadCartItems = async () => {
      if (user) {
        // Load from backend cart_items table
        const { data, error } = await supabase
          .from<CartItemRow>("cart_items")
          .select("*")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error loading cart items:", error);
          return;
        }
        if (data) {
          const formattedItems = data.map((item) => ({
            id: item.product_id,
            name: item.product_name,
            image: item.product_image,
            price: item.price,
            quantity: item.quantity,
          }));
          setCartItems(formattedItems);
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
    if (user) {
      // Syncing to db happens in add/remove/update methods
    } else {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = async (item: Omit<CartItem, "quantity">) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart",
        variant: "destructive",
      });
      return;
    }

    const existingItemIndex = cartItems.findIndex((i) => i.id === item.id);

    if (existingItemIndex > -1) {
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += 1;
      setCartItems(updatedCartItems);

      // Update DB quantity
      await supabase
        .from("cart_items")
        .update({ quantity: updatedCartItems[existingItemIndex].quantity })
        .eq("user_id", user.id)
        .eq("product_id", item.id);
    } else {
      const newItem = { ...item, quantity: 1 };
      setCartItems([...cartItems, newItem]);

      // Insert to DB
      await supabase.from("cart_items").insert({
        user_id: user.id,
        product_id: item.id,
        product_name: item.name,
        product_image: item.image,
        price: item.price,
        quantity: 1,
      });
    }

    toast({
      title: "Item added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const removeFromCart = async (id: number) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to remove items from your cart",
        variant: "destructive",
      });
      return;
    }

    setCartItems(cartItems.filter((item) => item.id !== id));

    await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", id);

    toast({
      title: "Item removed",
      description: "Item has been removed from your cart.",
    });
  };

  const updateQuantity = async (id: number, quantity: number) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to update cart items",
        variant: "destructive",
      });
      return;
    }
    if (quantity < 1) return;

    const updatedCartItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    setCartItems(updatedCartItems);

    await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("user_id", user.id)
      .eq("product_id", id);
  };

  const clearCart = async () => {
    if (!user) return;
    setCartItems([]);
    await supabase.from("cart_items").delete().eq("user_id", user.id);
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
