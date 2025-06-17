
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/home/Hero';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import Categories from '@/components/home/Categories';
import About from '@/components/home/About';
import Testimonials from '@/components/home/Testimonials';
import Newsletter from '@/components/home/Newsletter';
import Footer from '@/components/layout/Footer';
import CallToAction from '@/components/home/CallToAction';
import HowItWorks from '@/components/home/HowItWorks';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Zyra Custom Craft - Premium Custom Products & Personalized Gifts</title>
        <meta name="description" content="Discover Zyra Custom Craft's premium collection of personalized mugs, custom t-shirts, and unique gifts. Create meaningful, customized products with our easy-to-use design tools." />
        <meta name="keywords" content="custom mugs, personalized t-shirts, custom gifts, personalized products, custom printing, unique gifts, Zyra" />
        <meta property="og:title" content="Zyra Custom Craft - Premium Custom Products & Personalized Gifts" />
        <meta property="og:description" content="Create unique, personalized products with Zyra Custom Craft. From custom mugs to personalized apparel - make it yours!" />
        <meta property="og:image" content="https://shopzyra.vercel.app/og-image.jpg" />
        <meta property="og:url" content="https://shopzyra.vercel.app" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Zyra Custom Craft - Premium Custom Products" />
        <meta name="twitter:description" content="Create unique, personalized products with Zyra Custom Craft. Premium quality, endless customization options." />
        <meta name="twitter:image" content="https://shopzyra.vercel.app/og-image.jpg" />
        <link rel="canonical" href="https://shopzyra.vercel.app" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Zyra Custom Craft",
            "url": "https://shopzyra.vercel.app",
            "logo": "https://shopzyra.vercel.app/logo.png",
            "description": "Premium custom products and personalized gifts",
            "sameAs": [
              "https://facebook.com/zyracustomcraft",
              "https://instagram.com/zyracustomcraft"
            ],
            "offers": {
              "@type": "AggregateOffer",
              "availability": "https://schema.org/InStock",
              "priceCurrency": "USD",
              "lowPrice": "15.99",
              "highPrice": "89.99"
            }
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        <Hero />
        <FeaturedProducts />
        <Categories />
        <HowItWorks />
        <About />
        <Testimonials />
        <CallToAction />
        <Newsletter />
        <Footer />
      </div>
    </>
  );
};

export default Index;
