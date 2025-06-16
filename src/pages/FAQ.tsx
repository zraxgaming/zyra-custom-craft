
import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import SEOHead from "@/components/seo/SEOHead";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  is_active: boolean;
  sort_order: number;
}

const FAQ = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const categories = [...new Set(faqs.map(faq => faq.category))];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="FAQ - Frequently Asked Questions | Zyra Custom Craft"
        description="Find answers to commonly asked questions about our products, shipping, and services."
      />
      <Navbar />
      
      <Container className="py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-6">
              <HelpCircle className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-muted-foreground">
              Find answers to the most common questions about our products and services
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : categories.length > 0 ? (
            <div className="space-y-8">
              {categories.map(category => (
                <div key={category}>
                  <h2 className="text-2xl font-semibold mb-4 capitalize">{category}</h2>
                  <div className="space-y-4">
                    {faqs
                      .filter(faq => faq.category === category)
                      .map(faq => (
                        <Card key={faq.id} className="border-border/50">
                          <Collapsible
                            open={openItems.includes(faq.id)}
                            onOpenChange={() => toggleItem(faq.id)}
                          >
                            <CollapsibleTrigger className="w-full">
                              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 hover:bg-muted/50 transition-colors">
                                <CardTitle className="text-left text-lg font-medium">
                                  {faq.question}
                                </CardTitle>
                                {openItems.includes(faq.id) ? (
                                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                )}
                              </CardHeader>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <CardContent className="pt-0">
                                <div 
                                  className="text-muted-foreground"
                                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                                />
                              </CardContent>
                            </CollapsibleContent>
                          </Collapsible>
                        </Card>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No FAQs available at the moment.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </Container>
      
      <Footer />
    </div>
  );
};

export default FAQ;
