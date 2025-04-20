
import React, { useRef } from "react";
import { Link } from "react-router-dom";

const services = [
  {
    id: 1,
    name: "FDM 3D Printing",
    description: "High-quality 3D printing service for functional parts and prototypes",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    name: "SLA 3D Printing",
    description: "Precision resin printing for detailed parts and models",
    image: "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    name: "CNC Cutting",
    description: "Professional CNC machining for accurate custom components",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    name: "Laser Cutting",
    description: "Precise laser cutting services for various materials",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
  },
];

const OurServices: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Our Services</h2>

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
                className="flex-shrink-0 w-64 bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="h-40 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                  <Link
                    to="/contact-us"
                    className="block w-full bg-yorbot-orange text-white text-center py-2 rounded-md hover:bg-orange-600 transition-colors"
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

        {/* Desktop: Grid layout */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform hover:translate-y-[-5px]"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">{service.name}</h3>
                <p className="text-gray-600 mb-5">{service.description}</p>
                <Link
                  to="/contact-us"
                  className="block w-full bg-yorbot-orange text-white text-center py-2 rounded-md hover:bg-orange-600 transition-colors"
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
