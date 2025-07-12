
import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { fetchCategories, fetchSubcategories } from "@/utils/supabaseContent";

interface Category {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  subcategories?: { id: number; name: string; slug: string }[];
}

const Categories: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategoriesData() {
      try {
        // Fetch categories
        const categoriesData = await fetchCategories();

        if (categoriesData && categoriesData.length > 0) {
          // Fetch subcategories for each category
          const categoriesWithSubs = await Promise.all(
            categoriesData.map(async (category) => {
              const subcategoriesData = await fetchSubcategories(category.id);
              return {
                ...category,
                subcategories: subcategoriesData || []
              };
            })
          );

          setCategories(categoriesWithSubs);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCategoriesData();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 300;
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  if (loading) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Categories</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden h-full animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 flex justify-center">
                  <div className="h-5 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return null; // Don't render the section at all if there are no categories
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Categories</h2>
          <Link
            to="/shop"
            className="hidden md:flex items-center text-yorbot-orange hover:underline"
          >
            <span>View All</span>
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        {/* Mobile: Scrollable categories with arrows */}
        <div className="relative md:hidden">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md"
            aria-label="Scroll left"
          >
            <ArrowRight size={16} className="transform rotate-180" />
          </button>
          
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto pb-4 hide-scrollbar gap-4"
          >
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/shop/${category.slug}`}
                className="flex-shrink-0 w-48 group"
              >
                <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform hover:scale-105">
                  <div className="h-40 overflow-hidden">
                    <img
                      src={category.image_url || "https://via.placeholder.com/300x200?text=Category"}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-sm font-medium group-hover:text-yorbot-orange transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md"
            aria-label="Scroll right"
          >
            <ArrowRight size={16} />
          </button>
          
          <div className="flex justify-center mt-4 md:hidden">
            <Link
              to="/shop"
              className="flex items-center text-yorbot-orange hover:underline"
            >
              <span>View All Categories</span>
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>

        {/* Desktop: Grid layout - Made bigger */}
        <div className="hidden md:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/shop/${category.slug}`}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full transition-all hover:shadow-md">
                <div className="h-48 overflow-hidden">
                  <img
                    src={category.image_url || "https://via.placeholder.com/300x200?text=Category"}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-medium group-hover:text-yorbot-orange transition-colors">
                    {category.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
