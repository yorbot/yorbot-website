
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, Heart, User, Menu } from "lucide-react";

const Header: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  const [cartCount, setCartCount] = useState(2); // Mock data
  const [wishlistCount, setWishlistCount] = useState(3); // Mock data

  // Set active nav based on current path
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

  // Handle scroll for sticky header
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

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      setIsSearchOpen(false);
    }
  };

  // Toggle search dropdown
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className={`w-full bg-white z-50 ${scrolled ? "shadow-md" : ""}`}>
      {/* Top header with logo, search, and icons */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/images/yorbot-logo.png" 
              alt="Yorbot" 
              className="h-14 md:h-16"
            />
          </Link>

          {/* Desktop: Search bar */}
          <div className="hidden md:flex relative w-1/3">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none"
            />
            <button className="bg-yorbot-orange text-white px-4 py-2 rounded-r-md hover:bg-orange-600 transition-colors">
              <Search size={20} />
            </button>
          </div>

          {/* Desktop: User icons */}
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
            <Link to="/profile">
              <User className="w-6 h-6" />
            </Link>
          </div>

          {/* Mobile: Toggle and search buttons */}
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

        {/* Mobile: Search dropdown */}
        {isSearchOpen && (
          <div className="md:hidden mt-4 animate-fade-in">
            <div className="flex bg-yorbot-lightGray bg-opacity-90 p-2 rounded-md">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full px-3 py-2 bg-white border-none rounded-l-md focus:outline-none"
              />
              <button className="bg-yorbot-orange text-white px-3 py-2 rounded-r-md">
                <Search size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Desktop: Navigation bar */}
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

      {/* Mobile: Menu dropdown */}
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
            <Link to="/profile" onClick={toggleMobileMenu}>
              <User className="w-6 h-6" />
            </Link>
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
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
