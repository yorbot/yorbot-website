
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const mechanicalParts = [
  {
    id: 1,
    name: "Ball Bearings",
    image: "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?auto=format&fit=crop&w=600&q=80",
    slug: "ball-bearings",
  },
  {
    id: 2,
    name: "Robot Chassis",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80",
    slug: "robot-chassis",
  },
  {
    id: 3,
    name: "Gears",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80",
    slug: "gears",
  },
  {
    id: 4,
    name: "Screws & Fasteners",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    slug: "screws-and-fasteners",
  },
];

const MechanicalParts: React.FC = () => {
  return (
    <div className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Mechanical Parts</h2>
          <Link
            to="/shop/mechanical-parts"
            className="flex items-center text-yorbot-orange hover:underline"
          >
            <span>View All</span>
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {mechanicalParts.map((part) => (
            <Link
              key={part.id}
              to={`/shop/mechanical-parts/${part.slug}`}
              className="group"
            >
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-shadow hover:shadow-md">
                <div className="h-32 md:h-40 overflow-hidden">
                  <img
                    src={part.image}
                    alt={part.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 md:p-4 text-center">
                  <h3 className="text-sm md:text-base font-medium group-hover:text-yorbot-orange transition-colors">
                    {part.name}
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

export default MechanicalParts;
