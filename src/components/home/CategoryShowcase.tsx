
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { ArrowRight, Package, Shirt, Gift, Coffee } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    id: 1,
    name: "Custom Apparel",
    description: "T-shirts, hoodies, and more",
    icon: Shirt,
    color: "from-blue-500 to-purple-600",
    count: "50+ products"
  },
  {
    id: 2,
    name: "Promotional Items",
    description: "Branded merchandise",
    icon: Package,
    color: "from-green-500 to-teal-600",
    count: "30+ products"
  },
  {
    id: 3,
    name: "Gift Items",
    description: "Personalized gifts",
    icon: Gift,
    color: "from-pink-500 to-rose-600",
    count: "25+ products"
  },
  {
    id: 4,
    name: "Drinkware",
    description: "Custom mugs and bottles",
    icon: Coffee,
    color: "from-orange-500 to-red-600",
    count: "15+ products"
  }
];

const CategoryShowcase = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover our wide range of customizable products across different categories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <Card 
              key={category.id} 
              className="group hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {category.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  {category.description}
                </p>
                <p className="text-sm text-primary font-medium mb-4">
                  {category.count}
                </p>
                <Link 
                  to="/shop" 
                  className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors duration-200"
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default CategoryShowcase;
