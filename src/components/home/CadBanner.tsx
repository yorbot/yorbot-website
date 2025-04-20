
import React from "react";
import { Link } from "react-router-dom";

const CadBanner: React.FC = () => {
  return (
    <div className="py-10 md:py-16">
      <div className="container mx-auto px-4">
        <div 
          className="relative rounded-xl overflow-hidden bg-cover bg-center h-64 md:h-80"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1800&q=80')` 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>
          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12">
            <h2 className="text-white text-2xl md:text-4xl font-bold mb-4">
              Get Your Customized CAD Design
            </h2>
            <p className="text-white text-sm md:text-base mb-6 max-w-md">
              Professional 3D modeling and design services for your robotics projects
            </p>
            <Link
              to="/contact-us"
              className="inline-block bg-white text-yorbot-orange px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors w-fit"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadBanner;
