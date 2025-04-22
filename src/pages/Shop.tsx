
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: number;
  name: string;
  slug: string;
  image_url: string;
}

interface Subcategory {
  id: number;
  name: string;
  slug: string;
  category_id: number;
}

interface CategoryWithSubcategories extends Category {
  subcategories: Subcategory[];
}

const Shop: React.FC = () => {
  const { category } = useParams();
  const [categories, setCategories] = useState<CategoryWithSubcategories[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithSubcategories | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('app_categories')
          .select('*')
          .order('id');
        
        if (categoriesError) {
          console.error('Error fetching categories:', categoriesError);
          return;
        }
        
        if (categoriesData) {
          // Fetch subcategories for each category
          const categoriesWithSubs = await Promise.all(
            categoriesData.map(async (cat) => {
              const { data: subcategoriesData } = await supabase
                .from('app_subcategories')
                .select('*')
                .eq('category_id', cat.id)
                .order('id');
              
              return {
                ...cat,
                subcategories: subcategoriesData || []
              };
            })
          );
          
          setCategories(categoriesWithSubs);
          
          // Find selected category if category param exists
          if (category) {
            const found = categoriesWithSubs.find(cat => cat.slug === category) || null;
            setSelectedCategory(found);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [category]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to="/" className="text-gray-500 hover:text-yorbot-orange">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="text-gray-500 hover:text-yorbot-orange">Shop</Link>
          {category && selectedCategory && (
            <>
              <span className="mx-2">/</span>
              <span className="font-semibold">{selectedCategory.name}</span>
            </>
          )}
        </div>
        
        <h1 className="text-3xl font-bold mb-8">
          {category ? (selectedCategory?.name || 'Category not found') : 'All Categories'}
        </h1>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-6 w-24 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded mt-2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {!category ? (
              // Show all categories
              categories.map((cat) => (
                <div key={cat.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                  <Link to={`/shop/${cat.slug}`}>
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={cat.image_url || "https://via.placeholder.com/300x200?text=Category"} 
                        alt={cat.name} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h2 className="text-lg font-semibold mb-2 hover:text-yorbot-orange transition-colors">
                        {cat.name}
                      </h2>
                      {cat.subcategories && cat.subcategories.length > 0 && (
                        <ul className="text-sm text-gray-600 space-y-1">
                          {cat.subcategories.slice(0, 3).map((sub) => (
                            <li key={sub.id} className="hover:text-yorbot-orange">
                              <Link to={`/shop/${cat.slug}/${sub.slug}`}>
                                • {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              // Show subcategories of selected category
              selectedCategory?.subcategories.map((subcategory) => (
                <div key={subcategory.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                  <Link to={`/shop/${category}/${subcategory.slug}`}>
                    <div className="p-4">
                      <h2 className="text-lg font-semibold hover:text-yorbot-orange transition-colors">
                        {subcategory.name}
                      </h2>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Shop;
