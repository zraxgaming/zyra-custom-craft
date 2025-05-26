
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
import { Product } from "@/types/product";

const Home = () => {
  const { data: featuredProducts, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .eq('status', 'published')
        .limit(8);
      
      if (error) {
        console.error('Error fetching featured products:', error);
        return [];
      }
      
      // Transform the data to match Product interface
      const transformedProducts: Product[] = (data || []).map(product => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        images: Array.isArray(product.images) ? 
          (product.images as any[]).filter(img => typeof img === 'string') : [],
        rating: product.rating,
        review_count: product.review_count,
        is_new: product.is_new,
        is_customizable: product.is_customizable,
        discount_percentage: product.discount_percentage,
        in_stock: product.in_stock,
        stock_quantity: product.stock_quantity,
        category: product.category,
        is_featured: product.is_featured,
        status: product.status,
        sku: product.sku,
        is_digital: product.is_digital,
        featured: product.featured,
        created_at: product.created_at
      }));
      
      return transformedProducts;
    },
  });

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
        <FeaturedProducts products={featuredProducts || []} isLoading={isLoading} />
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
