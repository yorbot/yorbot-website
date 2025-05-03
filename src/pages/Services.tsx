
import React, { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";

const Services: React.FC = () => {
  const { serviceSlug } = useParams();
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simple animation for content appearance
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("appear");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".slide-up");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12" ref={servicesRef}>
        <div className="flex items-center mb-6">
          <Link to="/" className="text-gray-500 hover:text-yorbot-orange">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="font-semibold">Services</span>
          {serviceSlug && (
            <>
              <span className="mx-2">/</span>
              <span className="font-semibold capitalize">
                {serviceSlug.replace(/-/g, " ")}
              </span>
            </>
          )}
        </div>

        <div className="text-center mb-12 glass-effect rounded-lg p-8 slide-up">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 fade-in">
            Our Services
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto fade-in">
            We provide comprehensive solutions tailored to meet your needs.
            Explore our services or contact us for custom requirements.
          </p>
        </div>

        <div className="flex justify-center mt-8 slide-up">
          <Link
            to="/contact-us"
            className="bg-yorbot-orange text-white px-6 py-3 rounded-md hover:bg-orange-600 transition-colors hover-scale hover-float"
          >
            Contact Us About Our Services
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Services;
