
import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";

const AboutUs: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to="/" className="text-gray-500 hover:text-yorbot-orange">Home</Link>
          <span className="mx-2">/</span>
          <span className="font-semibold">About Us</span>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">About Yorbot</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-8 mb-10">
            {/* Empty skeleton for admin to fill */}
            <div className="space-y-6">
              <p className="text-gray-600">
                About us content will be added by admin. This section will include:
              </p>
              
              <ul className="list-disc list-inside text-gray-600 pl-4 space-y-2">
                <li>Company history and mission</li>
                <li>Team information</li>
                <li>Company values</li>
                <li>Achievements and milestones</li>
                <li>Technology and innovation focus</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutUs;
