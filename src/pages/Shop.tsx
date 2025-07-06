import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useShopProducts } from "@/hooks/useShopProducts";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
interface BaseCategory {
  id: number;
  name: string;
  slug: string;
}
interface CategoryWithSubcategories extends Category {
  subcategories: SubcategoryWithBaseCategories[];
}
interface SubcategoryWithBaseCategories extends Subcategory {
  baseCategories: BaseCategory[];
}

const Shop: React.FC = () => {
  const { category, subcategory, baseCategory } = useParams();
  const [categories, setCategories] = useState<CategoryWithSubcategories[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithSubcategories | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<SubcategoryWithBaseCategories | null>(null);
  const [selectedBaseCategory, setSelectedBaseCategory] = useState<BaseCategory | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch All Categories, Subcategories, and Base Categories
  useEffect(() => {
    async function fetchAllData() {
      setLoading(true);
      
      console.log("Fetching categories and subcategories with proper filtering");
      
      // Fetch categories
      const { data: cats, error: catsErr } = await supabase
        .from("categories")
        .select("*")
        .order("id");
      if (catsErr) {
        console.error("Error fetching categories:", catsErr);
        setCategories([]);
        setLoading(false);
        return;
      }

      // Fetch subcategories with proper category filtering
      const { data: subs, error: subsErr } = await supabase
        .from("subcategories")
        .select("*")
        .order("id");
      
      if (subsErr) {
        console.error("Error fetching subcategories:", subsErr);
      }

      // Fetch base categories
      const { data: baseCats, error: baseCatsErr } = await supabase
        .from("base_categories")
        .select("*")
        .order("id");
      
      if (baseCatsErr) {
        console.error("Error fetching base categories:", baseCatsErr);
      }

      console.log("Categories:", cats?.length);
      console.log("Subcategories fetched:", subs?.length);
      console.log("Base categories:", baseCats?.length);

      // Build the hierarchy with proper filtering
      const categoriesWithSubs: CategoryWithSubcategories[] = (cats || []).map(cat => {
        // IMPORTANT: Only get subcategories that belong to this specific category
        const subcategoriesForCat = (subs || []).filter(sub => sub.category_id === cat.id);
        
        console.log(`Category ${cat.name} (ID: ${cat.id}) has ${subcategoriesForCat.length} subcategories`);
        
        const subcategoriesWithBase = subcategoriesForCat.map(sub => {
          // Get base categories that belong to this subcategory
          const baseCategoriesForSub = (baseCats || []).filter(base => base.subcategory_id === sub.id);
          
          console.log(`Subcategory ${sub.name} (ID: ${sub.id}) has ${baseCategoriesForSub.length} base categories`);
          
          return {
            ...sub,
            baseCategories: baseCategoriesForSub,
          };
        });
        
        return {
          ...cat,
          subcategories: subcategoriesWithBase,
        };
      });

      setCategories(categoriesWithSubs);

      // Set selected items based on URL params
      if (category) {
        const catObj = categoriesWithSubs.find(c => c.slug === category) || null;
        setSelectedCategory(catObj);
        console.log("Selected category:", catObj?.name, "with", catObj?.subcategories.length, "subcategories");
        
        if (subcategory && catObj) {
          const subObj = catObj.subcategories.find(s => s.slug === subcategory) || null;
          setSelectedSubcategory(subObj);
          console.log("Selected subcategory:", subObj?.name);
          
          if (baseCategory && subObj) {
            const baseObj = subObj.baseCategories.find(b => b.slug === baseCategory) || null;
            setSelectedBaseCategory(baseObj);
            console.log("Selected base category:", baseObj?.name);
          } else {
            setSelectedBaseCategory(null);
          }
        } else {
          setSelectedSubcategory(null);
          setSelectedBaseCategory(null);
        }
      } else {
        setSelectedCategory(null);
        setSelectedSubcategory(null);
        setSelectedBaseCategory(null);
      }
      
      setLoading(false);
    }
    fetchAllData();
  }, [category, subcategory, baseCategory]);

  // Get the IDs for fetching products
  const selectedCatId = selectedCategory?.id ?? undefined;
  const selectedSubId = selectedSubcategory?.id ?? undefined;
  const selectedBaseId = selectedBaseCategory?.id ?? undefined;
  const { products, loading: productsLoading } = useShopProducts(selectedCatId, selectedSubId, selectedBaseId);

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
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/shop">Shop</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {category && selectedCategory && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {subcategory ? (
                    <BreadcrumbLink asChild>
                      <Link to={`/shop/${selectedCategory.slug}`}>{selectedCategory.name}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{selectedCategory.name}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </>
            )}
            {subcategory && selectedSubcategory && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {baseCategory ? (
                    <BreadcrumbLink asChild>
                      <Link to={`/shop/${selectedCategory?.slug}/${selectedSubcategory.slug}`}>
                        {selectedSubcategory.name}
                      </Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{selectedSubcategory.name}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </>
            )}
            {baseCategory && selectedBaseCategory && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{selectedBaseCategory.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-3xl font-bold mb-8">
          {!category ? "All Categories"
            : !subcategory ? (selectedCategory?.name || "Category not found")
            : !baseCategory ? (selectedSubcategory?.name || "Subcategory not found")
            : selectedBaseCategory?.name || "Base Category not found"}
        </h1>

        {/* Debug info - remove in production */}
        {selectedCategory && (
          <div className="mb-4 p-2 bg-gray-100 rounded text-sm">
            Debug: Selected category "{selectedCategory.name}" has {selectedCategory.subcategories.length} subcategories
          </div>
        )}

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

        {/* 3. SELECTED CATEGORY: SHOW ITS SUBCATEGORIES */}
        {category && selectedCategory && !subcategory && selectedCategory.subcategories.length > 0 && (
          <div className="mb-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {selectedCategory.subcategories.map(sub => (
              <div key={sub.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                <Link to={`/shop/${selectedCategory.slug}/${sub.slug}`}>
                  <div className="p-4">
                    <h2 className="text-lg font-semibold hover:text-yorbot-orange transition-colors">
                      {sub.name}
                    </h2>
                    {sub.baseCategories && sub.baseCategories.length > 0 && (
                      <ul className="text-sm text-gray-600 space-y-1 mt-2">
                        {sub.baseCategories.slice(0, 3).map((base) => (
                          <li key={base.id} className="hover:text-yorbot-orange">
                            <Link to={`/shop/${selectedCategory.slug}/${sub.slug}/${base.slug}`}>
                              • {base.name}
                            </Link>
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

        {/* 4. SELECTED SUBCATEGORY: SHOW BASE CATEGORIES */}
        {subcategory && selectedSubcategory && !baseCategory && selectedSubcategory.baseCategories.length > 0 && (
          <div className="mb-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {selectedSubcategory.baseCategories.map(base => (
              <div key={base.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                <Link to={`/shop/${selectedCategory?.slug}/${selectedSubcategory.slug}/${base.slug}`}>
                  <div className="p-4">
                    <h2 className="text-lg font-semibold hover:text-yorbot-orange transition-colors">
                      {base.name}
                    </h2>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* 5. SHOW PRODUCTS */}
        {((category && selectedCategory && !subcategory && selectedCategory.subcategories.length === 0) ||
          (subcategory && selectedSubcategory && !baseCategory && selectedSubcategory.baseCategories.length === 0) ||
          (baseCategory && selectedBaseCategory)) && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map(prod => (
              <div key={prod.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                <Link to={`/product/${prod.slug}`}>
                  <div className="h-32 overflow-hidden bg-gray-50 flex items-center justify-center">
                    <img
                      src={prod.image_url || "https://via.placeholder.com/300x300?text=Product"}
                      alt={prod.name}
                      className="max-w-full max-h-full object-contain hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold group-hover:text-yorbot-orange transition-colors line-clamp-2">
                      {prod.name}
                    </h3>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-semibold text-sm">₹{prod.price.toFixed(2)}</span>
                      {prod.sale_price && (
                        <span className="text-xs text-gray-500 line-through">₹{prod.sale_price.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* No products found */}
        {((category && selectedCategory && !subcategory && selectedCategory.subcategories.length === 0) ||
          (subcategory && selectedSubcategory && !baseCategory && selectedSubcategory.baseCategories.length === 0) ||
          (baseCategory && selectedBaseCategory)) && products.length === 0 && (
          <div className="text-center py-8">
            <h2 className="text-xl font-medium text-gray-600">No products found</h2>
            <p className="text-gray-500 mt-2">No products added in this category yet. Please add from your admin panel.</p>
          </div>
        )}

        {/* Category/subcategory/base category not found error */}
        {((category && !selectedCategory) || (subcategory && !selectedSubcategory) || (baseCategory && !selectedBaseCategory)) && (
          <div className="text-center py-8">
            <h2 className="text-xl font-medium text-gray-600">Not found</h2>
            <p className="text-gray-500 mt-2">
              <Link to="/shop" className="text-yorbot-orange hover:underline">Return to all categories</Link>
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Shop;
