
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import About from "@/components/home/About";
import Newsletter from "@/components/home/Newsletter";
import SEOHead from "@/components/seo/SEOHead";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Premium Custom Products & Personalized Gifts"
        description="Discover exceptional custom products and personalized gifts at Zyra Custom Craft. From custom printing to bespoke designs, we create unique items tailored to your vision."
        keywords="custom products, personalized gifts, custom printing, bespoke design, unique items, custom craft, personalized products"
      />
      <Navbar />
      
      <main className="animate-fade-in">
        <Hero />
        <FeaturedProducts />
        <CategoryShowcase />
        <About />
        <Newsletter />
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
