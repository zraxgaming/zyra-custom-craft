
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { Container } from "@/components/ui/container";
import { Product } from "@/types/product";
import { registerServiceWorker, requestNotificationPermission, setupPromotionalNotifications } from "@/utils/pwa";

const Index = () => {
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

  useEffect(() => {
    // Register service worker and setup PWA features
    const initPWA = async () => {
      await registerServiceWorker();
      const notificationPermission = await requestNotificationPermission();
      
      if (notificationPermission) {
        setupPromotionalNotifications();
      }
    };

    initPWA();
  }, []);

  return (
    <>
      <SEOHead />
      <div className="min-h-screen bg-background floating-dots-bg particle-field-bg page-transition">
        <Navbar />
        <Container className="content-reveal">
          <Hero />
          <Categories />
          <FeaturedProducts products={featuredProducts || []} isLoading={isLoading} />
          <Newsletter />
        </Container>
        <Footer />
      </div>
    </>
  );
};

export default Index;
