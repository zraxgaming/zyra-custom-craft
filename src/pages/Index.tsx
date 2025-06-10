
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import Categories from '@/components/home/Categories';
import Testimonials from '@/components/home/Testimonials';
import Newsletter from '@/components/home/Newsletter';
import SEOHead from '@/components/seo/SEOHead';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Zyra Custom Craft - Premium Custom Products & Personalization"
        description="Discover premium custom products and personalization services at Zyra. Create unique, personalized items with our advanced customization tools."
        keywords="custom products, personalization, custom gifts, UAE, handmade, premium"
        image="/og-image.jpg"
      />
      <Navbar />
      <main>
        <Hero />
        <FeaturedProducts />
        <Categories />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
