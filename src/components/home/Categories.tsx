
import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Development Boards",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80",
    slug: "development-boards",
  },
  {
    id: 2,
    name: "Sensors",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    slug: "sensors",
  },
  {
    id: 3,
    name: "3D Printer & Accessories",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
    slug: "3d-printer",
  },
  {
    id: 4,
    name: "Drone Parts",
    image: "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?auto=format&fit=crop&w=600&q=80",
    slug: "drone-parts",
  },
  {
    id: 5,
    name: "Motors, Pumps, Drivers & Actuators",
    image: "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?auto=format&fit=crop&w=600&q=80",
    slug: "motors-and-drivers",
  },
  {
    id: 6,
    name: "E-Bike",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
    slug: "ebike",
  },
  {
    id: 7,
    name: "Display & Electric Parts",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    slug: "display-and-electric",
  },
  {
    id: 8,
    name: "Resistors, Wires & Cables",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80",
    slug: "resistors-and-wires",
  },
  {
    id: 9,
    name: "Project Kits",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80",
    slug: "project-kits",
  },
  {
    id: 10,
    name: "Tools & Equipment",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80",
    slug: "tools-and-equipment",
  },
  {
    id: 11,
    name: "Mechanical Parts",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    slug: "mechanical-parts",
  },
];

const Categories: React.FC = () => {
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
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Categories</h2>
          <Link
            to="/shop"
            className="hidden md:flex items-center text-yorbot-orange hover:underline"
          >
            <span>View All</span>
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        {/* Mobile: Scrollable categories with arrows */}
        <div className="relative md:hidden">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md"
            aria-label="Scroll left"
          >
            <ArrowRight size={16} className="transform rotate-180" />
          </button>
          
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto pb-4 hide-scrollbar gap-4"
          >
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/shop/${category.slug}`}
                className="flex-shrink-0 w-40 group"
              >
                <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform hover:scale-105">
                  <div className="h-32 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="text-sm font-medium group-hover:text-yorbot-orange transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md"
            aria-label="Scroll right"
          >
            <ArrowRight size={16} />
          </button>
          
          <div className="flex justify-center mt-4 md:hidden">
            <Link
              to="/shop"
              className="flex items-center text-yorbot-orange hover:underline"
            >
              <span>View All Categories</span>
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden md:grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/shop/${category.slug}`}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full transition-all hover:shadow-md">
                <div className="h-40 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-medium group-hover:text-yorbot-orange transition-colors">
                    {category.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
