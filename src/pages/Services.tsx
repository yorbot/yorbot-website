
import React from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Phone } from "lucide-react";

const Services: React.FC = () => {
  const { serviceSlug } = useParams();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center mb-6">
          <Link to="/" className="text-gray-500 hover:text-yorbot-orange">Home</Link>
          <span className="mx-2">/</span>
          <span className="font-semibold">Services</span>
          {serviceSlug && (
            <>
              <span className="mx-2">/</span>
              <span className="font-semibold capitalize">{serviceSlug.replace(/-/g, ' ')}</span>
            </>
          )}
        </div>

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We provide comprehensive solutions tailored to meet your needs. Explore our services or contact us for custom requirements.
          </p>
        </div>

        <div className="flex justify-center mt-8">
          <Link
            to="/contact-us"
            className="flex items-center justify-center bg-yorbot-orange text-white px-6 py-3 rounded-md hover:bg-orange-600 transition-colors"
          >
            <Phone size={20} className="mr-2" />
            Contact Us About Our Services
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Services;
