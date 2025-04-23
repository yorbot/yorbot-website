
import { supabase } from "@/integrations/supabase/client";

export async function fetchProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
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

// Fetch a section by name (e.g. 'about-us', 'homepage-banner'), or fetch all
export async function fetchContentSection(section_name?: string) {
  let query = supabase
    .from("content_sections")
    .select("*")
    .order("created_at", { ascending: false });

  if (section_name) {
    query = query.eq("section_name", section_name);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching content section:", error);
    return [];
  }
  return data;
}
