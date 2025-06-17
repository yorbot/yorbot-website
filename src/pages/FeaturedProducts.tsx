
import React, { useState, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useShopProducts } from "@/hooks/useShopProducts";
import { Link } from "react-router-dom";

const FeaturedProducts: React.FC = () => {
  const { products, loading } = useShopProducts();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  // Get random products and maintain order across pagination
  const randomProducts = useMemo(() => {
    if (products.length === 0) return [];
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled;
  }, [products]);

  // Calculate pagination
  const totalPages = Math.ceil(randomProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = randomProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-96 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our complete collection of premium products from all categories
          </p>
        </div>

        {currentProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
              {currentProducts.map((product) => (
                <Link key={product.id} to={`/product/${product.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 group">
                    <CardContent className="p-4">
                      <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium text-sm text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </h3>
                        
                        <div className="flex items-center gap-2">
                          {product.sale_price ? (
                            <>
                              <span className="text-lg font-bold text-green-600">
                                ₹{product.sale_price.toLocaleString()}
                              </span>
                              <span className="text-sm text-gray-500 line-through">
                                ₹{product.price.toLocaleString()}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-gray-900">
                              ₹{product.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) handlePageChange(currentPage - 1);
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNumber = i + 1;
                      if (totalPages <= 5) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(pageNumber);
                              }}
                              isActive={currentPage === pageNumber}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      
                      // Show first, current-1, current, current+1, last for larger page counts
                      const showPage = pageNumber === 1 || 
                                     pageNumber === totalPages || 
                                     Math.abs(pageNumber - currentPage) <= 1;
                      
                      if (showPage) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(pageNumber);
                              }}
                              isActive={currentPage === pageNumber}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) handlePageChange(currentPage + 1);
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-600">There are no products available at the moment.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FeaturedProducts;
