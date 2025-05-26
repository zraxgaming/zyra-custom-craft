
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollText } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

const Terms = () => {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using Zyra's services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service."
    },
    {
      title: "2. Use License",
      content: "Permission is granted to temporarily use Zyra's services for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.",
      list: [
        "modify or copy the materials",
        "use the materials for any commercial purpose or for any public display",
        "attempt to reverse engineer any software contained on the website",
        "remove any copyright or other proprietary notations from the materials"
      ]
    },
    {
      title: "3. Product Orders and Payment",
      content: "When you place an order with us, you agree to:",
      list: [
        "Provide accurate and complete information",
        "Pay all charges incurred by you or any users of your account",
        "Be responsible for any taxes that may be due",
        "Accept our order processing and fulfillment timelines"
      ]
    },
    {
      title: "4. Customization and Intellectual Property",
      content: "You retain ownership of any intellectual property you provide for customization. However, you grant us a limited license to use, reproduce, and modify your content solely for the purpose of fulfilling your order. You represent that you have the right to use any content you provide."
    },
    {
      title: "5. Returns and Refunds",
      content: "Due to the customized nature of our products, returns are limited to cases of manufacturing defects or errors on our part. Standard returns for customized items are not accepted unless the product significantly differs from what was ordered."
    },
    {
      title: "6. Limitation of Liability",
      content: "In no event shall Zyra or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use materials on Zyra's website, even if Zyra or an authorized representative has been notified of the possibility of such damage."
    },
    {
      title: "7. Privacy Policy",
      content: "Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our services. By using our services, you agree to the collection and use of information in accordance with our Privacy Policy."
    },
    {
      title: "8. Changes to Terms",
      content: "We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through our website. Your continued use of our services after such modifications constitutes acceptance of the updated terms."
    },
    {
      title: "9. Contact Information",
      content: "If you have any questions about these Terms of Service, please contact us at legal@zyra.com or through our contact page."
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
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Container className="py-12">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12 animate-fade-in">
              <Badge className="mb-4 bg-gradient-to-r from-primary to-purple-600 hover:scale-110 transition-transform duration-300" variant="outline">
                <ScrollText className="h-4 w-4 mr-2" />
                Legal Document
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Terms of Service
              </h1>
              <p className="text-muted-foreground text-lg">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>

            {/* Introduction */}
            <Card className="mb-8 hover:shadow-lg transition-shadow duration-300 animate-scale-in">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4 text-foreground">Welcome to Zyra</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  These Terms of Service ("Terms") govern your use of Zyra's website and services. 
                  Please read these terms carefully before using our platform. By using our services, 
                  you agree to be bound by these terms.
                </p>
              </CardContent>
            </Card>

            {/* Terms Sections */}
            <div className="space-y-6">
              {sections.map((section, index) => (
                <Card 
                  key={index} 
                  className="hover:shadow-lg transition-shadow duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-foreground hover:text-primary transition-colors duration-200">
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-muted-foreground space-y-4">
                      <p className="leading-relaxed">{section.content}</p>
                      {section.list && (
                        <ul className="list-disc pl-6 space-y-2">
                          {section.list.map((item, itemIndex) => (
                            <li key={itemIndex} className="hover:text-foreground transition-colors duration-200">
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
            <Card className="mt-12 bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20 hover:shadow-xl transition-shadow duration-300 animate-bounce-in">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4 text-foreground">
                  Have Questions?
                </h3>
                <p className="text-muted-foreground mb-6 text-lg">
                  If you have any questions about these Terms of Service, we're here to help.
                </p>
                <a 
                  href="/contact" 
                  className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-primary to-purple-600 text-primary-foreground rounded-lg font-medium hover:scale-105 hover:shadow-lg transition-all duration-300"
                >
                  Contact Us
                </a>
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
