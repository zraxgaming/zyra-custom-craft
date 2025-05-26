
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, Users, Database, Globe, Mail } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

const Privacy = () => {
  const sections = [
    {
      title: "1. Information We Collect",
      icon: Database,
      content: "We collect information you provide directly to us, such as:",
      list: [
        "Account information (name, email address, password)",
        "Order information (shipping address, payment details)",
        "Customization data (text, images, design preferences)",
        "Communication data (customer service interactions)"
      ],
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "2. How We Use Your Information",
      icon: Eye,
      content: "We use the information we collect to:",
      list: [
        "Process and fulfill your orders",
        "Communicate with you about your orders and our services",
        "Improve our products and services",
        "Send you marketing communications (with your consent)",
        "Comply with legal obligations"
      ],
      color: "from-green-500 to-teal-500"
    },
    {
      title: "3. Information Sharing",
      icon: Users,
      content: "We may share your information with:",
      list: [
        "Service providers who help us operate our business",
        "Payment processors to handle transactions",
        "Shipping companies to deliver your orders",
        "Legal authorities when required by law"
      ],
      additionalContent: "We do not sell, trade, or rent your personal information to third parties.",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "4. Data Security",
      icon: Lock,
      content: "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption of sensitive data, secure servers, and regular security audits.",
      color: "from-orange-500 to-red-500"
    },
    {
      title: "5. Your Rights",
      icon: Shield,
      content: "You have the right to:",
      list: [
        "Access your personal information",
        "Correct inaccurate information",
        "Delete your account and personal data",
        "Opt out of marketing communications",
        "Request data portability"
      ],
      color: "from-indigo-500 to-blue-500"
    },
    {
      title: "6. Cookies and Tracking",
      icon: Globe,
      content: "We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors are coming from. You can control cookie settings through your browser preferences.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      title: "7. Contact Us",
      icon: Mail,
      content: "If you have any questions about this Privacy Policy or our data practices, please contact us at privacy@zyra.com or through our contact page.",
      color: "from-pink-500 to-red-500"
    }
  ];

  return (
    <>
      <SEOHead 
        title="Privacy Policy - Zyra"
        description="Learn how Zyra protects your privacy and handles your personal information."
        url="https://zyra.lovable.app/privacy"
      />
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-purple-500/10 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-primary to-purple-500 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-40 right-10 w-80 h-80 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full blur-3xl animate-float" style={{ animationDelay: '5s' }}></div>
        </div>

        <Container className="py-12 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16 animate-fade-in">
              <div className="relative mb-8">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 via-purple-500/30 to-pink-500/30 rounded-full blur-xl animate-pulse"></div>
                <Badge className="relative mb-6 bg-gradient-to-r from-primary to-purple-600 hover:scale-110 transition-transform duration-300 text-lg px-6 py-3" variant="outline">
                  <Shield className="h-5 w-5 mr-3" />
                  Privacy Protection
                </Badge>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-scale-in">
                Privacy Policy
              </h1>
              <p className="text-muted-foreground text-xl animate-slide-in-right">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>

            {/* Introduction */}
            <Card className="mb-12 hover:shadow-2xl transition-all duration-500 animate-scale-in bg-gradient-to-br from-card/80 to-primary/5 backdrop-blur-sm border-border/50">
              <CardContent className="p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl">
                    <Lock className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground">Your Privacy Matters</h2>
                </div>
                <p className="text-muted-foreground text-xl leading-relaxed">
                  At Zyra, we are committed to protecting your privacy and ensuring the security of your personal information. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.
                </p>
              </CardContent>
            </Card>

            {/* Privacy Sections */}
            <div className="space-y-8">
              {sections.map((section, index) => (
                <Card 
                  key={index} 
                  className="group hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 animate-fade-in bg-card/60 backdrop-blur-sm border-border/50 overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="relative">
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${section.color} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
                    <div className="flex items-center gap-4 relative">
                      <div className={`p-3 rounded-2xl bg-gradient-to-br ${section.color} bg-opacity-20 group-hover:rotate-12 transition-transform duration-300`}>
                        <section.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {section.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="px-8 pb-8">
                    <div className="text-muted-foreground space-y-6">
                      <p className="leading-relaxed text-lg group-hover:text-foreground transition-colors duration-300">
                        {section.content}
                      </p>
                      {section.list && (
                        <ul className="list-disc pl-8 space-y-3">
                          {section.list.map((item, itemIndex) => (
                            <li 
                              key={itemIndex} 
                              className="hover:text-foreground transition-colors duration-200 text-lg leading-relaxed animate-slide-in-right"
                              style={{ animationDelay: `${itemIndex * 0.1}s` }}
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                      {section.additionalContent && (
                        <p className="text-lg font-medium text-primary mt-4 p-4 bg-primary/10 rounded-xl border border-primary/20">
                          {section.additionalContent}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contact CTA */}
            <Card className="mt-16 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 border-primary/30 hover:shadow-2xl transition-all duration-500 animate-bounce-in backdrop-blur-sm">
              <CardContent className="p-12 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 animate-pulse"></div>
                <div className="relative">
                  <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Questions About Your Privacy?
                  </h3>
                  <p className="text-muted-foreground mb-8 text-xl max-w-2xl mx-auto">
                    We're committed to transparency. If you have any questions about how we handle your data, don't hesitate to reach out.
                  </p>
                  <a 
                    href="/contact" 
                    className="inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-primary to-purple-600 text-primary-foreground rounded-2xl font-semibold text-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
                  >
                    <Shield className="h-5 w-5 mr-2" />
                    Contact Us
                  </a>
                </div>
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
