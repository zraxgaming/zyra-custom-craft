
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Grid } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Categories = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("name");
          
        if (error) throw error;
        setCategories(data || []);
      } catch (error: any) {
        console.error("Error fetching categories:", error);
        toast({
          title: "Error loading categories",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchCategories();
  }, [toast]);

  const handleCategoryClick = (slug: string) => {
    navigate(`/shop?category=${slug}`);
  };

  // Show loading state
  if (isLoading) {
    return (
      <section className="bg-zyra-soft-gray py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Shop By Category</h2>
            <p className="mt-2 text-gray-600">Finding the perfect canvas for your creativity</p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zyra-purple"></div>
          </div>
        </div>
      </section>
    );
  }

  // Show enhanced empty state if no categories are available
  if (categories.length === 0) {
    return (
      <section className="bg-zyra-soft-gray py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Shop By Category</h2>
            <p className="mt-2 text-gray-600">Categories will appear here once they're added</p>
          </div>
          
          <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
            <div className="relative mb-8">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative p-8 bg-white/50 backdrop-blur-sm rounded-full border border-border/50">
                <Grid className="h-16 w-16 text-muted-foreground" />
              </div>
            </div>
            
            <Badge className="mb-6 bg-gradient-to-r from-primary to-purple-600 animate-scale-in">
              <Sparkles className="h-4 w-4 mr-2" />
              Coming Soon
            </Badge>
            
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              Categories are being prepared
            </h3>
            
            <p className="text-gray-600 text-center max-w-md mb-8">
              We're working on organizing our amazing collection into categories. 
              In the meantime, explore all our products in the shop.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Limit to 4 categories for the homepage
  const displayCategories = categories.slice(0, 4);

  return (
    <section className="bg-zyra-soft-gray py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Shop By Category</h2>
          <p className="mt-2 text-gray-600">
            Find the perfect blank canvas for your creativity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayCategories.map((category, index) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.slug)}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer animate-fade-in hover-lift-lg"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {category.description || "Explore our collection"}
                </p>
                <div className="mt-4 flex items-center text-zyra-purple font-medium text-sm">
                  <span>Shop now</span>
                  <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
