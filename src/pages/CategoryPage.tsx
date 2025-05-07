
import React from "react";
import { Container } from "@/components/ui/container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";

// Import the Categories component that doesn't require onCategoryClick prop
import Categories from "@/components/home/Categories";

const CategoryPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <Container className="py-12">
        <h1 className="text-4xl font-bold mb-8">Browse Categories</h1>
        <p className="text-lg text-gray-600 mb-8">
          Explore our curated collection of products organized by category. Find everything you need and discover new favorites.
        </p>
        
        {/* Fix: Remove the onCategoryClick prop since it's causing the TypeScript error */}
        <Categories />
      </Container>
      <Footer />
    </>
  );
};

export default CategoryPage;
