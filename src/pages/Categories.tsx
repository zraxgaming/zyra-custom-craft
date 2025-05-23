
import React, { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Grid, List } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  image: string;
  icon: string;
  is_active: boolean;
  sort_order: number;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) throw error;

      // Map the data to match our interface
      const mappedCategories: Category[] = (data || []).map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        description: cat.description || "",
        slug: cat.slug,
        image: cat.image_url || "/placeholder.svg", // Use image_url from DB
        icon: cat.icon || "📦",
        is_active: cat.is_active,
        sort_order: cat.sort_order || 0,
      }));

      setCategories(mappedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <>
        <Navbar />
        <Container className="py-12">
          <div className="flex h-64 items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zyra-purple"></div>
          </div>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container className="py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Browse Categories</h1>
          <p className="text-gray-600 mb-6">
            Discover our wide range of product categories
          </p>

          {/* Search and View Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Categories Display */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No categories found</h3>
            <p className="text-gray-600">
              {searchTerm ? "Try adjusting your search terms" : "No categories available at the moment"}
            </p>
          </div>
        ) : (
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }>
            {filteredCategories.map((category) => (
              <Link key={category.id} to={`/shop?category=${category.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                  {viewMode === "grid" ? (
                    <div className="relative">
                      <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 rounded-t-lg flex items-center justify-center">
                        <span className="text-4xl">{category.icon}</span>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">{category.name}</h3>
                          <Badge variant="secondary">Active</Badge>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {category.description}
                        </p>
                      </CardContent>
                    </div>
                  ) : (
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">{category.icon}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-lg">{category.name}</h3>
                            <Badge variant="secondary">Active</Badge>
                          </div>
                          <p className="text-gray-600 text-sm">
                            {category.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default Categories;
