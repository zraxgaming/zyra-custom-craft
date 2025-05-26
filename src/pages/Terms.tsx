
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, Shield, FileText, Clock } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

const Terms = () => {
  const sections = [
    {
      title: "Acceptance of Terms",
      content: "By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement."
    },
    {
      title: "Use License",
      content: "Permission is granted to temporarily download one copy of the materials on Zyra's website for personal, non-commercial transitory viewing only."
    },
    {
      title: "Disclaimer",
      content: "The materials on Zyra's website are provided on an 'as is' basis. Zyra makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability."
    },
    {
      title: "Limitations",
      content: "In no event shall Zyra or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Zyra's website."
    },
    {
      title: "Accuracy of Materials",
      content: "The materials appearing on Zyra's website could include technical, typographical, or photographic errors. Zyra does not warrant that any of the materials on its website are accurate, complete, or current."
    },
    {
      title: "Links",
      content: "Zyra has not reviewed all of the sites linked to our website and is not responsible for the contents of any such linked site."
    },
    {
      title: "Modifications",
      content: "Zyra may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service."
    },
    {
      title: "Governing Law",
      content: "These terms and conditions are governed by and construed in accordance with the laws of [Your Jurisdiction] and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location."
    }
  ];

  return (
    <>
      <SEOHead 
        title="Terms of Service - Zyra"
        description="Read our terms of service to understand your rights and responsibilities when using Zyra's custom product platform."
        url="https://zyra.lovable.app/terms"
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
                <Scale className="h-5 w-5 mr-3" />
                Legal Document
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-scale-in">
                Terms of Service
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-slide-in-right">
                Please read these terms carefully before using our services. Your use of our platform constitutes acceptance of these terms.
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

          {/* Terms Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <Card 
                key={index}
                className="bg-card/60 backdrop-blur-sm border-border/50 animate-scale-in hover:shadow-lg transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <FileText className="h-6 w-6 text-primary" />
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

          {/* Contact Section */}
          <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20 mt-12 animate-fade-in">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Shield className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Questions About These Terms?</h2>
              </div>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                If you have any questions about these Terms of Service, please don't hesitate to contact us. 
                We're here to help clarify any concerns you may have.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-300 hover:scale-105"
                >
                  Contact Us
                </a>
                <a 
                  href="/privacy"
                  className="inline-flex items-center justify-center px-6 py-3 border border-primary/50 text-primary rounded-md hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105"
                >
                  Privacy Policy
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

export default Terms;
