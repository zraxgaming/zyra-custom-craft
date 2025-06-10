import React from "react";
import { Container } from "@/components/ui/container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Import the updated Categories component that fetches from the database
import Categories from "@/components/home/Categories";
import SEOHead from '@/components/seo/SEOHead';

const CategoryPage = () => {
  return (
    <>
      <SEOHead 
        title="Categories - Zyra Custom Craft"
        description="Browse all product categories at Zyra Custom Craft. Discover curated collections and find your next favorite item."
        url="https://shopzyra.vercel.app/categories"
        keywords="categories, shop, zyra, custom craft, collections"
      />
      <Navbar />
      <Container className="py-12">
        <h1 className="text-4xl font-bold mb-8">Browse Categories</h1>
        <p className="text-lg text-gray-600 mb-8">
          Explore our curated collection of products organized by category. Find everything you need and discover new favorites.
        </p>
        
        <Categories />
        
        <div className="mt-12 text-center">
          <Button asChild size="lg">
            <Link to="/shop">View All Products</Link>
          </Button>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default CategoryPage;
