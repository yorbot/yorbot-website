
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
  price: number;
  sale_price: number | null;
  description: string | null;
  category_id?: number | null;
  subcategory_id?: number | null;
}

export function useShopProducts(categoryId?: number, subcategoryId?: number) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      
      let query = supabase.from("products").select("*");

      if (subcategoryId) {
        // If a subcategory is selected, only show products from that subcategory
        query = query.eq("subcategory_id", subcategoryId);
      } else if (categoryId) {
        // If only a category is selected, show products from that category
        query = query.eq("category_id", categoryId);
      }

      // Apply sorting
      query = query.order("created_at", { ascending: false });
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } else {
        setProducts(data || []);
      }
      
      setLoading(false);
    }

    if (categoryId || subcategoryId) {
      fetchProducts();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [categoryId, subcategoryId]);

  return { products, loading };
}
