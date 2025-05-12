
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Heart, User, Menu, LogIn } from "lucide-react";
import SearchBar from "../SearchBar";
import { useCart } from "@/contexts/CartProvider";
import { useWishlist } from "@/contexts/WishlistProvider";
import { useAuth } from "@/contexts/AuthContext";

const Header: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/") setActiveNav("home");
    else if (path.includes("/shop")) setActiveNav("shop");
    else if (path.includes("/blogs")) setActiveNav("blogs");
    else if (path.includes("/educational")) setActiveNav("educational");
    else if (path.includes("/about-us")) setActiveNav("about-us");
    else if (path.includes("/contact-us")) setActiveNav("contact-us");
    else setActiveNav("");
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      setIsSearchOpen(false);
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleProfileClick = () => {
    if (user) {
      navigate("/profile");
    } else {
      navigate("/sign-in");
    }
  };

  return (
    <header className={`w-full bg-gray-900 bg-opacity-80 backdrop-blur-md z-50 ${scrolled ? "shadow-md shadow-black/20" : ""}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img 
              src="/images/logo.png" 
              alt="Yorbot" 
              className="h-14 md:h-16"
            />
          </Link>

          <div className="hidden md:block md:w-1/2">
            <SearchBar />
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/wishlist" className="relative">
              <Heart className="w-6 h-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yorbot-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yorbot-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={handleProfileClick}>
              <User className="w-6 h-6" />
            </button>
          </div>

          <div className="flex md:hidden items-center space-x-4">
            <button
              onClick={toggleSearch}
              className="p-2 rounded-md bg-yorbot-lightGray"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md bg-yorbot-lightGray"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isSearchOpen && (
          <div className="md:hidden mt-4 animate-fade-in">
            <SearchBar />
          </div>
        )}
      </div>

      <nav className="hidden md:block bg-[#333333]">
        <div className="container mx-auto px-4">
          <ul className="flex justify-center space-x-8 py-3">
            {["home", "shop", "blogs", "educational", "about-us", "contact-us"].map((item) => (
              <li key={item}>
                <Link
                  to={item === "home" ? "/" : `/${item}`}
                  className={`text-base font-medium transition-colors hover:text-yorbot-orange ${
                    activeNav === item
                      ? "text-white"
                      : "text-[#999999]"
                  }`}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1).replace("-", " ")}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-yorbot-lightGray bg-opacity-95 animate-slide-in fixed top-0 right-0 w-4/5 h-full z-50 shadow-lg overflow-y-auto">
          <div className="p-4 flex justify-between items-center">
            <h2 className="text-lg font-bold">Menu</h2>
            <button onClick={toggleMobileMenu} className="p-2">
              ✕
            </button>
          </div>
          <div className="p-4 flex items-center space-x-6 border-b border-gray-200">
            <Link to="/wishlist" className="relative" onClick={toggleMobileMenu}>
              <Heart className="w-6 h-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yorbot-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative" onClick={toggleMobileMenu}>
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yorbot-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => {
              handleProfileClick();
              toggleMobileMenu();
            }}>
              <User className="w-6 h-6" />
            </button>
          </div>
          <nav className="p-4">
            <ul className="space-y-4">
              {["home", "shop", "blogs", "educational", "about-us", "contact-us"].map((item) => (
                <li key={item}>
                  <Link
                    to={item === "home" ? "/" : `/${item}`}
                    className={`block py-2 px-4 rounded ${
                      activeNav === item
                        ? "bg-yorbot-gray text-white"
                        : "text-yorbot-darkGray"
                    }`}
                    onClick={toggleMobileMenu}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1).replace("-", " ")}
                  </Link>
                </li>
              ))}
              {user ? (
                <li>
                  <Link
                    to="/profile"
                    className="block py-2 px-4 rounded text-yorbot-darkGray"
                    onClick={toggleMobileMenu}
                  >
                    My Profile
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link
                      to="/sign-in"
                      className="block py-2 px-4 rounded text-yorbot-darkGray"
                      onClick={toggleMobileMenu}
                    >
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/sign-up"
                      className="block py-2 px-4 rounded text-yorbot-darkGray"
                      onClick={toggleMobileMenu}
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
