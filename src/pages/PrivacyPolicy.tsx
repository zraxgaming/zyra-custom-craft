
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Lock, UserCheck, Database, Globe } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: Eye,
      title: "Information We Collect",
      content: [
        "Personal information you provide when creating an account or making purchases",
        "Payment information processed securely through our payment partners",
        "Usage data and analytics to improve our services",
        "Communication preferences and customer support interactions",
        "Device information and browser data for security purposes"
      ]
    },
    {
      icon: Database,
      title: "How We Use Your Information",
      content: [
        "Process your orders and deliver customized products",
        "Provide customer support and respond to inquiries",
        "Send important updates about your orders and account",
        "Improve our products and services based on usage patterns",
        "Ensure security and prevent fraudulent activities"
      ]
    },
    {
      icon: Lock,
      title: "Data Protection",
      content: [
        "All data is encrypted in transit and at rest",
        "Regular security audits and penetration testing",
        "Access controls and authentication for all systems",
        "Compliance with GDPR, CCPA, and other privacy regulations",
        "Secure deletion of data when no longer needed"
      ]
    },
    {
      icon: Globe,
      title: "Information Sharing",
      content: [
        "We never sell your personal information to third parties",
        "Trusted service providers may process data on our behalf",
        "Legal requirements may necessitate disclosure to authorities",
        "Business transfers would include appropriate data protection",
        "You can opt out of marketing communications at any time"
      ]
    },
    {
      icon: UserCheck,
      title: "Your Rights",
      content: [
        "Access and download your personal data",
        "Correct or update inaccurate information",
        "Delete your account and associated data",
        "Opt out of marketing and promotional communications",
        "File complaints with relevant data protection authorities"
      ]
    }
  ];

  return (
    <>
      <SEOHead 
        title="Privacy Policy - Zyra"
        description="Learn how Zyra protects your privacy and handles your personal information. Transparent, secure, and compliant data practices."
        url="https://zyra.lovable.app/privacy-policy"
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
        <Navbar />
        
        {/* Hero Section */}
        <section className="py-20">
          <Container>
            <div className="text-center mb-16 animate-fade-in">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-in">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent animate-text-shimmer">
                Privacy Policy
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-slide-in-up" style={{animationDelay: '0.2s'}}>
                Your privacy is our priority. This policy explains how we collect, use, and protect your personal information.
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
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  At Zyra, we are committed to protecting your privacy and maintaining the security of your personal information. 
                  This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you visit our 
                  website, use our services, or make purchases from us. Please read this policy carefully to understand our 
                  practices regarding your personal data.
                </p>
              </CardContent>
            </Card>
          </Container>
        </section>

        {/* Policy Sections */}
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

        {/* Contact Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <Container>
            <div className="text-center max-w-4xl mx-auto animate-fade-in">
              <h2 className="text-4xl font-bold mb-6">
                Questions About Privacy?
              </h2>
              <p className="text-xl opacity-90 mb-8">
                If you have any questions about this Privacy Policy or our data practices, 
                please don't hesitate to contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contact" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Contact Our Privacy Team
                </a>
                <a 
                  href="mailto:privacy@zyra.com" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
                >
                  privacy@zyra.com
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

export default PrivacyPolicy;
