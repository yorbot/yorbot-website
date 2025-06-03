
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
  stock?: number;
  additional_images?: string[];
  specifications?: Record<string, any>;
  featured?: boolean;
  created_at?: string;
  updated_at?: string;
  discount_percentage?: number;
  tags?: string[];
  sku?: string;
}

export function useShopProducts(categoryId?: number, subcategoryId?: number) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      let query = supabase.from("products").select("*").order("created_at", { ascending: false });

      if (subcategoryId) {
        // If subcategory is provided, only show products from that subcategory
        query = query.eq("subcategory_id", subcategoryId);
      } else if (categoryId) {
        // If only category is provided, show products that are directly in the category
        query = query.eq("category_id", categoryId);
      }

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
    }
  }, [categoryId, subcategoryId]);

  return { products, loading };
}
