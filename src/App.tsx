import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import ShippingAndRefund from "./pages/ShippingAndRefund";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import OrderDetails from "./pages/OrderDetails";
import Blogs from "./pages/Blogs";
import Educational from "./pages/Educational";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Services from "./pages/Services";
import AuthCallback from "./pages/AuthCallback";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import OrderSuccess from "./pages/OrderSuccess";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Context Providers
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import RequireAuth from "./components/auth/RequireAuth";

const queryClient = new QueryClient();

function App() {
  console.log("App component rendering");
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Toaster />
              <Router>
                <div className="min-h-screen flex flex-col">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/about-us" element={<AboutUs />} />
                    <Route path="/contact-us" element={<ContactUs />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                    <Route path="/shipping-and-refund" element={<ShippingAndRefund />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/shop/:category" element={<Shop />} />
                    <Route path="/shop/:category/:subcategory" element={<Shop />} />
                    <Route path="/product/:slug" element={<Product />} />
                    <Route path="/cart" element={
                      <RequireAuth>
                        <Cart />
                      </RequireAuth>
                    } />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/checkout" element={
                      <RequireAuth>
                        <Checkout />
                      </RequireAuth>
                    } />
                    <Route path="/profile" element={
                      <RequireAuth>
                        <Profile />
                      </RequireAuth>
                    } />
                    <Route path="/profile/orders/:id" element={
                      <RequireAuth>
                        <OrderDetails />
                      </RequireAuth>
                    } />
                    <Route path="/blogs" element={<Blogs />} />
                    <Route path="/educational" element={<Educational />} />
                    <Route path="/sign-in" element={<SignIn />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/services/:serviceSlug" element={<Services />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    <Route path="/order-success/:orderId" element={<OrderSuccess />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </Router>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
