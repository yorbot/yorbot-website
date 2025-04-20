
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const banners = [
  {
    id: 1,
    title: "DIY Project Kits",
    subtitle: "sale up to 30%",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1800&q=80",
    link: "/shop/project-kits",
  },
  {
    id: 2,
    title: "Development Boards",
    subtitle: "sale up to 10%",
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1800&q=80",
    link: "/shop/development-boards",
  },
  {
    id: 3,
    title: "Get Your Customized Projects",
    subtitle: "Expert solutions tailored for you",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1800&q=80",
    link: "/customized-projects",
  },
];

const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Manual navigation
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
      {/* Slides */}
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${banner.imageUrl})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
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

      {/* Navigation dots */}
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
  );
};

export default HeroBanner;
