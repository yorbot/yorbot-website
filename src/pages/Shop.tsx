
import React from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useCategories } from "@/hooks/useCategories";

const Shop: React.FC = () => {
  const { category } = useParams();
  const { data: categories, isLoading, error } = useCategories();

  if (isLoading) {
    return <Layout><div className="container mx-auto px-4 py-16 text-gray-500">Loading...</div></Layout>;
  }
  if (error || !categories) {
    return <Layout><div className="container mx-auto px-4 py-16 text-red-500">Failed to load shop categories.</div></Layout>;
  }

  const selectedCategory = categories.find((cat: any) => cat.slug === category);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to="/" className="text-gray-500 hover:text-yorbot-orange">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="text-gray-500 hover:text-yorbot-orange">Shop</Link>
          {category && (
            <>
              <span className="mx-2">/</span>
              <span className="font-semibold">{selectedCategory?.name || category}</span>
            </>
          )}
        </div>
        
        <h1 className="text-3xl font-bold mb-8">
          {category ? selectedCategory?.name || 'Category not found' : 'All Categories'}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {!category ? (
            categories.map((cat: any) => (
              <div key={cat.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                <Link to={`/shop/${cat.slug}`}>
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={cat.image_url} 
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
                        {cat.subcategories.slice(0, 3).map((sub: any, index: number) => (
                          <li key={index} className="hover:text-yorbot-orange">
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
            selectedCategory?.subcategories.map((subcategory: any, index: number) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
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
      </div>
    </Layout>
  );
};

export default Shop;
