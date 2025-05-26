
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Shield, Eye, Lock, Database, Users, Cookie } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";

const Privacy = () => {
  const principles = [
    {
      icon: Shield,
      title: "Data Protection",
      description: "We implement industry-standard security measures to protect your information."
    },
    {
      icon: Eye,
      title: "Transparency",
      description: "We're clear about what data we collect and how we use it."
    },
    {
      icon: Lock,
      title: "User Control",
      description: "You have control over your data and can request deletion at any time."
    },
    {
      icon: Database,
      title: "Minimal Collection",
      description: "We only collect data that's necessary for our services."
    }
  ];

  return (
    <>
      <SEOHead 
        title="Privacy Policy - Zyra"
        description="Learn how Zyra protects your privacy and handles your personal information."
        url="https://zyra.lovable.app/privacy"
      />
      <div className="min-h-screen bg-background floating-dots-bg mesh-gradient-bg">
        <Navbar />
        
        <section className="py-20 bg-gradient-to-br from-primary/5 via-purple-500/5 to-background">
          <Container>
            <div className="text-center mb-16 animate-fade-in">
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Privacy Policy
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Your privacy is important to us. This policy explains how we collect, use, and protect your information.
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </Container>
        </section>

        <Container className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {principles.map((principle, index) => (
              <Card 
                key={principle.title}
                className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <principle.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-3">{principle.title}</h3>
                  <p className="text-muted-foreground text-sm">{principle.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="animate-slide-in-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none dark:prose-invert">
                <p>We collect information you provide directly to us, such as when you:</p>
                <ul>
                  <li>Create an account</li>
                  <li>Make a purchase</li>
                  <li>Contact customer support</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Customize products</li>
                </ul>
                <p>
                  This may include your name, email address, phone number, shipping address, 
                  payment information, and any custom design files you upload.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-slide-in-right">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none dark:prose-invert">
                <p>We use the information we collect to:</p>
                <ul>
                  <li>Process and fulfill your orders</li>
                  <li>Communicate with you about your purchases</li>
                  <li>Provide customer support</li>
                  <li>Improve our products and services</li>
                  <li>Send you marketing communications (with your consent)</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="animate-slide-in-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Information Sharing
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none dark:prose-invert">
                <p>
                  We do not sell, trade, or otherwise transfer your personal information to third parties 
                  without your consent, except in the following circumstances:
                </p>
                <ul>
                  <li>To fulfill your orders (shipping partners, payment processors)</li>
                  <li>To comply with legal requirements</li>
                  <li>To protect our rights and safety</li>
                  <li>With your explicit consent</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="animate-slide-in-right">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  Data Security
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none dark:prose-invert">
                <p>
                  We implement appropriate technical and organizational security measures to protect 
                  your personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>
                <p>These measures include:</p>
                <ul>
                  <li>Encryption of sensitive data</li>
                  <li>Regular security assessments</li>
                  <li>Access controls and authentication</li>
                  <li>Secure data storage and transmission</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="animate-slide-in-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cookie className="h-5 w-5 text-primary" />
                  Cookies and Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none dark:prose-invert">
                <p>
                  We use cookies and similar tracking technologies to enhance your browsing experience, 
                  analyze site traffic, and understand user preferences.
                </p>
                <p>You can control cookie settings through your browser preferences.</p>
              </CardContent>
            </Card>

            <Card className="animate-slide-in-right">
              <CardHeader>
                <CardTitle>Your Rights</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none dark:prose-invert">
                <p>You have the right to:</p>
                <ul>
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Object to data processing</li>
                  <li>Data portability</li>
                  <li>Withdraw consent</li>
                </ul>
                <p>To exercise these rights, please contact us using the information below.</p>
              </CardContent>
            </Card>

            <Card className="animate-fade-in bg-gradient-to-r from-primary/5 to-purple-500/5">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold mb-4">Questions About Your Privacy?</h3>
                <p className="text-muted-foreground mb-6">
                  If you have any questions about this Privacy Policy or our data practices, please contact us.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/contact" 
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Contact Us
                  </a>
                  <a 
                    href="mailto:privacy@zyra.com" 
                    className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    privacy@zyra.com
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
        
        <Footer />
      </div>
    </>
  );
};

export default Privacy;
