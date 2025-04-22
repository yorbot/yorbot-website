
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image_url: string;
  link: string;
  button_text: string;
  is_active: boolean;
}

const CadBanner: React.FC = () => {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBanner() {
      try {
        const { data, error } = await supabase
          .from('banners')
          .select('*')
          .eq('type', 'cad')
          .eq('is_active', true)
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error code
          console.error('Error fetching CAD banner:', error);
          return;
        }
        
        if (data) {
          setBanner(data);
        } else {
          // Fallback to default banner if none in database
          setBanner({
            id: 0,
            title: "Get Your Customized CAD Design",
            subtitle: "Professional 3D modeling and design services for your robotics projects",
            image_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1800&q=80",
            link: "/contact-us",
            button_text: "Contact Us",
            is_active: true
          });
        }
      } catch (error) {
        console.error('Error fetching CAD banner:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBanner();
  }, []);

  if (loading) {
    return (
      <div className="py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="relative rounded-xl overflow-hidden h-64 md:h-80 bg-gray-200 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!banner) {
    return null;
  }

  return (
    <div className="py-10 md:py-16">
      <div className="container mx-auto px-4">
        <div 
          className="relative rounded-xl overflow-hidden bg-cover bg-center h-64 md:h-80"
          style={{ 
            backgroundImage: `url('${banner.image_url}')` 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>
          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12">
            <h2 className="text-white text-2xl md:text-4xl font-bold mb-4">
              {banner.title}
            </h2>
            <p className="text-white text-sm md:text-base mb-6 max-w-md">
              {banner.subtitle}
            </p>
            <Link
              to={banner.link}
              className="inline-block bg-white text-yorbot-orange px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors w-fit"
            >
              {banner.button_text || "Contact Us"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadBanner;
