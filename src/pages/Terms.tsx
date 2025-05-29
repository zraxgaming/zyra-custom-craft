
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import SEOHead from "@/components/seo/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Scale, ShoppingCart, RefreshCw, Shield, AlertCircle, Clock, CheckCircle, XCircle } from "lucide-react";

const Terms = () => {
  const sections = [
    {
      icon: <Scale className="h-6 w-6" />,
      title: "Acceptance of Terms",
      content: [
        "By accessing and using Zyra Custom Craft, you accept these terms and conditions",
        "These terms apply to all visitors, users, and customers of our services",
        "We reserve the right to update these terms at any time with notice",
        "Continued use after changes constitutes acceptance of new terms",
        "If you disagree with any terms, please discontinue use immediately"
      ]
    },
    {
      icon: <ShoppingCart className="h-6 w-6" />,
      title: "Product Orders & Customization",
      content: [
        "All product descriptions and prices are subject to change without notice",
        "Custom orders require detailed specifications and may take 5-14 business days",
        "We reserve the right to refuse or cancel orders that violate our policies",
        "Product images are for illustration; actual items may vary slightly",
        "Special orders and customizations are non-returnable unless defective"
      ]
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Payment Terms",
      content: [
        "Payment is required in full before order processing begins",
        "We accept major credit cards, Ziina, and approved payment methods",
        "All prices are in AED (UAE Dirhams) unless otherwise specified",
        "Additional charges may apply for rush orders or premium materials",
        "Failed payments may result in order cancellation and account suspension"
      ]
    },
    {
      icon: <RefreshCw className="h-6 w-6" />,
      title: "Returns & Refunds",
      content: [
        "Standard products may be returned within 30 days in original condition",
        "Custom and personalized items are non-returnable unless defective",
        "Return shipping costs are the responsibility of the customer",
        "Refunds are processed within 5-10 business days after approval",
        "Gift cards and promotional credits are non-refundable"
      ]
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Intellectual Property",
      content: [
        "All website content, logos, and designs are proprietary to Zyra Custom Craft",
        "Users may not reproduce, distribute, or modify our content without permission",
        "Customer-provided designs remain the property of the customer",
        "We retain the right to showcase completed custom work for marketing",
        "Any trademark or copyright violations will result in immediate action"
      ]
    },
    {
      icon: <AlertCircle className="h-6 w-6" />,
      title: "Limitation of Liability",
      content: [
        "Our liability is limited to the purchase price of the affected product",
        "We are not responsible for indirect, incidental, or consequential damages",
        "Force majeure events may delay or prevent order fulfillment",
        "Users assume responsibility for proper care and use of products",
        "These limitations apply to the fullest extent permitted by law"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
      <SEOHead 
        title="Terms & Conditions - Zyra Custom Craft"
        description="Read the terms and conditions for using Zyra Custom Craft services. Understanding our policies helps ensure a smooth experience."
        url="https://shopzyra.vercel.app/terms"
      />
      
      <Navbar />
      
      <Container className="py-20">
        <div className="max-w-4xl mx-auto animate-fade-in">
          {/* Header */}
          <div className="text-center mb-16 animate-bounce-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-600 to-blue-600 rounded-full mb-8 animate-pulse-glow shadow-2xl">
              <FileText className="h-10 w-10 text-white animate-float" />
            </div>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-text-shimmer">
              Terms & Conditions
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 animate-slide-in-up">
              Please read these terms carefully before using our services. They govern your use of Zyra Custom Craft.
            </p>
            <div className="flex items-center justify-center gap-2 mt-6 animate-fade-in" style={{animationDelay: '0.3s'}}>
              <Clock className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Effective Date: December 2024</span>
            </div>
          </div>

          {/* Introduction */}
          <Card className="mb-12 animate-scale-in bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border-green-200 dark:border-green-800">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center flex-shrink-0 animate-float">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-green-800 dark:text-green-200">Welcome to Zyra Custom Craft</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    These terms and conditions outline the rules and regulations for the use of Zyra Custom Craft's website and services. 
                    By accessing this website and placing orders, you agree to be bound by these terms and conditions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <Card 
                key={index} 
                className="animate-slide-in-up hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-lg overflow-hidden group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/50 dark:to-blue-900/50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 animate-pulse-glow">
                      <div className="text-green-600 dark:text-green-400 animate-float">
                        {section.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                        {section.title}
                      </h3>
                      <ul className="space-y-4">
                        {section.content.map((item, itemIndex) => (
                          <li 
                            key={itemIndex} 
                            className="flex items-start gap-3 text-gray-700 dark:text-gray-300 animate-fade-in"
                            style={{animationDelay: `${(index * 0.1) + (itemIndex * 0.05)}s`}}
                          >
                            <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                            <span className="leading-relaxed group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Important Notice */}
          <Card className="mt-16 animate-bounce-in bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-8 relative">
              <div className="absolute inset-0 bg-white/10 animate-shimmer"></div>
              <div className="relative z-10 text-center">
                <XCircle className="h-16 w-16 mx-auto mb-6 animate-wiggle" />
                <h3 className="text-3xl font-bold mb-4 animate-text-glow">
                  Important Disclaimer
                </h3>
                <p className="text-lg opacity-90 max-w-2xl mx-auto leading-relaxed">
                  By using our services, you acknowledge that you have read, understood, and agree to be bound by these terms and conditions. 
                  If you do not agree with any part of these terms, you must not use our website or services.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact for Questions */}
          <div className="text-center mt-12 animate-fade-in" style={{animationDelay: '0.5s'}}>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Questions about our terms? Contact us at{' '}
              <a href="mailto:legal@zyra.com" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold underline">
                legal@zyra.com
              </a>
            </p>
          </div>
        </div>
      </Container>
      
      <Footer />
    </div>
  );
};

export default Terms;
