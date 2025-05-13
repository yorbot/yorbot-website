
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
      let query = supabase.from("products").select("*").order("created_at", { ascending: false });

      if (subcategoryId) {
        query = query.eq("subcategory_id", subcategoryId);
      } else if (categoryId) {
        // Show products that belong to this category and have no subcategory, or all products in this category
        query = query.eq("category_id", categoryId);
      }
      const { data, error } = await query;
      setProducts(data || []);
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
