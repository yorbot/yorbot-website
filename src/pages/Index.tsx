
import React from "react";
import Layout from "@/components/layout/Layout";
import HeroBanner from "@/components/home/HeroBanner";
import Categories from "@/components/home/Categories";
import CadBanner from "@/components/home/CadBanner";
import MechanicalParts from "@/components/home/MechanicalParts";
import OurServices from "@/components/home/OurServices";
import ClientFeedback from "@/components/home/ClientFeedback";

const Index: React.FC = () => {
  return (
    <Layout>
      <HeroBanner />
      <Categories />
      <CadBanner />
      <MechanicalParts />
      <OurServices />
      <ClientFeedback />
    </Layout>
  );
};

export default Index;
