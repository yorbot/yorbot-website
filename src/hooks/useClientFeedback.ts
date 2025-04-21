
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useClientFeedback() {
  return useQuery({
    queryKey: ['client-feedback'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_feedback')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}
