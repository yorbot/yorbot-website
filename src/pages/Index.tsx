
import React from "react";
import Layout from "@/components/layout/Layout";
import HeroBanner from "@/components/home/HeroBanner";
import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CadBanner from "@/components/home/CadBanner";
import MechanicalParts from "@/components/home/MechanicalParts";
import OurServices from "@/components/home/OurServices";
import ClientFeedback from "@/components/home/ClientFeedback";
import ProjectKits from "@/components/home/ProjectKits";

const Index: React.FC = () => {
  console.log("Index page is rendering");
  
  return (
    <Layout>
      <div className="min-h-screen">
        <HeroBanner />
        <Categories />
        <div className="-mt-4">
          <FeaturedProducts />
        </div>
        <div className="-mt-4">
          <ProjectKits />
        </div>
        <div className="-mt-8">
          <CadBanner />
        </div>
        <div className="-mt-4">
          <MechanicalParts />
        </div>
        <div className="-mt-4">
          <OurServices />
        </div>
        <ClientFeedback />
      </div>
    </Layout>
  );
};

export default Index;
