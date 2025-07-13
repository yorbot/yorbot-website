
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ProjectKit {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
  price: number;
  sale_price: number | null;
  description: string | null;
}

const ProjectKits: React.FC = () => {
  const [projectKits, setProjectKits] = useState<ProjectKit[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<any>(null);

  useEffect(() => {
    async function fetchProjectKits() {
      try {
        // Fetch products that are tagged as project kits or from a specific category
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .contains("tags", ["project-kit"])
          .order("created_at", { ascending: false })
          .limit(10);

        if (error) {
          console.error("Error fetching project kits:", error);
          setProjectKits([]);
        } else {
          setProjectKits(data || []);
        }
      } catch (error) {
        console.error("Error fetching project kits:", error);
        setProjectKits([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProjectKits();
  }, []);

  // Auto-scroll functionality
  useEffect(() => {
    if (!carouselRef.current || projectKits.length === 0) return;

    const interval = setInterval(() => {
      if (carouselRef.current?.api) {
        carouselRef.current.api.scrollNext();
      }
    }, 4000); // Auto-scroll every 4 seconds

    return () => clearInterval(interval);
  }, [projectKits]);

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

  if (projectKits.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Project Kits</h2>
        <Link
          to="/shop?category=project-kits"
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
            {projectKits.map((kit) => (
              <CarouselItem key={kit.id} className="pl-2 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
                <Link to={`/product/${kit.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 group border border-gray-200 rounded-none">
                    <CardContent className="p-3">
                      <div className="aspect-square mb-3 overflow-hidden bg-gray-100">
                        {kit.image_url ? (
                          <img
                            src={kit.image_url}
                            alt={kit.name}
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
                          {kit.name}
                        </h3>
                        
                        <div className="flex items-center gap-1">
                          {kit.sale_price ? (
                            <>
                              <span className="text-sm font-bold text-green-600">
                                ₹{kit.sale_price.toLocaleString()}
                              </span>
                              <span className="text-xs text-gray-500 line-through">
                                ₹{kit.price.toLocaleString()}
                              </span>
                            </>
                          ) : (
                            <span className="text-sm font-bold text-gray-900">
                              ₹{kit.price.toLocaleString()}
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
        <Link to="/shop?category=project-kits">
          <Button size="lg" className="px-8">
            View All
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ProjectKits;
