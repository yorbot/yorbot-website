
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useShopProducts } from "@/hooks/useShopProducts";

// Types for table rows
interface Category {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
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
  const { category, subcategory } = useParams();
  const [categories, setCategories] = useState<CategoryWithSubcategories[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithSubcategories | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch All Categories and Their Subcategories
  useEffect(() => {
    async function fetchCategoriesAndSubs() {
      setLoading(true);
      const { data: cats, error: catsErr } = await supabase
        .from("categories")
        .select("*")
        .order("id");
      if (catsErr) {
        setCategories([]);
        setLoading(false);
        return;
      }
      const { data: subs } = await supabase.from("subcategories").select("*");
      const categoriesWithSubs: CategoryWithSubcategories[] = (cats || []).map(cat => ({
        ...cat,
        subcategories: (subs || []).filter(sub => sub.category_id === cat.id),
      }));
      setCategories(categoriesWithSubs);

      if (category) {
        const catObj = categoriesWithSubs.find(c => c.slug === category) || null;
        setSelectedCategory(catObj);
        if (subcategory && catObj) {
          const subObj = catObj.subcategories.find(s => s.slug === subcategory) || null;
          setSelectedSubcategory(subObj);
        } else {
          setSelectedSubcategory(null);
        }
      } else {
        setSelectedCategory(null);
        setSelectedSubcategory(null);
      }
      setLoading(false);
    }
    fetchCategoriesAndSubs();
  }, [category, subcategory]);

  // Get the IDs for fetching products
  const selectedCatId = selectedCategory?.id ?? undefined;
  const selectedSubId = selectedSubcategory?.id ?? undefined;
  const { products, loading: productsLoading } = useShopProducts(selectedCatId, selectedSubId);

  // Loading/Spinner
  if (loading || productsLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-6 w-24 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded mt-2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  // MAIN LOGIC
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
          {subcategory && selectedSubcategory && (
            <>
              <span className="mx-2">/</span>
              <span className="font-semibold">{selectedSubcategory.name}</span>
            </>
          )}
        </div>

        <h1 className="text-3xl font-bold mb-8">
          {!category ? "All Categories"
            : !subcategory ? (selectedCategory?.name || "Category not found")
            : selectedSubcategory?.name || "Subcategory not found"}
        </h1>

        {/* 1. NO CATEGORIES AT ALL */}
        {categories.length === 0 && (
          <div className="text-center py-8">
            <h2 className="text-xl font-medium text-gray-600">No categories found</h2>
            <p className="text-gray-500 mt-2">Add categories from your admin panel to see them here.</p>
          </div>
        )}

        {/* 2. SHOW ALL CATEGORIES */}
        {!category && categories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map(cat => (
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
                    {(cat.subcategories && cat.subcategories.length > 0) && (
                      <ul className="text-sm text-gray-600 space-y-1">
                        {cat.subcategories.slice(0, 3).map((sub) => (
                          <li key={sub.id} className="hover:text-yorbot-orange">
                            <Link to={`/shop/${cat.slug}/${sub.slug}`}>• {sub.name}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* 3. SELECTED CATEGORY: SHOW ITS SUBCATEGORIES OR PRODUCTS */}
        {category && selectedCategory && !subcategory && (
          selectedCategory.subcategories.length > 0 ? (
            <div className="mb-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {selectedCategory.subcategories.map(sub => (
                <div key={sub.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                  <Link to={`/shop/${selectedCategory.slug}/${sub.slug}`}>
                    <div className="p-4">
                      <h2 className="text-lg font-semibold hover:text-yorbot-orange transition-colors">
                        {sub.name}
                      </h2>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : null
        )}

        {/* 3b. Show products for selected category (with or without subcategories) */}
        {category && selectedCategory && !subcategory && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(prod => (
              <div key={prod.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                <Link to={`/product/${prod.slug}`}>
                  <div className="h-48 overflow-hidden">
                    <img
                      src={prod.image_url || "https://via.placeholder.com/300x300?text=Product"}
                      alt={prod.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold group-hover:text-yorbot-orange transition-colors">
                      {prod.name}
                    </h3>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-semibold">₹{prod.price.toFixed(2)}</span>
                      {prod.sale_price && (
                        <span className="text-sm text-gray-500 line-through">₹{prod.sale_price.toFixed(2)}</span>
                      )}
                    </div>
                    {prod.description && (
                      <p className="text-gray-600 mt-1 text-sm line-clamp-2">{prod.description}</p>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* 4. SELECTED SUBCATEGORY: SHOW PRODUCTS */}
        {subcategory && selectedSubcategory && (
          products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(prod => (
                <div key={prod.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                  <Link to={`/product/${prod.slug}`}>
                    <div className="h-48 overflow-hidden">
                      <img
                        src={prod.image_url || "https://via.placeholder.com/300x300?text=Product"}
                        alt={prod.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold group-hover:text-yorbot-orange transition-colors">
                        {prod.name}
                      </h3>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-semibold">₹{prod.price.toFixed(2)}</span>
                        {prod.sale_price && (
                          <span className="text-sm text-gray-500 line-through">₹{prod.sale_price.toFixed(2)}</span>
                        )}
                      </div>
                      {prod.description && (
                        <p className="text-gray-600 mt-1 text-sm line-clamp-2">{prod.description}</p>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="col-span-full text-center py-8">
              <h2 className="text-xl font-medium text-gray-600">No products found</h2>
              <p className="text-gray-500 mt-2">No products added in this subcategory yet. Please add from your admin panel.</p>
            </div>
          )
        )}

        {/* Category/subcategory not found error */}
        {(category && !selectedCategory) || (subcategory && !selectedSubcategory) ? (
          <div className="col-span-full text-center py-8">
            <h2 className="text-xl font-medium text-gray-600">Not found</h2>
            <p className="text-gray-500 mt-2">
              <Link to="/shop" className="text-yorbot-orange hover:underline">Return to all categories</Link>
            </p>
          </div>
        ) : null}
      </div>
    </Layout>
  );
};

export default Shop;
