
import React from "react";
import { Container } from "@/components/ui/container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";

// Re-use Categories component from the home page
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
        
        <Categories onCategoryClick={(slug) => navigate(`/shop?category=${slug}`)} />
      </Container>
      <Footer />
    </>
  );
};

export default CategoryPage;
