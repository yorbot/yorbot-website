
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
  base_category_id?: number | null;
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

export function useShopProducts(categoryId?: number, subcategoryId?: number, baseCategoryId?: number) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      let query = supabase.from("products").select("*").order("created_at", { ascending: false });

      if (baseCategoryId) {
        // If base category is provided, only show products from that base category
        query = query.eq("base_category_id", baseCategoryId);
      } else if (subcategoryId) {
        // If subcategory is provided, only show products from that subcategory
        query = query.eq("subcategory_id", subcategoryId);
      } else if (categoryId) {
        // If only category is provided, show products that are directly in the category
        query = query.eq("category_id", categoryId);
      }
      // If no categoryId, subcategoryId, or baseCategoryId, fetch all products (for product page search)

      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } else {
        // Map the Supabase data to our Product interface
        const mappedProducts: Product[] = (data || []).map((item: any) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          image_url: item.image_url,
          price: item.price,
          sale_price: item.sale_price,
          description: item.description,
          category_id: item.category_id,
          subcategory_id: item.subcategory_id,
          base_category_id: item.base_category_id,
          stock: item.stock,
          additional_images: Array.isArray(item.additional_images) ? item.additional_images : [],
          specifications: typeof item.specifications === 'object' ? item.specifications : {},
          featured: item.featured,
          created_at: item.created_at,
          updated_at: item.updated_at,
          discount_percentage: item.discount_percentage,
          tags: Array.isArray(item.tags) ? item.tags : [],
          sku: item.sku,
        }));
        
        setProducts(mappedProducts);
      }
      
      setLoading(false);
    }

    fetchProducts();
  }, [categoryId, subcategoryId, baseCategoryId]);

  return { products, loading };
}
