
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, Database, Cookie, Mail, Clock } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

const Privacy = () => {
  const sections = [
    {
      icon: <Database className="h-6 w-6" />,
      title: "Information We Collect",
      content: "We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us. This includes your name, email address, shipping address, and payment information."
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: "How We Use Your Information",
      content: "We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and communicate with you about products, services, and promotions."
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Information Sharing",
      content: "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share information with trusted partners who assist us in operating our website and conducting our business."
    },
    {
      icon: <Cookie className="h-6 w-6" />,
      title: "Cookies and Tracking",
      content: "We use cookies and similar technologies to collect information about your browsing activities and to provide you with relevant advertising. You can control cookies through your browser settings."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Data Security",
      content: "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure."
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Your Rights",
      content: "You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us. Contact us if you wish to exercise these rights."
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
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-primary to-purple-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-40 right-10 w-80 h-80 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full blur-3xl animate-pulse"></div>
        </div>

        {/* Hero Section */}
        <section className="relative py-16 overflow-hidden">
          <Container className="relative z-10">
            <div className="text-center mb-12 animate-fade-in">
              <Badge className="mb-6 bg-gradient-to-r from-primary to-purple-600 hover:scale-110 transition-transform duration-300 text-lg px-6 py-3" variant="outline">
                <Shield className="h-5 w-5 mr-3" />
                Privacy & Security
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-scale-in">
                Privacy Policy
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-slide-in-right">
                Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
              </p>
            </div>
          </Container>
        </section>

        {/* Last Updated */}
        <Container className="py-8 relative z-10">
          <Card className="bg-card/60 backdrop-blur-sm border-border/50 mb-8 animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Clock className="h-5 w-5" />
                <span>Last updated: January 1, 2024</span>
              </div>
            </CardContent>
          </Card>

          {/* Introduction */}
          <Card className="bg-card/60 backdrop-blur-sm border-border/50 mb-8 animate-scale-in">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                At Zyra, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you visit 
                our website or use our services. Please read this privacy policy carefully.
              </p>
            </CardContent>
          </Card>

          {/* Privacy Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <Card 
                key={index}
                className="bg-card/60 backdrop-blur-sm border-border/50 animate-scale-in hover:shadow-lg transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                      {section.icon}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-foreground mb-4">
                        {section.title}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* GDPR Compliance */}
          <Card className="bg-card/60 backdrop-blur-sm border-border/50 mt-8 animate-fade-in">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">GDPR Compliance</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you are a resident of the European Economic Area (EEA), you have certain data protection rights. 
                We aim to take reasonable steps to allow you to correct, amend, delete, or limit the use of your personal data.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>The right to access – You have the right to request copies of your personal data</li>
                <li>The right to rectification – You have the right to request correction of inaccurate data</li>
                <li>The right to erasure – You have the right to request deletion of your data</li>
                <li>The right to restrict processing – You have the right to request restriction of data processing</li>
                <li>The right to data portability – You have the right to request transfer of your data</li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20 mt-8 animate-fade-in">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Lock className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Questions About Privacy?</h2>
              </div>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                If you have any questions about this Privacy Policy or our data practices, 
                please don't hesitate to contact us. We're committed to addressing your concerns.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-300 hover:scale-105"
                >
                  Contact Us
                </a>
                <a 
                  href="/terms"
                  className="inline-flex items-center justify-center px-6 py-3 border border-primary/50 text-primary rounded-md hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105"
                >
                  Terms of Service
                </a>
              </div>
            </CardContent>
          </Card>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Privacy;
