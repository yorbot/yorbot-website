
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { fetchPageContent } from "@/utils/supabaseContent";
import { toast } from "sonner";

const TermsAndConditions: React.FC = () => {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      try {
        const data = await fetchPageContent('terms-and-conditions');
        console.log("Terms and conditions content fetched:", data);
        setContent(data?.content || null);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching terms-and-conditions content:", error);
        toast("Error", {
          description: "Failed to load content. Please try again later.",
        });
        setLoading(false);
      }
    }
    loadContent();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to="/" className="text-gray-500 hover:text-yorbot-orange">Home</Link>
          <span className="mx-2">/</span>
          <span className="font-semibold">Terms and Conditions</span>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Terms and Conditions</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-8 mb-10">
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            ) : content ? (
              <div 
                className="prose prose-lg max-w-none prose-headings:text-yorbot-orange prose-a:text-yorbot-orange"
                dangerouslySetInnerHTML={{ 
                  __html: content 
                }} 
              />
            ) : (
              <div className="text-center text-gray-600">
                <p>Content will be added by admin. Please add content from the admin panel.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsAndConditions;
