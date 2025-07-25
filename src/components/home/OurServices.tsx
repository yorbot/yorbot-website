
import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchServices } from "@/utils/supabaseContent";
import { toast } from "sonner";

const OurServices: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const servicesData = await fetchServices();
        setServices(servicesData);
      } catch (error) {
        console.error("Error loading services:", error);
        toast.error("Failed to load services");
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 300;
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  if (loading) {
    return (
      <div className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Our Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                <div className="h-32 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6 mb-3"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return null;
  }

  return (
    <div className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Our Services</h2>

        {/* Mobile: Scrollable services */}
        <div className="relative md:hidden">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md"
            aria-label="Scroll left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform rotate-180">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto pb-4 hide-scrollbar gap-4"
            style={{ scrollbarWidth: 'none' }}
          >
            {services.map((service) => (
              <div
                key={service.id}
                className="flex-shrink-0 w-56 bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="h-28 overflow-hidden">
                  <img
                    src={service.image_url || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80"}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 h-32 flex flex-col">
                  <h3 className="text-sm font-semibold mb-2">{service.title}</h3>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-3 flex-1">{service.description}</p>
                  <Link
                    to="/contact-us"
                    className="block w-full bg-yorbot-orange text-white text-center py-2 rounded-md hover:bg-orange-600 transition-colors text-xs"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md"
            aria-label="Scroll right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Desktop: Grid layout - Increased width, reduced height */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform hover:translate-y-[-2px]"
            >
              <div className="h-32 overflow-hidden">
                <img
                  src={service.image_url || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80"}
                  alt={service.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 h-36 flex flex-col">
                <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4 text-sm line-clamp-2 flex-1">{service.description}</p>
                <Link
                  to="/contact-us"
                  className="block w-full bg-yorbot-orange text-white text-center py-2 rounded-md hover:bg-orange-600 transition-colors text-sm mt-auto"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurServices;
