import React from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";

const categories = [
  {
    id: 1,
    name: "Development Boards",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80",
    slug: "development-boards",
    subcategories: [
      { name: "Arduino", slug: "arduino" },
      { name: "Raspberry Pi", slug: "raspberry-pi" },
      { name: "ESP32/ESP8266", slug: "esp32-esp8266" },
      { name: "Boards Compatible with Arduino", slug: "arduino-compatible" },
      { name: "Boards Compatible with Raspberry Pi", slug: "raspberry-pi-compatible" },
      { name: "GPS Boards", slug: "gps-boards" }
    ]
  },
  {
    id: 2,
    name: "Sensors",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    slug: "sensors",
    subcategories: [
      { name: "LiDAR Sensors", slug: "lidar-sensors" },
      { name: "Ultrasonic Sensors", slug: "ultrasonic-sensors" },
      { name: "Temperature Sensors", slug: "temperature-sensors" },
      { name: "Humidity Sensors", slug: "humidity-sensors" },
      { name: "Motion Sensors", slug: "motion-sensors" },
      { name: "Gas Sensors", slug: "gas-sensors" }
    ]
  },
  {
    id: 3,
    name: "3D Printer & Accessories",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
    slug: "3d-printer",
    subcategories: ["3D Printers", "Filaments", "Printer Parts"]
  },
  {
    id: 4,
    name: "Drone Parts",
    image: "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?auto=format&fit=crop&w=600&q=80",
    slug: "drone-parts",
    subcategories: ["Motors", "Flight Controllers", "Propellers"]
  },
  {
    id: 5,
    name: "Motors, Pumps, Drivers & Actuators",
    image: "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?auto=format&fit=crop&w=600&q=80",
    slug: "motors-and-drivers",
    subcategories: ["DC Motors", "Stepper Motors", "Motor Drivers"]
  },
  {
    id: 6,
    name: "E-Bike",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
    slug: "ebike",
    subcategories: ["Motors", "Controllers", "Batteries"]
  },
  {
    id: 7,
    name: "Display & Electric Parts",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    slug: "display-and-electric",
    subcategories: ["LCD Displays", "LED Strips", "Multimeters"]
  },
  {
    id: 8,
    name: "Resistors, Wires & Cables",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80",
    slug: "resistors-and-wires",
    subcategories: ["Resistors", "Jumper Wires", "Cables"]
  },
  {
    id: 9,
    name: "Project Kits",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80",
    slug: "project-kits",
    subcategories: ["Beginner Kits", "Advanced Kits", "Educational Kits"]
  },
  {
    id: 10,
    name: "Tools & Equipment",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80",
    slug: "tools-and-equipment",
    subcategories: ["Soldering Tools", "Testing Equipment", "Hand Tools"]
  },
  {
    id: 11,
    name: "Mechanical Parts",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    slug: "mechanical-parts",
    subcategories: ["Bearings", "Gears", "Robot Chassis"]
  },
];

const Shop: React.FC = () => {
  const { category } = useParams();
  const selectedCategory = categories.find(cat => cat.slug === category);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to="/" className="text-gray-500 hover:text-yorbot-orange">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="text-gray-500 hover:text-yorbot-orange">Shop</Link>
          {category && (
            <>
              <span className="mx-2">/</span>
              <span className="font-semibold">{selectedCategory?.name || category}</span>
            </>
          )}
        </div>
        
        <h1 className="text-3xl font-bold mb-8">
          {category ? selectedCategory?.name || 'Category not found' : 'All Categories'}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {!category ? (
            categories.map((cat) => (
              <div key={cat.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                <Link to={`/shop/${cat.slug}`}>
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-semibold mb-2 hover:text-yorbot-orange transition-colors">
                      {cat.name}
                    </h2>
                    {cat.subcategories && (
                      <ul className="text-sm text-gray-600 space-y-1">
                        {cat.subcategories.slice(0, 3).map((sub, index) => (
                          <li key={index} className="hover:text-yorbot-orange">
                            <Link to={`/shop/${cat.slug}/${typeof sub === 'string' ? sub.toLowerCase().replace(/\s+/g, '-') : sub.slug}`}>
                              • {typeof sub === 'string' ? sub : sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </Link>
              </div>
            ))
          ) : (
            selectedCategory?.subcategories.map((subcategory, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                <Link to={`/shop/${category}/${typeof subcategory === 'string' ? subcategory.toLowerCase().replace(/\s+/g, '-') : subcategory.slug}`}>
                  <div className="p-4">
                    <h2 className="text-lg font-semibold hover:text-yorbot-orange transition-colors">
                      {typeof subcategory === 'string' ? subcategory : subcategory.name}
                    </h2>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
