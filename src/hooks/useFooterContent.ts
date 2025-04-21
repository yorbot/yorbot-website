
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useFooterContent() {
  return useQuery({
    queryKey: ['footer-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('footer_content')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });
}
