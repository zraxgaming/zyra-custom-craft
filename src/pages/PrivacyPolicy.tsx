
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Eye, Lock, UserCheck, Database, Globe } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: <Database className="h-6 w-6" />,
      title: "Information We Collect",
      content: [
        "Personal information you provide when creating an account (name, email, address)",
        "Payment information (processed securely through our payment partners)",
        "Custom design files and text you upload for product customization",
        "Order history and communication preferences",
        "Website usage data and analytics (cookies, IP address, browser type)",
        "Customer service interactions and support tickets"
      ]
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: "How We Use Your Information",
      content: [
        "Process and fulfill your orders and customization requests",
        "Provide customer support and respond to your inquiries",
        "Send order confirmations, shipping updates, and account notifications",
        "Improve our products, services, and website functionality",
        "Personalize your shopping experience and product recommendations",
        "Prevent fraud and maintain security of our platform",
        "Comply with legal obligations and enforce our terms of service"
      ]
    },
    {
      icon: <UserCheck className="h-6 w-6" />,
      title: "Information Sharing",
      content: [
        "We do not sell, rent, or share your personal information with third parties for marketing purposes",
        "Trusted service providers who help us operate our business (payment processors, shipping companies)",
        "Legal authorities when required by law or to protect our rights",
        "Business partners only with your explicit consent",
        "Anonymous, aggregated data for analytics and improvement purposes"
      ]
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Data Security",
      content: [
        "All data is encrypted in transit and at rest using industry-standard protocols",
        "Secure payment processing through PCI-compliant payment providers",
        "Regular security audits and vulnerability assessments",
        "Access controls and authentication for our team members",
        "Automatic security updates and monitoring systems",
        "Secure backup and disaster recovery procedures"
      ]
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Your Rights",
      content: [
        "Access and download your personal data at any time",
        "Correct or update your account information",
        "Delete your account and associated data (subject to legal retention requirements)",
        "Opt out of marketing communications while keeping your account active",
        "Port your data to another service provider",
        "File complaints with data protection authorities in your jurisdiction"
      ]
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Cookies & Tracking",
      content: [
        "Essential cookies for website functionality and security",
        "Analytics cookies to understand how you use our website",
        "Preference cookies to remember your settings and choices",
        "Marketing cookies for personalized advertising (with your consent)",
        "You can control cookie preferences in your browser settings",
        "Some features may not work properly if cookies are disabled"
      ]
    }
  ];

  return (
    <>
      <SEOHead 
        title="Privacy Policy - Zyra"
        description="Learn how Zyra protects your privacy and handles your personal data. Our comprehensive privacy policy explains our data practices."
        keywords="privacy policy, data protection, personal information, cookies, GDPR"
        url="https://zyra.lovable.app/privacy"
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
                    <Shield className="h-10 w-10 text-primary animate-pulse" />
                  </div>
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 animate-scale-in">
                Privacy Policy
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed animate-slide-in-right">
                Your privacy is important to us. This policy explains how we collect, use, and protect 
                your personal information when you use Zyra's services.
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
                  <h2 className="text-3xl font-bold mb-6 text-foreground">Privacy Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-foreground">Our Commitment</h3>
                      <p className="text-muted-foreground">
                        We are committed to protecting your privacy and maintaining the security of your personal information. 
                        We only collect information necessary to provide our services and improve your experience.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-foreground">Your Control</h3>
                      <p className="text-muted-foreground">
                        You have full control over your personal data. You can access, update, or delete your information 
                        at any time through your account settings or by contacting our support team.
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

        {/* Contact Section */}
        <section className="py-16 bg-muted/30">
          <Container>
            <div className="max-w-4xl mx-auto">
              <Card className="bg-card/50 backdrop-blur-sm border border-border/50 animate-fade-in">
                <CardContent className="p-8 text-center">
                  <h2 className="text-3xl font-bold mb-4 text-foreground">Questions About Privacy?</h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    If you have any questions about this privacy policy or how we handle your data, 
                    please don't hesitate to contact us.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-2xl mx-auto mb-3 flex items-center justify-center">
                        <Shield className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">Data Protection Officer</h3>
                      <p className="text-sm text-muted-foreground">privacy@zyra.com</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-2xl mx-auto mb-3 flex items-center justify-center">
                        <Lock className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">Security Team</h3>
                      <p className="text-sm text-muted-foreground">security@zyra.com</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-2xl mx-auto mb-3 flex items-center justify-center">
                        <UserCheck className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">General Support</h3>
                      <p className="text-sm text-muted-foreground">support@zyra.com</p>
                    </div>
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

export default PrivacyPolicy;
