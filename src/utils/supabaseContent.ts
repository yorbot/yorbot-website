
import { supabase } from "@/integrations/supabase/client";

export async function fetchProducts(categorySlug?: string, subcategorySlug?: string) {
  let query = supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  
  // If we have both category and subcategory slugs, find products in that hierarchy
  if (categorySlug && subcategorySlug) {
    // First get the category ID
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();
    
    // Then get the subcategory ID
    if (category) {
      const { data: subcategory } = await supabase
        .from("subcategories")
        .select("id")
        .eq("slug", subcategorySlug)
        .eq("category_id", category.id)
        .single();
      
      if (subcategory) {
        query = query.eq("subcategory_id", subcategory.id);
      }
    }
  } 
  // If we only have category slug, get products directly in that category
  else if (categorySlug) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();
    
    if (category) {
      query = query.eq("category_id", category.id);
    }
  }
  
  const { data, error } = await query;
  
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

export async function fetchBaseCategories() {
  const { data, error } = await supabase
    .from("base_categories")
    .select("*")
    .order("id");
  if (error) {
    console.error("Error fetching base categories:", error);
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
