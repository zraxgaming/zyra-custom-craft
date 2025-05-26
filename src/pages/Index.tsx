
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { Container } from "@/components/ui/container";

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
      
      return data || [];
    },
  });

  return (
    <>
      <SEOHead />
      <div className="min-h-screen bg-background">
        <Navbar />
        <Container>
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
