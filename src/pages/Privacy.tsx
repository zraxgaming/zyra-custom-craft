
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import SEOHead from "@/components/seo/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Eye, Lock, Users, Mail, Phone, MapPin, Clock, AlertTriangle, CheckCircle } from "lucide-react";

const Privacy = () => {
  const sections = [
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Information We Collect",
      content: [
        "Personal information you provide when creating an account or making purchases",
        "Payment and billing information for order processing",
        "Communication preferences and contact details",
        "Usage data and website interaction analytics",
        "Device information and technical specifications"
      ]
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "How We Use Your Information",
      content: [
        "Process and fulfill your orders and customization requests",
        "Provide customer support and respond to inquiries",
        "Send important updates about your orders and account",
        "Improve our products and services based on user feedback",
        "Comply with legal obligations and prevent fraud"
      ]
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Information Sharing",
      content: [
        "We never sell your personal information to third parties",
        "Trusted payment processors for secure transaction handling",
        "Shipping partners for order delivery purposes only",
        "Legal authorities when required by law or to protect rights",
        "Service providers who help us operate our platform securely"
      ]
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Data Security",
      content: [
        "Industry-standard encryption for all sensitive data",
        "Secure payment processing through verified providers",
        "Regular security audits and system updates",
        "Limited access controls for employee data handling",
        "Secure backup systems and data recovery procedures"
      ]
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Your Rights",
      content: [
        "Access and review your personal information",
        "Request corrections to inaccurate data",
        "Delete your account and associated data",
        "Opt-out of marketing communications",
        "Download your data in a portable format"
      ]
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Contact Us",
      content: [
        "Email us at privacy@zyracustomcraft.com for privacy concerns",
        "Call our support team during business hours",
        "Visit our physical location in Dubai, UAE",
        "Submit a privacy request through your account dashboard",
        "Follow up on any data protection inquiries"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
      <SEOHead 
        title="Privacy Policy - Zyra Custom Craft"
        description="Learn how Zyra Custom Craft protects your privacy and handles your personal information. Our comprehensive privacy policy explains our data practices."
        url="https://shopzyra.vercel.app/privacy"
      />
      
      <Navbar />
      
      <Container className="py-20">
        <div className="max-w-4xl mx-auto animate-fade-in">
          {/* Header */}
          <div className="text-center mb-16 animate-bounce-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-8 animate-pulse-glow shadow-2xl">
              <Shield className="h-10 w-10 text-white animate-float" />
            </div>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-text-shimmer">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 animate-slide-in-up">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <div className="flex items-center justify-center gap-2 mt-6 animate-fade-in" style={{animationDelay: '0.3s'}}>
              <Clock className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Last updated: December 2024</span>
            </div>
          </div>

          {/* Introduction */}
          <Card className="mb-12 animate-scale-in bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center flex-shrink-0 animate-float">
                  <AlertTriangle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-blue-800 dark:text-blue-200">Important Notice</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    At Zyra Custom Craft, we are committed to protecting your privacy and ensuring the security of your personal information. 
                    This privacy policy applies to all services provided through our website and describes how we handle your data with care and transparency.
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
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 animate-pulse-glow">
                      <div className="text-purple-600 dark:text-purple-400 animate-float">
                        {section.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                        {section.title}
                      </h3>
                      <ul className="space-y-4">
                        {section.content.map((item, itemIndex) => (
                          <li 
                            key={itemIndex} 
                            className="flex items-start gap-3 text-gray-700 dark:text-gray-300 animate-fade-in"
                            style={{animationDelay: `${(index * 0.1) + (itemIndex * 0.05)}s`}}
                          >
                            <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
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

          {/* Contact Section */}
          <Card className="mt-16 animate-bounce-in bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 text-white border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-8 relative">
              <div className="absolute inset-0 bg-white/10 animate-shimmer"></div>
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-6 text-center animate-text-glow">
                  Have Privacy Questions?
                </h3>
                <p className="text-xl text-center mb-8 opacity-90">
                  We're here to help with any privacy-related concerns or questions you may have.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center animate-scale-in" style={{animationDelay: '0.1s'}}>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                      <Mail className="h-8 w-8" />
                    </div>
                    <p className="font-semibold">Email Us</p>
                    <p className="text-sm opacity-80">privacy@zyra.com</p>
                  </div>
                  <div className="text-center animate-scale-in" style={{animationDelay: '0.2s'}}>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-float-reverse">
                      <Phone className="h-8 w-8" />
                    </div>
                    <p className="font-semibold">Call Us</p>
                    <p className="text-sm opacity-80">+971 50 123 4567</p>
                  </div>
                  <div className="text-center animate-scale-in" style={{animationDelay: '0.3s'}}>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                      <MapPin className="h-8 w-8" />
                    </div>
                    <p className="font-semibold">Visit Us</p>
                    <p className="text-sm opacity-80">Dubai, UAE</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
      
      <Footer />
    </div>
  );
};

export default Privacy;
