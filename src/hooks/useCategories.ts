
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useCategories() {
  return useQuery({
    queryKey: ['categories-with-subcategories'],
    queryFn: async () => {
      // Fetch categories
      const { data: categories, error: catError } = await supabase
        .from('categories')
        .select('id, name, slug, image_url');

      if (catError) throw catError;

      // Fetch subcategories for all categories
      const { data: subcategories, error: subError } = await supabase
        .from('subcategories')
        .select('id, name, slug, category_id');

      if (subError) throw subError;

      // Merge subcategories into categories
      const categoriesWithSubs = (categories || []).map(cat => ({
        ...cat,
        subcategories: (subcategories || []).filter(sc => sc.category_id === cat.id)
      }));
      return categoriesWithSubs;
    }
  });
}
