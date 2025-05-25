
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Scale, Users, Shield, CreditCard, Package } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

const TermsOfService = () => {
  const sections = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Account Terms",
      content: [
        "You must be 18 years or older to create an account",
        "You are responsible for maintaining the security of your account credentials",
        "You must provide accurate and complete information when creating your account",
        "One person or entity may not maintain more than one free account",
        "You are responsible for all activity that occurs under your account",
        "We reserve the right to suspend or terminate accounts that violate these terms"
      ]
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: "Product & Customization Terms",
      content: [
        "All product descriptions, prices, and availability are subject to change without notice",
        "Custom products are made to order and may take additional processing time",
        "You retain ownership of your custom designs, but grant us license to produce them",
        "We reserve the right to refuse custom orders that violate copyright or contain inappropriate content",
        "Product colors may vary slightly from what appears on your screen",
        "We guarantee our products will match the approved proof or preview"
      ]
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Payment Terms",
      content: [
        "Payment is required at the time of order placement",
        "We accept major credit cards, PayPal, and other listed payment methods",
        "All prices are in USD unless otherwise specified",
        "You authorize us to charge your payment method for all fees and taxes",
        "Refunds are processed according to our return policy",
        "We use secure, PCI-compliant payment processing"
      ]
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: "Shipping & Returns",
      content: [
        "Shipping costs and delivery times vary by location and method selected",
        "Risk of loss transfers to you upon delivery to the shipping carrier",
        "Standard items may be returned within 30 days of delivery",
        "Custom products may only be returned if they contain manufacturing defects",
        "Return shipping costs are the responsibility of the customer unless the item is defective",
        "Refunds are processed within 5-10 business days after we receive returned items"
      ]
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Intellectual Property",
      content: [
        "All website content, including text, graphics, and code, is owned by Zyra",
        "You may not reproduce, distribute, or create derivative works without permission",
        "User-submitted content must not infringe on third-party copyrights or trademarks",
        "We respect intellectual property rights and respond to valid DMCA notices",
        "You grant us a license to use your custom designs solely for fulfilling your orders",
        "We reserve the right to remove content that violates intellectual property rights"
      ]
    },
    {
      icon: <Scale className="h-6 w-6" />,
      title: "Limitation of Liability",
      content: [
        "Our total liability is limited to the amount you paid for the specific product or service",
        "We are not liable for indirect, incidental, or consequential damages",
        "We do not warrant that our service will be uninterrupted or error-free",
        "You use our service at your own risk",
        "Some jurisdictions do not allow limitation of liability, so these limits may not apply to you",
        "Our liability limitations apply to the fullest extent permitted by law"
      ]
    }
  ];

  return (
    <>
      <SEOHead 
        title="Terms of Service - Zyra"
        description="Read Zyra's terms of service to understand your rights and responsibilities when using our custom product platform."
        keywords="terms of service, legal terms, user agreement, terms and conditions"
        url="https://zyra.lovable.app/terms"
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
                    <FileText className="h-10 w-10 text-primary animate-pulse" />
                  </div>
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 animate-scale-in">
                Terms of Service
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed animate-slide-in-right">
                These terms govern your use of Zyra's services. By using our platform, 
                you agree to these terms and conditions.
              </p>
              <div className="mt-6 p-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Last updated:</strong> January 2024 | <strong>Effective:</strong> All users worldwide
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Overview Section */}
        <section className="py-16 bg-muted/30">
          <Container>
            <div className="max-w-4xl mx-auto">
              <Card className="bg-card/50 backdrop-blur-sm border border-border/50 animate-fade-in">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold mb-6 text-foreground">Agreement Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-foreground">Your Agreement</h3>
                      <p className="text-muted-foreground">
                        By accessing or using Zyra's services, you agree to be bound by these Terms of Service. 
                        If you disagree with any part of these terms, you may not access our service.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-foreground">Changes to Terms</h3>
                      <p className="text-muted-foreground">
                        We reserve the right to update these terms at any time. We will notify users of significant 
                        changes via email or through our website. Continued use constitutes acceptance of new terms.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Container>
        </section>

        {/* Detailed Sections */}
        <section className="py-16">
          <Container>
            <div className="max-w-4xl mx-auto space-y-8">
              {sections.map((section, index) => (
                <Card 
                  key={index} 
                  className="bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-all duration-300 animate-slide-in-right"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 text-primary">
                        {section.icon}
                      </div>
                      <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>
                    </div>
                    <ul className="space-y-3">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-muted-foreground">{item}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        {/* Additional Terms */}
        <section className="py-16 bg-muted/30">
          <Container>
            <div className="max-w-4xl mx-auto">
              <Card className="bg-card/50 backdrop-blur-sm border border-border/50 animate-fade-in">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold mb-6 text-foreground">Additional Important Terms</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">Governing Law</h3>
                      <p className="text-muted-foreground">
                        These terms are governed by the laws of [Your Jurisdiction]. Any disputes will be resolved 
                        through binding arbitration or in the courts of [Your Jurisdiction].
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">Severability</h3>
                      <p className="text-muted-foreground">
                        If any provision of these terms is found to be unenforceable, the remaining provisions 
                        will continue to be valid and enforceable.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">Entire Agreement</h3>
                      <p className="text-muted-foreground">
                        These terms constitute the entire agreement between you and Zyra regarding the use of our service, 
                        superseding any prior agreements.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Container>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <Container>
            <div className="max-w-4xl mx-auto">
              <Card className="bg-card/50 backdrop-blur-sm border border-border/50 animate-fade-in">
                <CardContent className="p-8 text-center">
                  <h2 className="text-3xl font-bold mb-4 text-foreground">Questions About These Terms?</h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    If you have any questions about these terms of service, please contact our legal team.
                  </p>
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl border border-primary/20">
                    <Scale className="h-5 w-5 text-primary" />
                    <span className="font-medium text-foreground">legal@zyra.com</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Container>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default TermsOfService;
