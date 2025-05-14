
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { fetchProducts } from "@/utils/supabaseContent";

const MechanicalParts: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts("mechanical-parts").then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Mechanical Parts</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Mechanical Parts</h2>
          <Link
            to="/shop/mechanical-parts"
            className="flex items-center text-yorbot-orange hover:underline"
          >
            <span>View All</span>
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.slug}`}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full transition-all hover:shadow-md">
                <div className="h-48 overflow-hidden">
                  <img
                    src={product.image_url || "https://via.placeholder.com/300x300?text=Product"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium group-hover:text-yorbot-orange transition-colors">
                    {product.name}
                  </h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-semibold">₹{product.price.toFixed(2)}</span>
                    {product.sale_price && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{product.sale_price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MechanicalParts;
