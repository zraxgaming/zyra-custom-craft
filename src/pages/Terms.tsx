
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollText, Shield, Scale, FileText } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

const Terms = () => {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      icon: Shield,
      content: "By accessing and using Zyra's services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "2. Use License",
      icon: FileText,
      content: "Permission is granted to temporarily use Zyra's services for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.",
      list: [
        "modify or copy the materials",
        "use the materials for any commercial purpose or for any public display",
        "attempt to reverse engineer any software contained on the website",
        "remove any copyright or other proprietary notations from the materials"
      ],
      color: "from-green-500 to-teal-500"
    },
    {
      title: "3. Product Orders and Payment",
      icon: Scale,
      content: "When you place an order with us, you agree to:",
      list: [
        "Provide accurate and complete information",
        "Pay all charges incurred by you or any users of your account",
        "Be responsible for any taxes that may be due",
        "Accept our order processing and fulfillment timelines"
      ],
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "4. Customization and Intellectual Property",
      icon: Shield,
      content: "You retain ownership of any intellectual property you provide for customization. However, you grant us a limited license to use, reproduce, and modify your content solely for the purpose of fulfilling your order. You represent that you have the right to use any content you provide.",
      color: "from-orange-500 to-red-500"
    },
    {
      title: "5. Returns and Refunds",
      icon: FileText,
      content: "Due to the customized nature of our products, returns are limited to cases of manufacturing defects or errors on our part. Standard returns for customized items are not accepted unless the product significantly differs from what was ordered.",
      color: "from-indigo-500 to-blue-500"
    },
    {
      title: "6. Limitation of Liability",
      icon: Scale,
      content: "In no event shall Zyra or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use materials on Zyra's website, even if Zyra or an authorized representative has been notified of the possibility of such damage.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      title: "7. Privacy Policy",
      icon: Shield,
      content: "Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our services. By using our services, you agree to the collection and use of information in accordance with our Privacy Policy.",
      color: "from-pink-500 to-red-500"
    },
    {
      title: "8. Changes to Terms",
      icon: FileText,
      content: "We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through our website. Your continued use of our services after such modifications constitutes acceptance of the updated terms.",
      color: "from-teal-500 to-green-500"
    },
    {
      title: "9. Contact Information",
      icon: Scale,
      content: "If you have any questions about these Terms of Service, please contact us at legal@zyra.com or through our contact page.",
      color: "from-violet-500 to-purple-500"
    }
  ];

  return (
    <>
      <SEOHead 
        title="Terms of Service - Zyra"
        description="Read our terms of service and understand your rights and responsibilities when using Zyra."
        url="https://zyra.lovable.app/terms"
      />
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-purple-500/10 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
          <div className="absolute top-10 right-10 w-80 h-80 bg-gradient-to-br from-primary to-purple-500 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <Container className="py-12 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16 animate-fade-in">
              <div className="relative mb-8">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 via-purple-500/30 to-pink-500/30 rounded-full blur-xl animate-pulse"></div>
                <Badge className="relative mb-6 bg-gradient-to-r from-primary to-purple-600 hover:scale-110 transition-transform duration-300 text-lg px-6 py-3" variant="outline">
                  <ScrollText className="h-5 w-5 mr-3" />
                  Legal Document
                </Badge>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-scale-in">
                Terms of Service
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
                    <ScrollText className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground">Welcome to Zyra</h2>
                </div>
                <p className="text-muted-foreground text-xl leading-relaxed">
                  These Terms of Service ("Terms") govern your use of Zyra's website and services. 
                  Please read these terms carefully before using our platform. By using our services, 
                  you agree to be bound by these terms.
                </p>
              </CardContent>
            </Card>

            {/* Terms Sections */}
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
                    Have Questions?
                  </h3>
                  <p className="text-muted-foreground mb-8 text-xl max-w-2xl mx-auto">
                    If you have any questions about these Terms of Service, we're here to help.
                  </p>
                  <a 
                    href="/contact" 
                    className="inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-primary to-purple-600 text-primary-foreground rounded-2xl font-semibold text-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
                  >
                    <Scale className="h-5 w-5 mr-2" />
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

export default Terms;
