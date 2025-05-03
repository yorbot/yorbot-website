
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Toaster } from "@/components/ui/toaster";
import AnimatedBackground from "./AnimatedBackground";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <AnimatedBackground />
      <Header />
      <main className="flex-grow relative z-10">{children}</main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Layout;
