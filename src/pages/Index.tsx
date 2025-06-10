
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

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-purple-500/10 relative overflow-hidden">
      <SEOHead 
        title="Zyra Custom Craft - Premium Custom Products & Personalization"
        description="Discover premium custom products and personalization services at Zyra. Create unique, personalized items with our advanced customization tools."
        keywords="custom products, personalization, custom gifts, UAE, handmade, premium"
        image="/og-image.jpg"
      />
      
      {/* Animated Background Particles */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.08]">
        <div className="absolute top-10 left-10 w-2 h-2 bg-primary rounded-full animate-float"></div>
        <div className="absolute top-20 right-20 w-3 h-3 bg-purple-500 rounded-full animate-float delay-1000"></div>
        <div className="absolute bottom-32 left-16 w-4 h-4 bg-pink-500 rounded-full animate-float delay-2000"></div>
        <div className="absolute bottom-20 right-32 w-2 h-2 bg-blue-500 rounded-full animate-float delay-3000"></div>
        <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-green-500 rounded-full animate-float delay-4000"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-orange-500 rounded-full animate-float delay-5000"></div>
      </div>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-40 left-[10%] w-16 h-16 border-2 border-primary/20 rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-40 right-[15%] w-12 h-12 border-2 border-purple-500/20 rounded-full animate-pulse-glow"></div>
        <div className="absolute top-[60%] left-[80%] w-20 h-20 border-2 border-pink-500/20 rotate-12 animate-float"></div>
        <div className="absolute top-[20%] right-[70%] w-8 h-8 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full animate-bounce"></div>
      </div>

      {/* Gradient Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full blur-3xl animate-pulse-gentle"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-full blur-3xl animate-float-reverse"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl animate-float"></div>
      </div>

      <MaintenanceBanner />
      <Navbar />
      
      <main className="relative z-10">
        <div className="animate-fade-in">
          <Hero />
        </div>
        
        <div className="animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
          <FeaturedProducts />
        </div>
        
        <div className="animate-slide-in-left" style={{ animationDelay: '0.6s' }}>
          <Categories />
        </div>
        
        <div className="animate-slide-in-right" style={{ animationDelay: '0.9s' }}>
          <Testimonials />
        </div>
        
        <div className="animate-bounce-in" style={{ animationDelay: '1.2s' }}>
          <Newsletter />
        </div>
      </main>
      
      <div className="animate-fade-in" style={{ animationDelay: '1.5s' }}>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
