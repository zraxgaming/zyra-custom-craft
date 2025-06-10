import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, HelpCircle, ChevronDown, ChevronRight } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqCategories = [
    {
      category: "Orders & Shipping",
      color: "from-blue-600 to-purple-600",
      questions: [
        {
          question: "How long does shipping take?",
          answer: "Standard shipping takes 3-5 business days within the US. International shipping takes 7-14 business days. Express shipping options are available for faster delivery."
        },
        {
          question: "Can I track my order?",
          answer: "Yes! Once your order ships, you'll receive a tracking number via email. You can also track your order in your account dashboard."
        },
        {
          question: "What are your shipping costs?",
          answer: "Shipping costs vary by location and speed. Standard US shipping is $5.99, free on orders over $50. International rates start at $12.99."
        },
        {
          question: "Do you ship internationally?",
          answer: "Yes, we ship to over 100 countries worldwide. Shipping costs and delivery times vary by destination."
        }
      ]
    },
    {
      category: "Customization",
      color: "from-purple-600 to-pink-600",
      questions: [
        {
          question: "What products can be customized?",
          answer: "Most of our products offer customization options including phone cases, mugs, t-shirts, hoodies, and accessories. Look for the 'Customizable' badge on product pages."
        },
        {
          question: "What file formats do you accept for custom images?",
          answer: "We accept JPG, PNG, SVG, and PDF files. For best quality, use high-resolution images (300 DPI or higher)."
        },
        {
          question: "Can I preview my custom design before ordering?",
          answer: "Absolutely! Our live preview tool shows exactly how your design will look on the product before you add it to cart."
        },
        {
          question: "Are there any restrictions on custom text or images?",
          answer: "We don't allow copyrighted content, offensive material, or low-quality images. Our team reviews all custom orders to ensure quality standards."
        }
      ]
    },
    {
      category: "Returns & Refunds",
      color: "from-pink-600 to-red-600",
      questions: [
        {
          question: "What's your return policy?",
          answer: "We offer 30-day returns for non-customized items in original condition. Custom products have a 7-day return window for manufacturing defects only."
        },
        {
          question: "How do I start a return?",
          answer: "Log into your account, go to 'My Orders', and click 'Return Item' next to the product. Follow the prompts to generate a return label."
        },
        {
          question: "When will I receive my refund?",
          answer: "Refunds are processed within 3-5 business days after we receive your returned item. The refund will appear on your original payment method within 5-10 business days."
        },
        {
          question: "Who pays for return shipping?",
          answer: "We provide free return labels for defective items. For other returns, customers are responsible for return shipping costs."
        }
      ]
    },
    {
      category: "Account & Payment",
      color: "from-green-600 to-blue-600",
      questions: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards, PayPal, Ziina, Apple Pay, and Google Pay. All transactions are secured with SSL encryption."
        },
        {
          question: "Do I need an account to place an order?",
          answer: "You can checkout as a guest, but creating an account lets you track orders, save designs, and access exclusive member benefits."
        },
        {
          question: "How do I reset my password?",
          answer: "Click 'Forgot Password' on the login page, enter your email, and we'll send you a reset link. The link expires in 24 hours for security."
        },
        {
          question: "Can I change my order after placing it?",
          answer: "You can modify or cancel orders within 1 hour of placement. After that, contact our support team and we'll do our best to help."
        }
      ]
    }
  ];

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <>
      <SEOHead 
        title="FAQ - Zyra Custom Craft"
        description="Frequently asked questions about Zyra Custom Craft. Find answers about orders, shipping, returns, customization, and more."
        url="https://shopzyra.vercel.app/faq"
        keywords="faq, questions, help, zyra, custom craft, shipping, returns, support"
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5"></div>
          <Container className="relative z-10">
            <div className="text-center max-w-3xl mx-auto animate-fade-in">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-primary/10 to-purple-500/10 p-4 rounded-2xl border border-primary/20 backdrop-blur-sm">
                    <HelpCircle className="h-10 w-10 text-primary animate-pulse" />
                  </div>
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 animate-scale-in">
                Frequently Asked Questions
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed animate-slide-in-right">
                Find quick answers to common questions about our products, shipping, returns, and more. 
                Can't find what you're looking for? Contact our support team.
              </p>
            </div>
          </Container>
        </section>

        {/* Search Section */}
        <section className="py-8 bg-muted/30">
          <Container>
            <div className="max-w-2xl mx-auto animate-fade-in">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search frequently asked questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 text-lg bg-background/80 backdrop-blur-sm border-2 border-border/50 focus:border-primary/50 transition-all duration-300 focus:scale-[1.02]"
                />
              </div>
            </div>
          </Container>
        </section>

        {/* FAQ Content */}
        <section className="py-16">
          <Container>
            <div className="space-y-12">
              {filteredFAQs.map((category, categoryIndex) => (
                <div key={categoryIndex} className="animate-fade-in" style={{ animationDelay: `${categoryIndex * 100}ms` }}>
                  <div className="text-center mb-8">
                    <Badge className={`mb-4 bg-gradient-to-r ${category.color} text-white`}>
                      {category.category}
                    </Badge>
                    <h2 className="text-3xl font-bold text-foreground">{category.category}</h2>
                  </div>
                  
                  <div className="max-w-4xl mx-auto space-y-4">
                    {category.questions.map((faq, index) => {
                      const globalIndex = categoryIndex * 100 + index;
                      const isOpen = openItems.includes(globalIndex);
                      
                      return (
                        <Card 
                          key={index} 
                          className="bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-all duration-300 animate-slide-in-right"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <Collapsible open={isOpen} onOpenChange={() => toggleItem(globalIndex)}>
                            <CollapsibleTrigger className="w-full">
                              <CardContent className="p-6">
                                <div className="flex items-center justify-between text-left">
                                  <h3 className="text-lg font-semibold text-foreground pr-4">
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
                              <CardContent className="px-6 pb-6 pt-0">
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

            {filteredFAQs.length === 0 && (
              <div className="text-center py-12 animate-fade-in">
                <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2 text-foreground">No results found</h3>
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
