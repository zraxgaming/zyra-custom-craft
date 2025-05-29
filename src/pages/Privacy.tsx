
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import SEOHead from "@/components/seo/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Eye, Lock, Users, Mail, Phone, MapPin, Clock, AlertTriangle, CheckCircle, Star, Globe, Database, UserCheck, FileText, Zap } from "lucide-react";

const Privacy = () => {
  const sections = [
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Information We Collect",
      gradient: "from-blue-500 to-cyan-500",
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
      gradient: "from-purple-500 to-pink-500",
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
      gradient: "from-green-500 to-emerald-500",
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
      gradient: "from-red-500 to-orange-500",
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
      gradient: "from-indigo-500 to-blue-500",
      content: [
        "Access and review your personal information",
        "Request corrections to inaccurate data",
        "Delete your account and associated data",
        "Opt-out of marketing communications",
        "Download your data in a portable format"
      ]
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "International Transfers",
      gradient: "from-teal-500 to-cyan-500",
      content: [
        "Data may be transferred to countries with adequate protection",
        "We ensure appropriate safeguards for international transfers",
        "Compliance with local data protection regulations",
        "Regular review of transfer mechanisms and security",
        "Transparent disclosure of data processing locations"
      ]
    }
  ];

  const features = [
    { icon: <Database className="h-5 w-5" />, text: "Encrypted Storage", color: "text-blue-500" },
    { icon: <UserCheck className="h-5 w-5" />, text: "GDPR Compliant", color: "text-green-500" },
    { icon: <FileText className="h-5 w-5" />, text: "Regular Audits", color: "text-purple-500" },
    { icon: <Zap className="h-5 w-5" />, text: "Real-time Monitoring", color: "text-yellow-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <SEOHead 
        title="Privacy Policy - Zyra Custom Craft | Data Protection & Security"
        description="Learn how Zyra Custom Craft protects your privacy and handles your personal information. Our comprehensive privacy policy explains our data practices with transparency and security."
        url="https://shopzyra.vercel.app/privacy"
        keywords="privacy policy, data protection, GDPR, security, personal information, Zyra Custom Craft"
      />
      
      <Navbar />
      
      <Container className="py-20">
        <div className="max-w-6xl mx-auto animate-fade-in">
          {/* Header */}
          <div className="text-center mb-20 animate-bounce-in">
            <div className="relative inline-flex items-center justify-center w-24 h-24 mb-8 animate-pulse-glow">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-spin opacity-75"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                <Shield className="h-12 w-12 text-white animate-float" />
              </div>
            </div>
            
            <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-text-shimmer">
              Privacy Policy
            </h1>
            
            <p className="text-2xl text-gray-600 dark:text-gray-300 animate-slide-in-up max-w-3xl mx-auto leading-relaxed">
              Your privacy is our top priority. We're committed to protecting your data with industry-leading security measures and transparent practices.
            </p>
            
            <div className="flex items-center justify-center gap-8 mt-10 animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center gap-2">
                <Clock className="h-6 w-6 text-blue-500 animate-pulse" />
                <span className="text-lg text-gray-500 dark:text-gray-400 font-medium">Last updated: December 2024</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-6 w-6 text-yellow-500 animate-bounce" />
                <span className="text-lg text-gray-500 dark:text-gray-400 font-medium">GDPR Compliant</span>
              </div>
            </div>

            {/* Security Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 animate-scale-in" style={{animationDelay: '0.5s'}}>
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 transition-all duration-300 animate-bounce-in"
                  style={{animationDelay: `${0.6 + index * 0.1}s`}}
                >
                  <div className={`${feature.color} mb-2 flex justify-center animate-float`}>
                    {feature.icon}
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Introduction */}
          <Card className="mb-16 animate-scale-in bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-2 border-blue-200 dark:border-blue-800 shadow-2xl overflow-hidden">
            <CardContent className="p-10">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse-glow">
                  <AlertTriangle className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-float" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-6 text-blue-800 dark:text-blue-200 animate-text-shimmer">
                    Privacy & Data Protection Notice
                  </h2>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    At Zyra Custom Craft, we are committed to protecting your privacy and ensuring the security of your personal information. 
                    This comprehensive privacy policy applies to all services provided through our website and mobile applications.
                  </p>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    We handle your data with the utmost care, transparency, and in full compliance with international data protection regulations including GDPR, CCPA, and UAE data protection laws.
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
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <CardContent className="p-10">
                  <div className="flex items-start gap-8">
                    <div className={`w-20 h-20 bg-gradient-to-br ${section.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 animate-pulse-glow shadow-xl`}>
                      <div className="text-white animate-float">
                        {section.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                        {section.title}
                      </h3>
                      <ul className="space-y-5">
                        {section.content.map((item, itemIndex) => (
                          <li 
                            key={itemIndex} 
                            className="flex items-start gap-4 text-gray-700 dark:text-gray-300 animate-fade-in hover:scale-105 transition-transform duration-300 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50"
                            style={{animationDelay: `${(index * 0.15) + (itemIndex * 0.08)}s`}}
                          >
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2 flex-shrink-0 animate-pulse shadow-lg"></div>
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

          {/* Contact Section */}
          <Card className="mt-20 animate-bounce-in bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 text-white border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-12 relative">
              <div className="absolute inset-0 bg-white/10 animate-shimmer"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 animate-pulse"></div>
              <div className="relative z-10">
                <h3 className="text-4xl font-bold mb-8 text-center animate-text-glow">
                  Have Privacy Questions? We're Here to Help! 🛡️
                </h3>
                <p className="text-xl text-center mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
                  Our dedicated privacy team is available to address any concerns or questions about how we handle your data.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center animate-scale-in" style={{animationDelay: '0.1s'}}>
                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-float shadow-xl">
                      <Mail className="h-10 w-10 animate-bounce" />
                    </div>
                    <h4 className="font-bold text-xl mb-2">Email Support</h4>
                    <p className="text-lg opacity-90 mb-2">privacy@zyracustomcraft.com</p>
                    <p className="text-sm opacity-75">Response within 24 hours</p>
                  </div>
                  <div className="text-center animate-scale-in" style={{animationDelay: '0.2s'}}>
                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-float-reverse shadow-xl">
                      <Phone className="h-10 w-10 animate-wiggle" />
                    </div>
                    <h4 className="font-bold text-xl mb-2">Phone Support</h4>
                    <p className="text-lg opacity-90 mb-2">+971 50 123 4567</p>
                    <p className="text-sm opacity-75">9 AM - 6 PM UAE Time</p>
                  </div>
                  <div className="text-center animate-scale-in" style={{animationDelay: '0.3s'}}>
                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-float shadow-xl">
                      <MapPin className="h-10 w-10 animate-pulse" />
                    </div>
                    <h4 className="font-bold text-xl mb-2">Visit Our Office</h4>
                    <p className="text-lg opacity-90 mb-2">Dubai, UAE</p>
                    <p className="text-sm opacity-75">By appointment only</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trust Badges */}
          <div className="mt-16 text-center animate-fade-in" style={{animationDelay: '0.7s'}}>
            <h4 className="text-2xl font-bold mb-8 text-gray-800 dark:text-gray-200">Trusted & Certified</h4>
            <div className="flex justify-center items-center gap-8 flex-wrap">
              {['ISO 27001', 'SOC 2 Type II', 'GDPR Compliant', 'PCI DSS'].map((cert, index) => (
                <div 
                  key={index}
                  className="px-6 py-3 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-full border border-green-200 dark:border-green-700 animate-bounce-in hover:scale-110 transition-transform duration-300"
                  style={{animationDelay: `${0.8 + index * 0.1}s`}}
                >
                  <span className="font-semibold text-green-700 dark:text-green-300">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
      
      <Footer />
    </div>
  );
};

export default Privacy;
