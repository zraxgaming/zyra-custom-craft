
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import CallToAction from "@/components/home/CallToAction";
import Newsletter from "@/components/home/Newsletter";
import SEOHead from "@/components/seo/SEOHead";

const Home = () => {
  return (
    <>
      <SEOHead 
        title="Zyra - Customizable Products & Personalized Shopping"
        description="Discover Zyra's collection of customizable products. Create unique, personalized items with our innovative customization tools."
        url="https://zyra.lovable.app"
      />
      <Navbar />
      <main className="min-h-screen">
        <Hero />
        <Categories />
        <FeaturedProducts />
        <HowItWorks />
        <Testimonials />
        <CallToAction />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
};

export default Home;
