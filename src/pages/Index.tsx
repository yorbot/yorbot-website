
import React from "react";
import Layout from "@/components/layout/Layout";
import HeroBanner from "@/components/home/HeroBanner";
import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CadBanner from "@/components/home/CadBanner";
import MechanicalParts from "@/components/home/MechanicalParts";
import OurServices from "@/components/home/OurServices";
import ClientFeedback from "@/components/home/ClientFeedback";

const Index: React.FC = () => {
  console.log("Index page is rendering");
  
  return (
    <Layout>
      <div className="min-h-screen">
        <HeroBanner />
        <Categories />
        <FeaturedProducts />
        <CadBanner />
        <MechanicalParts />
        <OurServices />
        <ClientFeedback />
      </div>
    </Layout>
  );
};

export default Index;
