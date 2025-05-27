
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, ShoppingCart, Shield, RefreshCw, AlertTriangle, Users } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

const TermsOfService = () => {
  const sections = [
    {
      icon: Users,
      title: "Account Terms",
      content: [
        "You must be 18 years or older to create an account",
        "Provide accurate and complete information during registration",
        "Maintain the security of your account credentials",
        "Notify us immediately of any unauthorized account access",
        "You are responsible for all activities under your account"
      ]
    },
    {
      icon: ShoppingCart,
      title: "Orders & Purchases",
      content: [
        "All orders are subject to acceptance and availability",
        "Prices are subject to change without notice",
        "Payment must be received before order processing begins",
        "Custom orders may have longer processing times",
        "Order modifications may not be possible once production starts"
      ]
    },
    {
      icon: RefreshCw,
      title: "Returns & Refunds",
      content: [
        "Standard products may be returned within 30 days",
        "Customized products are generally non-returnable",
        "Items must be in original condition for returns",
        "Refunds will be processed within 5-10 business days",
        "Return shipping costs may apply unless item is defective"
      ]
    },
    {
      icon: Shield,
      title: "Intellectual Property",
      content: [
        "All content on our website is protected by copyright",
        "You retain rights to your custom designs and uploads",
        "We may use order images for marketing with permission",
        "Respect third-party intellectual property rights",
        "Report any copyright infringement to our team"
      ]
    },
    {
      icon: AlertTriangle,
      title: "Prohibited Uses",
      content: [
        "No illegal, harmful, or offensive content in custom designs",
        "Respect trademark and copyright laws",
        "No harassment or abuse of our staff or systems",
        "No attempts to circumvent security measures",
        "No resale of products without written permission"
      ]
    }
  ];

  return (
    <>
      <SEOHead 
        title="Terms of Service - Zyra"
        description="Review Zyra's terms of service, including account terms, ordering policies, and user responsibilities."
        url="https://shopzyra.vercel.app/terms"
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
        <Navbar />
        
        {/* Hero Section */}
        <section className="py-20">
          <Container>
            <div className="text-center mb-16 animate-fade-in">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-in">
                <Scale className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent animate-text-shimmer">
                Terms of Service
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-slide-in-up" style={{animationDelay: '0.2s'}}>
                These terms govern your use of Zyra's services. By using our platform, you agree to these terms and conditions.
              </p>
              <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 animate-fade-in" style={{animationDelay: '0.4s'}}>
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>
          </Container>
        </section>

        {/* Introduction */}
        <section className="py-12">
          <Container>
            <Card className="mb-12 animate-scale-in border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl">
              <CardContent className="p-8">
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  Welcome to Zyra! These Terms of Service ("Terms") govern your access to and use of our website, 
                  products, and services. By accessing or using our services, you agree to be bound by these Terms. 
                  If you disagree with any part of these terms, you may not access our services.
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  We reserve the right to update these Terms at any time. Continued use of our services after 
                  changes constitutes acceptance of the new Terms.
                </p>
              </CardContent>
            </Card>
          </Container>
        </section>

        {/* Terms Sections */}
        <section className="py-12">
          <Container>
            <div className="space-y-8">
              {sections.map((section, index) => (
                <Card key={index} className="animate-slide-in-up border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500" style={{animationDelay: `${index * 0.1}s`}}>
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
                    <CardTitle className="flex items-center gap-4 text-2xl text-gray-900 dark:text-white">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                        <section.icon className="h-6 w-6 text-white" />
                      </div>
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <ul className="space-y-4">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="leading-relaxed">{item}</span>
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
        <section className="py-12">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="animate-slide-in-left border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
                  <CardTitle className="text-xl text-gray-900 dark:text-white">
                    Limitation of Liability
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Zyra shall not be liable for any indirect, incidental, special, consequential, 
                    or punitive damages, including loss of profits, data, or other intangible losses 
                    resulting from your use of our services.
                  </p>
                </CardContent>
              </Card>

              <Card className="animate-slide-in-right border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
                  <CardTitle className="text-xl text-gray-900 dark:text-white">
                    Governing Law
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    These Terms shall be governed by and construed in accordance with the laws of 
                    the jurisdiction where Zyra is headquartered, without regard to conflict of law principles.
                  </p>
                </CardContent>
              </Card>
            </div>
          </Container>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <Container>
            <div className="text-center max-w-4xl mx-auto animate-fade-in">
              <h2 className="text-4xl font-bold mb-6">
                Questions About These Terms?
              </h2>
              <p className="text-xl opacity-90 mb-8">
                If you have any questions about these Terms of Service, please contact our legal team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contact" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Contact Legal Team
                </a>
                <a 
                  href="mailto:legal@zyra.com" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
                >
                  legal@zyra.com
                </a>
              </div>
            </div>
          </Container>
        </section>
        
        <Footer />
      </div>
    </>
  );
};

export default TermsOfService;
