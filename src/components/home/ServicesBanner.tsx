
import React from "react";
import { Truck, Headphones, Shield, Star } from "lucide-react";

const services = [
  {
    id: 1,
    icon: Truck,
    title: "Free Shipping",
    description: "On orders above 1,000rs",
  },
  {
    id: 2,
    icon: Headphones,
    title: "Customer Support 24/7",
    description: "Dedicated assistance",
  },
  {
    id: 3,
    icon: Shield,
    title: "Secure Payment",
    description: "100% secure checkout",
  },
  {
    id: 4,
    icon: Star,
    title: "Quality Assurance",
    description: "Tested & certified",
  },
];

const ServicesBanner: React.FC = () => {
  const [currentService, setCurrentService] = React.useState(0);

  // For mobile, rotate through services every 3 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (window.innerWidth < 768) {
        setCurrentService((prev) => (prev === services.length - 1 ? 0 : prev + 1));
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white py-6 md:py-8">
      <div className="container mx-auto px-4">
        {/* Mobile view - slider */}
        <div className="md:hidden">
          <div className="overflow-hidden">
            <div className="flex flex-col items-center">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className={`flex flex-col items-center transition-opacity duration-500 ${
                    index === currentService ? "opacity-100" : "hidden"
                  }`}
                >
                  <service.icon className="w-8 h-8 mb-2 text-yorbot-orange" />
                  <h3 className="font-semibold text-base mb-1">{service.title}</h3>
                  <p className="text-yorbot-gray text-xs text-center">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-4 space-x-2">
            {services.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentService(index)}
                className={`w-2 h-2 rounded-full ${
                  index === currentService ? "bg-yorbot-orange" : "bg-gray-300"
                }`}
                aria-label={`Go to service ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>

        {/* Desktop view - grid */}
        <div className="hidden md:grid grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex flex-col items-center text-center"
            >
              <service.icon className="w-9 h-9 mb-2 text-yorbot-orange" />
              <h3 className="font-semibold text-base mb-1">{service.title}</h3>
              <p className="text-yorbot-gray text-xs">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesBanner;
