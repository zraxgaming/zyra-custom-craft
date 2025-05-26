
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Scale, FileText, Shield } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

const Terms = () => {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using the Zyra website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service."
    },
    {
      title: "2. Services Description",
      content: "Zyra provides custom product creation and personalization services. We offer a platform where users can design, customize, and order personalized products including but not limited to apparel, accessories, and promotional items."
    },
    {
      title: "3. User Accounts",
      content: "To access certain features of our service, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account."
    },
    {
      title: "4. Orders and Payment",
      content: "All orders are subject to acceptance and availability. Prices are subject to change without notice. Payment must be received before order processing begins. We accept various payment methods as displayed on our website."
    },
    {
      title: "5. Custom Products",
      content: "Custom products are made to order based on your specifications. Due to the personalized nature of our products, all sales are final unless the product is defective or does not match your approved design."
    },
    {
      title: "6. Intellectual Property",
      content: "You retain ownership of any original content you provide. However, you grant Zyra a license to use, reproduce, and modify your content as necessary to fulfill your order. You must ensure you have the right to use any content you submit."
    },
    {
      title: "7. Shipping and Delivery",
      content: "We will make every effort to deliver products within the timeframe specified. However, delivery times are estimates and not guarantees. Shipping costs and delivery times vary based on location and shipping method selected."
    },
    {
      title: "8. Returns and Refunds",
      content: "Due to the custom nature of our products, returns are generally not accepted unless the product is defective or significantly different from what was ordered. Refund requests must be submitted within 30 days of delivery."
    },
    {
      title: "9. Limitation of Liability",
      content: "Zyra shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses."
    },
    {
      title: "10. Privacy Policy",
      content: "Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices regarding the collection and use of your personal information."
    },
    {
      title: "11. Modifications to Terms",
      content: "We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of the service after changes constitutes acceptance of the new terms."
    },
    {
      title: "12. Contact Information",
      content: "If you have any questions about these Terms of Service, please contact us through our website contact form or email us at support@zyra.com."
    }
  ];

  return (
    <>
      <SEOHead 
        title="Terms of Service - Zyra"
        description="Read Zyra's Terms of Service to understand your rights and responsibilities when using our custom product services."
        url="https://zyra.lovable.app/terms"
      />
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-purple-500/10 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-primary to-purple-500 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-40 right-10 w-80 h-80 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full blur-3xl animate-float-reverse"></div>
        </div>

        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <Container className="relative z-10">
            <div className="text-center mb-16 animate-fade-in">
              <Badge className="mb-6 bg-gradient-to-r from-primary to-purple-600 hover:scale-110 transition-transform duration-300 text-lg px-6 py-3" variant="outline">
                <Scale className="h-5 w-5 mr-3" />
                Legal Information
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-scale-in">
                Terms of Service
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-slide-in-right">
                Please read these terms carefully before using our services. They outline your rights and responsibilities.
              </p>
            </div>
          </Container>
        </section>

        {/* Content */}
        <Container className="py-16 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-card/60 backdrop-blur-sm border-border/50 mb-8 animate-scale-in">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Important Notice</h2>
                    <p className="text-muted-foreground">Last updated: January 2024</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms of Service ("Terms") govern your use of the Zyra website and services. 
                  By using our services, you agree to be bound by these terms. Please read them carefully.
                </p>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {sections.map((section, index) => (
                <Card 
                  key={index}
                  className="bg-card/60 backdrop-blur-sm border-border/50 animate-scale-in hover:shadow-lg transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-8">
                    <h3 className="text-xl font-semibold text-foreground mb-4">{section.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20 mt-12 animate-fade-in">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Questions?</h3>
                </div>
                <p className="text-muted-foreground">
                  If you have any questions about these Terms of Service, please don't hesitate to contact us. 
                  We're here to help clarify any concerns you may have.
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Terms;
