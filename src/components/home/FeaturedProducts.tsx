
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useShopProducts } from "@/hooks/useShopProducts";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const FeaturedProducts: React.FC = () => {
  const { products, loading } = useShopProducts();
  const carouselRef = useRef<any>(null);
  
  // Get random 10 products
  const featuredProducts = React.useMemo(() => {
    if (products.length === 0) return [];
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
  }, [products]);

  // Auto-scroll functionality
  useEffect(() => {
    if (!carouselRef.current || featuredProducts.length === 0) return;

    const interval = setInterval(() => {
      if (carouselRef.current?.api) {
        carouselRef.current.api.scrollNext();
      }
    }, 3000); // Auto-scroll every 3 seconds

    return () => clearInterval(interval);
  }, [featuredProducts]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-2"></div>
          </div>
        </div>
        <div className="flex space-x-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-48 h-64 bg-gray-300 rounded border"></div>
          ))}
        </div>
      </div>
    );
  }

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Products</h2>
        <Link
          to="/featured-products"
          className="hidden md:flex items-center text-yorbot-orange hover:underline"
        >
          <span>View All</span>
          <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>

      <div className="relative">
        <Carousel
          ref={carouselRef}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2">
            {featuredProducts.map((product) => (
              <CarouselItem key={product.id} className="pl-2 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
                <Link to={`/product/${product.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 group border border-gray-200 rounded-none">
                    <CardContent className="p-3">
                      <div className="aspect-square mb-3 overflow-hidden bg-gray-100">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="font-medium text-xs text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </h3>
                        
                        <div className="flex items-center gap-1">
                          {product.sale_price ? (
                            <>
                              <span className="text-sm font-bold text-green-600">
                                ₹{product.sale_price.toLocaleString()}
                              </span>
                              <span className="text-xs text-gray-500 line-through">
                                ₹{product.price.toLocaleString()}
                              </span>
                            </>
                          ) : (
                            <span className="text-sm font-bold text-gray-900">
                              ₹{product.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>

      <div className="text-center mt-6 md:hidden">
        <Link to="/featured-products">
          <Button size="lg" className="px-8">
            View All
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default FeaturedProducts;
