
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import Categories from '@/components/home/Categories';
import Testimonials from '@/components/home/Testimonials';
import Newsletter from '@/components/home/Newsletter';
import SEOHead from '@/components/seo/SEOHead';
import MaintenanceBanner from '@/components/layout/MaintenanceBanner';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-purple-500/10 relative overflow-hidden">
      <SEOHead 
        title="Zyra Custom Craft - Premium Custom Products & Personalization"
        description="Discover premium custom products and personalization services at Zyra. Create unique, personalized items with our advanced customization tools."
        keywords="custom products, personalization, custom gifts, UAE, handmade, premium"
        image="/og-image.jpg"
      />
      
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.08]">
        <div className="absolute top-10 left-10 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-3 h-3 bg-purple-500 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-16 w-4 h-4 bg-pink-500 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-32 w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-3000"></div>
      </div>

      <MaintenanceBanner />
      <Navbar />
      
      <main className="relative z-10">
        <div className="opacity-0 animate-fade-in">
          <Hero />
        </div>
        
        <div className="opacity-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <FeaturedProducts />
        </div>
        
        <div className="opacity-0 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <Categories />
        </div>
        
        <div className="opacity-0 animate-fade-in" style={{ animationDelay: '0.9s' }}>
          <Testimonials />
        </div>
        
        <div className="opacity-0 animate-fade-in" style={{ animationDelay: '1.2s' }}>
          <Newsletter />
        </div>
      </main>
      
      <div className="opacity-0 animate-fade-in" style={{ animationDelay: '1.5s' }}>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
