
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, Database, UserCheck } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

const Privacy = () => {
  const sections = [
    {
      icon: <Database className="h-6 w-6" />,
      title: "Information We Collect",
      content: "We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us. This includes your name, email address, shipping address, payment information, and any custom design content you upload."
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: "How We Use Your Information",
      content: "We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and communicate with you about products, services, and promotional offers."
    },
    {
      icon: <UserCheck className="h-6 w-6" />,
      title: "Information Sharing",
      content: "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share your information with service providers who assist us in operating our website and conducting business."
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Data Security",
      content: "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Your Rights",
      content: "You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us. Contact us if you wish to exercise any of these rights."
    }
  ];

  return (
    <>
      <SEOHead 
        title="Privacy Policy - Zyra"
        description="Learn how Zyra protects your privacy and handles your personal information. Read our comprehensive privacy policy."
        url="https://zyra.lovable.app/privacy"
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
                <Shield className="h-5 w-5 mr-3" />
                Privacy & Security
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-scale-in">
                Privacy Policy
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-slide-in-right">
                Your privacy is important to us. This policy explains how we collect, use, and protect your information.
              </p>
            </div>
          </Container>
        </section>

        {/* Content */}
        <Container className="py-16 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-card/60 backdrop-blur-sm border-border/50 mb-12 animate-scale-in">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Our Commitment to Privacy</h2>
                    <p className="text-muted-foreground">Last updated: January 2024</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  At Zyra, we are committed to protecting your privacy and ensuring the security of your personal information. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.
                </p>
              </CardContent>
            </Card>

            <div className="space-y-8">
              {sections.map((section, index) => (
                <Card 
                  key={index}
                  className="bg-card/60 backdrop-blur-sm border-border/50 animate-scale-in hover:shadow-lg transition-all duration-300"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-full text-primary flex-shrink-0">
                        {section.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-4">{section.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <Card className="bg-card/60 backdrop-blur-sm border-border/50 animate-scale-in">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-4">Cookies and Tracking</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We use cookies and similar tracking technologies to enhance your browsing experience, 
                    analyze site traffic, and understand where our visitors are coming from. You can control 
                    cookie settings through your browser preferences.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/60 backdrop-blur-sm border-border/50 animate-scale-in" style={{ animationDelay: '200ms' }}>
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-4">Children's Privacy</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Our services are not directed to children under 13. We do not knowingly collect 
                    personal information from children under 13. If you are a parent or guardian and 
                    believe your child has provided us with personal information, please contact us.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20 mt-12 animate-fade-in">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Lock className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Contact Us About Privacy</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  If you have any questions or concerns about this Privacy Policy or our data practices, 
                  please don't hesitate to contact us. We're committed to addressing your privacy concerns promptly.
                </p>
                <p className="text-sm text-muted-foreground">
                  Email: privacy@zyra.com | Address: 123 Privacy Street, Data City, DC 12345
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

export default Privacy;
