
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useShopProducts } from "@/hooks/useShopProducts";
import { Link } from "react-router-dom";

const FeaturedProducts: React.FC = () => {
  const { products, loading } = useShopProducts();
  
  // Get random 10 products
  const featuredProducts = React.useMemo(() => {
    if (products.length === 0) return [];
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
  }, [products]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-8"></div>
            <div className="flex space-x-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-64 h-80 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16 bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover our handpicked selection of premium products from various categories
        </p>
      </div>

      <div className="relative">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {featuredProducts.map((product) => (
              <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                <Link to={`/product/${product.slug}`}>
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
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>

      <div className="text-center mt-8">
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
