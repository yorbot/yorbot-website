import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Phone, Mail, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ContactUs: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would send data to the server
    console.log("Form submitted:", formData);
    
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
      variant: "default",
    });
    
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to="/" className="text-gray-500 hover:text-yorbot-orange">Home</Link>
          <span className="mx-2">/</span>
          <span className="font-semibold">Contact Us</span>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Contact Us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="space-y-6 flex flex-col items-center">
              <div className="text-center">
                <div className="bg-yorbot-orange w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <MapPin className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">Our Location</h3>
                <p className="text-gray-600">
                  123 Robotics Street, Tech Park<br />
                  Bengaluru, Karnataka 560001<br />
                  India
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-yorbot-orange w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Mail className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">Email Us</h3>
                <a 
                  href="mailto:yorbot21@gmail.com" 
                  className="text-gray-600 hover:text-yorbot-orange transition-colors"
                >
                  yorbot21@gmail.com
                </a>
              </div>
              
              <div className="text-center">
                <div className="bg-yorbot-orange w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Phone className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">Call Us</h3>
                <a 
                  href="tel:+911234567890" 
                  className="text-gray-600 hover:text-yorbot-orange transition-colors"
                >
                  +91 123 456 7890
                </a>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">HELLO!</h2>
              <p className="text-gray-600">
                Do you fancy saying hi to me or you want to get started with your project and you need my help? 
                Feel free to contact me.
              </p>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yorbot-orange"
                  />
                </div>
                
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yorbot-orange"
                  />
                </div>
                
                <div>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Your Subject"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yorbot-orange"
                  />
                </div>
                
                <div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yorbot-orange"
                  ></textarea>
                </div>
                
                <div>
                  <button
                    type="submit"
                    className="w-full bg-yorbot-orange text-white py-3 rounded-md font-medium hover:bg-orange-600 transition-colors"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        
        {/* Map */}
        <div className="rounded-lg overflow-hidden shadow-sm h-96 mb-8 border border-gray-200">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5831053826846!2d77.58407811482115!3d12.939544990877863!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDA1JzQyLjQiTiA3N8KwMTInMzYuMCJF!5e0!3m2!1sen!2sin!4v1617005142284!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            title="Yorbot Location"
          ></iframe>
        </div>
      </div>
    </Layout>
  );
};

export default ContactUs;
