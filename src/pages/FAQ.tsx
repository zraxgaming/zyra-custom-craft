
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, HelpCircle, ChevronDown, ChevronRight } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  is_published: boolean;
}

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock FAQ data since the table might not exist yet
    const mockFaqs: FAQ[] = [
      {
        id: '1',
        question: 'How do I place a custom order?',
        answer: 'You can place a custom order by selecting a product and clicking the "Customize" button. Follow the design tool to add your text, images, or other customizations.',
        category: 'Orders',
        sort_order: 1,
        is_published: true
      },
      {
        id: '2',
        question: 'What payment methods do you accept?',
        answer: 'We accept PayPal, credit cards, and Ziina payments for your convenience.',
        category: 'Payment',
        sort_order: 2,
        is_published: true
      },
      {
        id: '3',
        question: 'How long does shipping take?',
        answer: 'Standard shipping takes 3-5 business days, while express shipping takes 1-2 business days.',
        category: 'Shipping',
        sort_order: 3,
        is_published: true
      },
      {
        id: '4',
        question: 'Can I return a custom product?',
        answer: 'Custom products can be returned within 14 days if there was an error in production. Please contact our support team.',
        category: 'Returns',
        sort_order: 4,
        is_published: true
      },
      {
        id: '5',
        question: 'What file formats do you accept for custom designs?',
        answer: 'We accept PNG, JPG, PDF, and SVG files. For best quality, please use high-resolution images.',
        category: 'Design',
        sort_order: 5,
        is_published: true
      }
    ];
    
    setFaqs(mockFaqs);
    setLoading(false);
  }, []);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // Group FAQs by category
  const faqsByCategory = faqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, FAQ[]>);

  // Filter FAQs based on search term
  const filteredFAQs = Object.entries(faqsByCategory).reduce((acc, [category, categoryFaqs]) => {
    const filtered = categoryFaqs.filter(
      faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as Record<string, FAQ[]>);

  if (loading) {
    return (
      <>
        <SEOHead 
          title="FAQ - Frequently Asked Questions | Zyra Custom Craft"
          description="Find answers to common questions about Zyra's custom products, shipping, returns, and more."
          url="https://shopzyra.vercel.app/faq"
        />
        <div className="min-h-screen bg-background">
          <Navbar />
          <Container className="py-8 md:py-12">
            <div className="text-center">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-muted rounded w-1/3 mx-auto"></div>
                <div className="h-4 bg-muted rounded w-2/3 mx-auto"></div>
              </div>
            </div>
          </Container>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead 
        title="FAQ - Frequently Asked Questions | Zyra Custom Craft"
        description="Find answers to common questions about Zyra's custom products, shipping, returns, and more."
        url="https://shopzyra.vercel.app/faq"
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        
        {/* Hero Section */}
        <section className="relative py-12 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5"></div>
          <Container className="relative z-10">
            <div className="text-center max-w-3xl mx-auto animate-fade-in px-4">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-primary/10 to-purple-500/10 p-3 md:p-4 rounded-2xl border border-primary/20 backdrop-blur-sm">
                    <HelpCircle className="h-8 w-8 md:h-10 md:w-10 text-primary animate-pulse" />
                  </div>
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 md:mb-6 animate-scale-in">
                Frequently Asked Questions
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed animate-slide-in-right">
                Find quick answers to common questions about our custom products, shipping, returns, and more.
              </p>
            </div>
          </Container>
        </section>

        {/* Search Section */}
        <section className="py-6 md:py-8 bg-muted/30">
          <Container>
            <div className="max-w-2xl mx-auto animate-fade-in px-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search frequently asked questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 text-base md:text-lg bg-background/80 backdrop-blur-sm border-2 border-border/50 focus:border-primary/50 transition-all duration-300 focus:scale-[1.02]"
                />
              </div>
            </div>
          </Container>
        </section>

        {/* FAQ Content */}
        <section className="py-8 md:py-16">
          <Container>
            <div className="space-y-8 md:space-y-12 px-4">
              {Object.entries(filteredFAQs).map(([category, categoryFaqs], categoryIndex) => (
                <div key={categoryIndex} className="animate-fade-in" style={{ animationDelay: `${categoryIndex * 100}ms` }}>
                  <div className="text-center mb-6 md:mb-8">
                    <Badge className="mb-4 bg-gradient-to-r from-primary to-purple-600 text-white">
                      {category}
                    </Badge>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">{category}</h2>
                  </div>
                  
                  <div className="max-w-4xl mx-auto space-y-3 md:space-y-4">
                    {categoryFaqs.map((faq, index) => {
                      const globalIndex = categoryIndex * 100 + index;
                      const isOpen = openItems.includes(globalIndex);
                      
                      return (
                        <Card 
                          key={faq.id} 
                          className="bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-all duration-300 animate-slide-in-right"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <Collapsible open={isOpen} onOpenChange={() => toggleItem(globalIndex)}>
                            <CollapsibleTrigger className="w-full">
                              <CardContent className="p-4 md:p-6">
                                <div className="flex items-center justify-between text-left">
                                  <h3 className="text-base md:text-lg font-semibold text-foreground pr-4">
                                    {faq.question}
                                  </h3>
                                  <div className="flex-shrink-0">
                                    {isOpen ? (
                                      <ChevronDown className="h-5 w-5 text-primary transition-transform duration-200" />
                                    ) : (
                                      <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform duration-200" />
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <CardContent className="px-4 md:px-6 pb-4 md:pb-6 pt-0">
                                <div className="border-t border-border/50 pt-4">
                                  <p className="text-muted-foreground leading-relaxed">
                                    {faq.answer}
                                  </p>
                                </div>
                              </CardContent>
                            </CollapsibleContent>
                          </Collapsible>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {Object.keys(filteredFAQs).length === 0 && (
              <div className="text-center py-12 animate-fade-in px-4">
                <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl md:text-2xl font-semibold mb-2 text-foreground">No results found</h3>
                <p className="text-muted-foreground mb-6">
                  We couldn't find any FAQs matching your search. Try different keywords or contact our support team.
                </p>
                <Badge className="bg-gradient-to-r from-primary to-purple-600">
                  Contact Support for Help
                </Badge>
              </div>
            )}
          </Container>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default FAQ;
