import { supabase } from "@/integrations/supabase/client";

export async function fetchProducts(categorySlug?: string) {
  let query = supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
    
  if (categorySlug) {
    // First get the category ID for the slug
    const { data: categoryData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();
    
    if (categoryData?.id) {
      query = query.eq("category_id", categoryData.id);
    }
  }
  
  const { data, error } = await query.limit(8); // Limit to 8 products
  
  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  
  return data;
}

export async function fetchServices() {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching services:", error);
    return [];
  }
  return data;
}

export async function fetchCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("id");
  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  return data;
}

export async function fetchSubcategories(categoryId?: number) {
  let query = supabase
    .from("subcategories")
    .select("*")
    .order("id");
    
  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }
  
  const { data, error } = await query;
  if (error) {
    console.error("Error fetching subcategories:", error);
    return [];
  }
  return data;
}

export async function fetchPageContent(slug: string) {
  const { data, error } = await supabase
    .from("content_pages")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching page content for '${slug}':`, error);
    return null;
  }
  
  return data;
}
