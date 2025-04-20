
import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-yorbot-darkGray text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Information */}
          <div>
            <div className="mb-4">
              <img 
                src="/images/yorbot-logo.png" 
                alt="Yorbot" 
                className="h-12 mb-2" 
              />
              <p className="text-sm text-gray-300">
                Empowering your robotic and electronic projects
              </p>
            </div>
            <div className="flex items-center mb-2">
              <Phone size={16} className="mr-2" />
              <span className="text-sm">+91 1234567890</span>
            </div>
            <div className="flex items-center">
              <Mail size={16} className="mr-2" />
              <a href="mailto:yorbot21@gmail.com" className="text-sm">
                yorbot21@gmail.com
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop/development-boards" className="text-sm text-gray-300 hover:text-yorbot-orange">
                  Development Boards
                </Link>
              </li>
              <li>
                <Link to="/shop/sensors" className="text-sm text-gray-300 hover:text-yorbot-orange">
                  Sensors
                </Link>
              </li>
              <li>
                <Link to="/shop/project-kits" className="text-sm text-gray-300 hover:text-yorbot-orange">
                  Project Kits
                </Link>
              </li>
              <li>
                <Link to="/shop/3d-printer" className="text-sm text-gray-300 hover:text-yorbot-orange">
                  3D Printer & Accessories
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-sm text-gray-300 hover:text-yorbot-orange">
                  All Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* My Account */}
          <div>
            <h3 className="text-lg font-semibold mb-4">My Account</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/profile" className="text-sm text-gray-300 hover:text-yorbot-orange">
                  My Profile
                </Link>
              </li>
              <li>
                <Link to="/profile/orders" className="text-sm text-gray-300 hover:text-yorbot-orange">
                  Order History
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="text-sm text-gray-300 hover:text-yorbot-orange">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-sm text-gray-300 hover:text-yorbot-orange">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Information</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about-us" className="text-sm text-gray-300 hover:text-yorbot-orange">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-sm text-gray-300 hover:text-yorbot-orange">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-sm text-gray-300 hover:text-yorbot-orange">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="text-sm text-gray-300 hover:text-yorbot-orange">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Yorbot. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
