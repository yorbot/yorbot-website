
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image_url: string;
  link: string;
  position: number;
  is_active: boolean;
}

const HeroBanner: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBanners() {
      try {
        const { data, error } = await supabase
          .from('banners')
          .select('*')
          .eq('type', 'hero')
          .eq('is_active', true)
          .order('position');

        if (error) {
          console.error('Error fetching banners:', error);
          return;
        }

        if (data && data.length > 0) {
          setBanners(data);
        } else {
          // Fallback to default banners if none found in database
          setBanners([
            {
              id: 1,
              title: "DIY Project Kits",
              subtitle: "sale up to 30%",
              image_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1800&q=80",
              link: "/shop/project-kits",
              position: 1,
              is_active: true
            },
            {
              id: 2,
              title: "Development Boards",
              subtitle: "sale up to 10%",
              image_url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1800&q=80",
              link: "/shop/development-boards",
              position: 2,
              is_active: true
            },
            {
              id: 3,
              title: "Get Your Customized Projects",
              subtitle: "Expert solutions tailored for you",
              image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1800&q=80",
              link: "/customized-projects",
              position: 3,
              is_active: true
            },
          ]);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (loading) {
    return (
      <div className="px-4 md:px-8 lg:px-12 py-4">
        <div className="relative h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden bg-gray-200 animate-pulse rounded-xl">
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="h-8 w-64 bg-gray-300 rounded mb-2"></div>
            <div className="h-6 w-48 bg-gray-300 rounded mb-4"></div>
            <div className="h-10 w-32 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="px-4 md:px-8 lg:px-12 py-4">
      <div className="relative h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-xl shadow-lg">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div
              className="w-full h-full bg-cover bg-center rounded-xl"
              style={{ backgroundImage: `url(${banner.image_url})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4">{banner.title}</h2>
                <p className="text-xl md:text-2xl mb-4 md:mb-6 uppercase">{banner.subtitle}</p>
                <Link
                  to={banner.link}
                  className="bg-white text-yorbot-orange flex items-center space-x-2 px-6 py-2 rounded hover:bg-gray-100 transition-colors"
                >
                  <span>Shop Now</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        ))}

        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide ? "bg-yorbot-orange" : "bg-white bg-opacity-50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
