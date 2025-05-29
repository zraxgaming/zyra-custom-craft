
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import SEOHead from "@/components/seo/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Scale, ShoppingCart, RefreshCw, Shield, AlertCircle, Clock, CheckCircle, XCircle, Gavel, Users, CreditCard, Truck, Star, Award } from "lucide-react";

const Terms = () => {
  const sections = [
    {
      icon: <Scale className="h-6 w-6" />,
      title: "Acceptance of Terms",
      gradient: "from-blue-500 to-cyan-500",
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
      gradient: "from-purple-500 to-pink-500",
      content: [
        "All product descriptions and prices are subject to change without notice",
        "Custom orders require detailed specifications and may take 5-14 business days",
        "We reserve the right to refuse or cancel orders that violate our policies",
        "Product images are for illustration; actual items may vary slightly",
        "Special orders and customizations are non-returnable unless defective"
      ]
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Payment Terms",
      gradient: "from-green-500 to-emerald-500",
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
      gradient: "from-red-500 to-orange-500",
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
      gradient: "from-indigo-500 to-blue-500",
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
      gradient: "from-yellow-500 to-amber-500",
      content: [
        "Our liability is limited to the purchase price of the affected product",
        "We are not responsible for indirect, incidental, or consequential damages",
        "Force majeure events may delay or prevent order fulfillment",
        "Users assume responsibility for proper care and use of products",
        "These limitations apply to the fullest extent permitted by law"
      ]
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Shipping & Delivery",
      gradient: "from-teal-500 to-cyan-500",
      content: [
        "Shipping times are estimates and may vary due to external factors",
        "Free shipping available on orders above minimum threshold",
        "International shipping subject to customs duties and taxes",
        "Risk of loss passes to customer upon delivery to carrier",
        "Address accuracy is customer's responsibility for successful delivery"
      ]
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "User Accounts",
      gradient: "from-pink-500 to-rose-500",
      content: [
        "Users are responsible for maintaining account security and confidentiality",
        "Account sharing or transfer to third parties is prohibited",
        "We reserve the right to suspend accounts for policy violations",
        "Inactive accounts may be deleted after extended periods",
        "Users must provide accurate and current information"
      ]
    }
  ];

  const highlights = [
    { icon: <Award className="h-5 w-5" />, text: "Premium Quality", color: "text-gold-500" },
    { icon: <CheckCircle className="h-5 w-5" />, text: "Satisfaction Guaranteed", color: "text-green-500" },
    { icon: <Shield className="h-5 w-5" />, text: "Secure Transactions", color: "text-blue-500" },
    { icon: <Star className="h-5 w-5" />, text: "Rated #1 Custom Craft", color: "text-purple-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-green-900/20 dark:to-blue-900/20">
      <SEOHead 
        title="Terms & Conditions - Zyra Custom Craft | Legal Terms & Policies"
        description="Read the comprehensive terms and conditions for using Zyra Custom Craft services. Understanding our policies ensures a smooth experience for all customers."
        url="https://shopzyra.vercel.app/terms"
        keywords="terms and conditions, legal terms, policies, user agreement, Zyra Custom Craft, UAE"
      />
      
      <Navbar />
      
      <Container className="py-20">
        <div className="max-w-6xl mx-auto animate-fade-in">
          {/* Header */}
          <div className="text-center mb-20 animate-bounce-in">
            <div className="relative inline-flex items-center justify-center w-24 h-24 mb-8 animate-pulse-glow">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 rounded-full animate-spin opacity-75"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center shadow-2xl">
                <FileText className="h-12 w-12 text-white animate-float" />
              </div>
            </div>
            
            <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-text-shimmer">
              Terms & Conditions
            </h1>
            
            <p className="text-2xl text-gray-600 dark:text-gray-300 animate-slide-in-up max-w-3xl mx-auto leading-relaxed">
              Please read these terms carefully before using our services. They govern your use of Zyra Custom Craft and protect both parties.
            </p>
            
            <div className="flex items-center justify-center gap-8 mt-10 animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center gap-2">
                <Clock className="h-6 w-6 text-green-500 animate-pulse" />
                <span className="text-lg text-gray-500 dark:text-gray-400 font-medium">Effective Date: December 2024</span>
              </div>
              <div className="flex items-center gap-2">
                <Gavel className="h-6 w-6 text-blue-500 animate-bounce" />
                <span className="text-lg text-gray-500 dark:text-gray-400 font-medium">Legally Binding</span>
              </div>
            </div>

            {/* Service Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 animate-scale-in" style={{animationDelay: '0.5s'}}>
              {highlights.map((highlight, index) => (
                <div 
                  key={index}
                  className="p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 transition-all duration-300 animate-bounce-in"
                  style={{animationDelay: `${0.6 + index * 0.1}s`}}
                >
                  <div className={`${highlight.color} mb-2 flex justify-center animate-float`}>
                    {highlight.icon}
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{highlight.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Introduction */}
          <Card className="mb-16 animate-scale-in bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border-2 border-green-200 dark:border-green-800 shadow-2xl overflow-hidden">
            <CardContent className="p-10">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/50 dark:to-blue-900/50 rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse-glow">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400 animate-float" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-6 text-green-800 dark:text-green-200 animate-text-shimmer">
                    Welcome to Zyra Custom Craft
                  </h2>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    These terms and conditions outline the rules and regulations for the use of Zyra Custom Craft's website and services. 
                    By accessing this website and placing orders, you agree to be bound by these terms and conditions.
                  </p>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    We are committed to providing exceptional service while maintaining fair and transparent business practices for all our customers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sections */}
          <div className="grid gap-10">
            {sections.map((section, index) => (
              <Card 
                key={index} 
                className="animate-slide-in-up hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-xl overflow-hidden group"
                style={{ animationDelay: `${index * 0.12}s` }}
              >
                <CardContent className="p-10">
                  <div className="flex items-start gap-8">
                    <div className={`w-20 h-20 bg-gradient-to-br ${section.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 animate-pulse-glow shadow-xl`}>
                      <div className="text-white animate-float">
                        {section.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-600 group-hover:to-blue-600 group-hover:bg-clip-text transition-all duration-300">
                        {section.title}
                      </h3>
                      <ul className="space-y-5">
                        {section.content.map((item, itemIndex) => (
                          <li 
                            key={itemIndex} 
                            className="flex items-start gap-4 text-gray-700 dark:text-gray-300 animate-fade-in hover:scale-105 transition-transform duration-300 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50"
                            style={{animationDelay: `${(index * 0.12) + (itemIndex * 0.06)}s`}}
                          >
                            <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mt-2 flex-shrink-0 animate-pulse shadow-lg"></div>
                            <span className="leading-relaxed text-lg group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
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
          <Card className="mt-20 animate-bounce-in bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-12 relative">
              <div className="absolute inset-0 bg-white/10 animate-shimmer"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20 animate-pulse"></div>
              <div className="relative z-10 text-center">
                <XCircle className="h-20 w-20 mx-auto mb-8 animate-wiggle" />
                <h3 className="text-4xl font-bold mb-8 animate-text-glow">
                  Important Legal Disclaimer ⚖️
                </h3>
                <p className="text-xl opacity-90 max-w-4xl mx-auto leading-relaxed mb-8">
                  By using our services, you acknowledge that you have read, understood, and agree to be bound by these terms and conditions. 
                  If you do not agree with any part of these terms, you must not use our website or services.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                  <div className="p-6 bg-white/20 rounded-xl animate-scale-in" style={{animationDelay: '0.1s'}}>
                    <Shield className="h-8 w-8 mx-auto mb-3 animate-float" />
                    <h4 className="font-bold text-lg mb-2">Legal Protection</h4>
                    <p className="text-sm opacity-90">Terms protect both parties</p>
                  </div>
                  <div className="p-6 bg-white/20 rounded-xl animate-scale-in" style={{animationDelay: '0.2s'}}>
                    <CheckCircle className="h-8 w-8 mx-auto mb-3 animate-bounce" />
                    <h4 className="font-bold text-lg mb-2">Fair Practices</h4>
                    <p className="text-sm opacity-90">Transparent business ethics</p>
                  </div>
                  <div className="p-6 bg-white/20 rounded-xl animate-scale-in" style={{animationDelay: '0.3s'}}>
                    <Gavel className="h-8 w-8 mx-auto mb-3 animate-wiggle" />
                    <h4 className="font-bold text-lg mb-2">Legal Compliance</h4>
                    <p className="text-sm opacity-90">UAE law governed</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact for Questions */}
          <div className="text-center mt-16 animate-fade-in" style={{animationDelay: '0.8s'}}>
            <h4 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">Questions About Our Terms?</h4>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              Our legal team is here to help clarify any questions you may have.
            </p>
            <div className="flex justify-center items-center gap-6">
              <a 
                href="mailto:legal@zyracustomcraft.com" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-blue-500/25 animate-pulse-glow"
              >
                <FileText className="h-5 w-5 animate-bounce" />
                legal@zyracustomcraft.com
              </a>
            </div>
          </div>
        </div>
      </Container>
      
      <Footer />
    </div>
  );
};

export default Terms;
