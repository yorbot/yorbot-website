
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, ArrowDown, Linkedin, Instagram, Twitter, Facebook, Youtube } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string;
  is_active: boolean;
  display_order: number;
}

interface SiteSetting {
  id: number;
  key: string;
  value: string;
  description: string;
}

const Footer: React.FC = () => {
  const [accountOpen, setAccountOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({
    phone: "+91 1234567890",
    email: "yorbot21@gmail.com",
    address: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch social links
        const { data: socialData, error: socialError } = await supabase
          .from('social_links')
          .select('*')
          .eq('is_active', true)
          .order('display_order');
        
        if (socialError) {
          console.error('Error fetching social links:', socialError);
        } else if (socialData) {
          setSocialLinks(socialData);
        }
        
        // Fetch site settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('site_settings')
          .select('*');
        
        if (settingsError) {
          console.error('Error fetching site settings:', settingsError);
        } else if (settingsData) {
          const settings: Record<string, string> = {};
          settingsData.forEach(setting => {
            settings[setting.key] = setting.value;
          });
          setSiteSettings({
            ...siteSettings,
            ...settings
          });
        }
      } catch (error) {
        console.error('Error fetching footer data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Map social media icon names to Lucide components
  const getSocialIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'linkedin': return Linkedin;
      case 'instagram': return Instagram;
      case 'twitter': return Twitter;
      case 'facebook': return Facebook;
      case 'youtube': return Youtube;
      default: return Linkedin;
    }
  };

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
            
            {siteSettings.phone && (
              <div className="flex items-center mb-2">
                <Phone size={16} className="mr-2" />
                <span className="text-sm">{siteSettings.phone}</span>
              </div>
            )}
            
            {siteSettings.email && (
              <div className="flex items-center mb-2">
                <Mail size={16} className="mr-2" />
                <a href={`mailto:${siteSettings.email}`} className="text-sm">
                  {siteSettings.email}
                </a>
              </div>
            )}
            
            {siteSettings.address && (
              <div className="flex items-start mb-4">
                <MapPin size={16} className="mr-2 mt-1 flex-shrink-0" />
                <span className="text-sm">{siteSettings.address}</span>
              </div>
            )}
            
            {/* Social Media Icons */}
            <div className="flex space-x-4 mb-6">
              {socialLinks.map((social) => {
                const IconComponent = getSocialIcon(social.icon);
                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-yorbot-orange transition-colors"
                    aria-label={social.platform}
                  >
                    <IconComponent size={20} />
                  </a>
                );
              })}
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
