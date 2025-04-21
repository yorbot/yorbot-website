
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, ArrowDown, Linkedin, Instagram, Twitter, Facebook, Youtube } from "lucide-react";

const Footer: React.FC = () => {
  const [accountOpen, setAccountOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  const socialLinks = [
    { icon: Linkedin, href: "https://linkedin.com/company/yorbot", label: "LinkedIn" },
    { icon: Instagram, href: "https://instagram.com/yorbot", label: "Instagram" },
    { icon: Twitter, href: "https://twitter.com/yorbot", label: "Twitter" },
    { icon: Facebook, href: "https://facebook.com/yorbot", label: "Facebook" },
    { icon: Youtube, href: "https://youtube.com/yorbot", label: "YouTube" }
  ];

  return (
    <footer className="bg-yorbot-darkGray text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Information */}
          <div>
            <div className="mb-4">
              <img src="/images/logo.png" alt="Yorbot" className="h-12 mb-2" />
              <p className="text-sm text-gray-300">
                Empowering your robotic and electronic projects
              </p>
            </div>
            <div className="flex items-center mb-2">
              <Phone size={16} className="mr-2" />
              <span className="text-sm">+91 1234567890</span>
            </div>
            <div className="flex items-center mb-4">
              <Mail size={16} className="mr-2" />
              <a href="mailto:yorbot21@gmail.com" className="text-sm">
                yorbot21@gmail.com
              </a>
            </div>
            {/* Social Media Icons */}
            <div className="flex space-x-4 mb-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-yorbot-orange transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* My Account */}
          <div className="border-t md:border-0 pt-4 md:pt-0">
            <div
              className="flex items-center justify-between md:justify-start mb-4 cursor-pointer md:cursor-default"
              onClick={() => setAccountOpen(!accountOpen)}
            >
              <h3 className="text-lg font-semibold">My Account</h3>
              <ArrowDown className={`md:hidden h-4 w-4 transition-transform ${accountOpen ? 'rotate-180' : ''}`} />
            </div>
            <ul className={`space-y-2 ${accountOpen ? 'block' : 'hidden md:block'}`}>
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
          <div className="border-t md:border-0 pt-4 md:pt-0">
            <div
              className="flex items-center justify-between md:justify-start mb-4 cursor-pointer md:cursor-default"
              onClick={() => setInfoOpen(!infoOpen)}
            >
              <h3 className="text-lg font-semibold">Information</h3>
              <ArrowDown className={`md:hidden h-4 w-4 transition-transform ${infoOpen ? 'rotate-180' : ''}`} />
            </div>
            <ul className={`space-y-2 ${infoOpen ? 'block' : 'hidden md:block'}`}>
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
              <li>
                <Link to="/shipping-and-refund" className="text-sm text-gray-300 hover:text-yorbot-orange">
                  Shipping & Refund
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
