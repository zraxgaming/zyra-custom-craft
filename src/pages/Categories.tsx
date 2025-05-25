
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCategories } from "@/hooks/use-categories";
import { EnhancedLoader } from "@/components/ui/enhanced-loader";

const Categories = () => {
  const { categories, isLoading, error } = useCategories();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <>
        <Navbar />
        <Container className="py-12">
          <EnhancedLoader message="Loading categories..." />
        </Container>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <Container className="py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-foreground">Error Loading Categories</h1>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </Container>
        <Footer />
      </>
    );
  }

  const activeCategories = categories.filter(cat => cat.is_active);

  return (
    <>
      <Navbar />
      <Container className="py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold mb-4 text-foreground">Shop by Category</h1>
            <p className="text-xl text-muted-foreground">
              Discover our wide range of customizable products across different categories
            </p>
          </div>

          {activeCategories.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">No Categories Available</h2>
              <p className="text-muted-foreground">Categories will appear here once they are added.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeCategories.map((category, index) => (
                <Card
                  key={category.id}
                  className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-primary/30 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => navigate(`/category/${category.slug}`)}
                >
                  <CardContent className="p-0">
                    {category.image_url && (
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img
                          src={category.image_url}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        {category.icon && (
                          <span className="text-2xl">{category.icon}</span>
                        )}
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                      </div>
                      {category.description && (
                        <p className="text-muted-foreground leading-relaxed">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default Categories;
