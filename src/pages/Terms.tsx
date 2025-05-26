
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { FileText, Shield, Users, AlertTriangle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";

const Terms = () => {
  const sections = [
    {
      icon: FileText,
      title: "Terms of Service",
      content: "By using our services, you agree to these terms. Please read them carefully."
    },
    {
      icon: Users,
      title: "User Responsibilities",
      content: "Users are responsible for maintaining account security and following our guidelines."
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      content: "We protect your data and maintain strict security standards."
    },
    {
      icon: AlertTriangle,
      title: "Limitations",
      content: "Our liability is limited as outlined in these terms of service."
    }
  ];

  return (
    <>
      <SEOHead 
        title="Terms of Service - Zyra"
        description="Read Zyra's terms of service, user agreements, and legal policies."
        url="https://zyra.lovable.app/terms"
      />
      <div className="min-h-screen bg-background floating-dots-bg">
        <Navbar />
        
        <section className="py-20 bg-gradient-to-br from-primary/5 via-purple-500/5 to-background">
          <Container>
            <div className="text-center mb-16 animate-fade-in">
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Terms of Service
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Please read these terms carefully before using our services.
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </Container>
        </section>

        <Container className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {sections.map((section, index) => (
              <Card 
                key={section.title}
                className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <section.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-3">{section.title}</h3>
                  <p className="text-muted-foreground text-sm">{section.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="animate-slide-in-left">
              <CardHeader>
                <CardTitle>1. Acceptance of Terms</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none dark:prose-invert">
                <p>
                  By accessing and using Zyra's services, you accept and agree to be bound by the terms 
                  and provision of this agreement. If you do not agree to abide by the above, please do 
                  not use this service.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-slide-in-right">
              <CardHeader>
                <CardTitle>2. Use License</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none dark:prose-invert">
                <p>
                  Permission is granted to temporarily download one copy of Zyra's materials for personal, 
                  non-commercial transitory viewing only. This is the grant of a license, not a transfer 
                  of title, and under this license you may not:
                </p>
                <ul>
                  <li>modify or copy the materials</li>
                  <li>use the materials for any commercial purpose or for any public display</li>
                  <li>attempt to reverse engineer any software contained on Zyra's website</li>
                  <li>remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="animate-slide-in-left">
              <CardHeader>
                <CardTitle>3. User Accounts</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none dark:prose-invert">
                <p>
                  When you create an account with us, you must provide information that is accurate, 
                  complete, and current at all times. You are responsible for safeguarding the password 
                  and for all activities that occur under your account.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-slide-in-right">
              <CardHeader>
                <CardTitle>4. Product Orders and Customization</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none dark:prose-invert">
                <p>
                  All product orders are subject to acceptance by Zyra. We reserve the right to refuse 
                  or cancel any order for any reason. Custom products are made to order and cannot be 
                  returned unless defective.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-slide-in-left">
              <CardHeader>
                <CardTitle>5. Payment and Refunds</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none dark:prose-invert">
                <p>
                  Payment is required at the time of purchase. We accept various payment methods including 
                  credit cards and digital payment services. Refunds are processed according to our 
                  refund policy.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-slide-in-right">
              <CardHeader>
                <CardTitle>6. Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none dark:prose-invert">
                <p>
                  In no event shall Zyra or its suppliers be liable for any damages (including, without 
                  limitation, damages for loss of data or profit, or due to business interruption) arising 
                  out of the use or inability to use Zyra's materials.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-fade-in bg-gradient-to-r from-primary/5 to-purple-500/5">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold mb-4">Questions About These Terms?</h3>
                <p className="text-muted-foreground mb-6">
                  If you have any questions about these Terms of Service, please contact us.
                </p>
                <a 
                  href="/contact" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Contact Support
                </a>
              </CardContent>
            </Card>
          </div>
        </Container>
        
        <Footer />
      </div>
    </>
  );
};

export default Terms;
