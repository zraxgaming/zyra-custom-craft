
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import ChatBot from "@/components/chat/ChatBot";
import OnlineStatus from "@/components/layout/OnlineStatus";
import MaintenanceBanner from "@/components/layout/MaintenanceBanner";
import { Container } from "@/components/ui/container";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  featured: boolean;
  images?: string[];
}

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect from / to /home
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/home', { replace: true });
    }
  }, [location.pathname, navigate]);
  
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
      
      const transformedProducts: Product[] = (data || []).map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image_url: Array.isArray(product.images) && product.images.length > 0 
          ? String(product.images[0])
          : '/placeholder.svg',
        category: product.category,
        featured: product.featured,
        images: Array.isArray(product.images) ? product.images.map(String) : []
      }));
      
      return transformedProducts;
    },
  });

  return (
    <>
      <SEOHead />
      <div className="min-h-screen bg-background">
        <MaintenanceBanner />
        <OnlineStatus />
        <Navbar />
        <Container>
          <Hero />
          <Categories />
          <FeaturedProducts products={featuredProducts || []} isLoading={isLoading} />
          <Newsletter />
        </Container>
        <Footer />
        
        {/* Show appropriate chatbot based on user role */}
        <ChatBot 
          type={isAdmin ? "admin" : "customer"} 
          isOpen={isChatOpen} 
          onToggle={() => setIsChatOpen(!isChatOpen)} 
        />
      </div>
    </>
  );
};

export default Index;
