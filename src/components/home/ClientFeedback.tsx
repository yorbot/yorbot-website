
import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { useClientFeedback } from "@/hooks/useClientFeedback";

const ClientFeedback: React.FC = () => {
  const { data: testimonials, isLoading, error } = useClientFeedback();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    if (!testimonials || testimonials.length === 0) return;
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) =>
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials]);

  // Manual navigation
  const goToTestimonial = (index: number) => {
    setCurrentTestimonial(index);
  };

  if (isLoading) {
    return <div className="py-12 text-center text-gray-400">Loading feedback...</div>;
  }
  if (error) {
    return <div className="py-12 text-center text-red-500">Error loading feedback.</div>;
  }
  if (!testimonials || testimonials.length === 0) {
    return <div className="py-12 text-center text-gray-500">No feedback available.</div>;
  }

  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Client Feedback</h2>

        <div className="relative max-w-4xl mx-auto">
          {/* Desktop: Display multiple testimonials */}
          <div className="hidden md:grid grid-cols-2 gap-6">
            {testimonials.map((testimonial: any) => (
              <div
                key={testimonial.id}
                className="bg-gray-50 rounded-lg p-6 shadow-sm"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">{testimonial.comment}</p>
              </div>
            ))}
          </div>

          {/* Mobile: Slider for testimonials */}
          <div className="md:hidden">
            {testimonials.map((testimonial: any, index: number) => (
              <div
                key={testimonial.id}
                className={`transition-opacity duration-500 ${
                  index === currentTestimonial ? "opacity-100" : "hidden"
                }`}
              >
                <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                  <div className="flex flex-col items-center mb-4 text-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full mb-2"
                    />
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 italic text-center">{testimonial.comment}</p>
                </div>
              </div>
            ))}

            {/* Navigation dots */}
            <div className="flex justify-center mt-4 space-x-2">
              {testimonials.map((_: any, index: number) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`w-2 h-2 rounded-full ${
                    index === currentTestimonial ? "bg-yorbot-orange" : "bg-gray-300"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientFeedback;
