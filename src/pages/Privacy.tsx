
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Separator } from "@/components/ui/separator";
import { Shield, Eye, Lock, Database, Users, Bell, Clock } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";

const Privacy = () => {
  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        "Personal Information: Name, email address, phone number, shipping and billing addresses when you create an account or place an order.",
        "Payment Information: Credit card details and billing information (processed securely through our payment providers).",
        "Usage Data: Information about how you interact with our website, including pages visited, time spent, and actions taken.",
        "Device Information: IP address, browser type, device type, and operating system for security and optimization purposes."
      ]
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: [
        "To process and fulfill your orders, including customization requests and shipping arrangements.",
        "To communicate with you about your orders, account updates, and customer service inquiries.",
        "To improve our website, products, and services based on your feedback and usage patterns.",
        "To send you marketing communications (with your consent) about new products, promotions, and company updates.",
        "To prevent fraud, ensure security, and comply with legal requirements."
      ]
    },
    {
      icon: Users,
      title: "Information Sharing",
      content: [
        "We do not sell, trade, or rent your personal information to third parties for marketing purposes.",
        "We may share information with trusted service providers who help us operate our business (shipping, payment processing, customer service).",
        "We may disclose information when required by law or to protect our rights, safety, or the rights of others.",
        "In the event of a business transfer, customer information may be transferred as part of the transaction."
      ]
    },
    {
      icon: Lock,
      title: "Data Security",
      content: [
        "We implement industry-standard security measures to protect your personal information.",
        "All payment transactions are encrypted using SSL technology and processed through secure payment gateways.",
        "We regularly monitor our systems for vulnerabilities and maintain strict access controls.",
        "While we strive to protect your information, no method of transmission over the internet is 100% secure."
      ]
    }
  ];

  return (
    <>
      <SEOHead 
        title="Privacy Policy - Zyra"
        description="Learn how Zyra protects your privacy and handles your personal information. Read our comprehensive privacy policy."
        url="https://shopzyra.vercel.app/privacy"
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
        <Navbar />
        
        {/* Hero Section */}
        <section className="pt-20 pb-16 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10">
          <Container>
            <div className="text-center mb-16 animate-fade-in">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-full mb-8 animate-bounce-in shadow-2xl">
                <Shield className="h-12 w-12 text-white animate-pulse" />
              </div>
              <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent animate-text-shimmer">
                Privacy Policy
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-slide-in-up" style={{animationDelay: '0.2s'}}>
                Your privacy is important to us. This policy explains how we collect, use, and protect your information.
              </p>
              <div className="flex items-center justify-center gap-2 mt-6 animate-fade-in" style={{animationDelay: '0.4s'}}>
                <Clock className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Last updated: January 2024</span>
              </div>
            </div>
          </Container>
        </section>

        <Container className="pb-20">
          {/* Introduction */}
          <Card className="mb-12 animate-scale-in border-purple-200/50 dark:border-purple-800/50 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-50 via-white to-pink-50 dark:from-purple-950/50 dark:via-gray-800 dark:to-pink-950/50">
              <CardTitle className="text-3xl text-gray-900 dark:text-white flex items-center gap-3">
                <Shield className="h-8 w-8 text-purple-600" />
                Our Commitment to Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-300">
                <p className="text-lg leading-relaxed mb-6">
                  At Zyra, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
                </p>
                <p className="text-lg leading-relaxed">
                  By using our website, you consent to the data practices described in this statement. If you do not agree with the practices described in this policy, please do not use our website.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <Card key={index} className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 animate-slide-in-up border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm" style={{animationDelay: `${index * 0.1}s`}}>
                <CardHeader className="bg-gradient-to-r from-gray-50 via-white to-purple-50/30 dark:from-gray-800/50 dark:via-gray-800 dark:to-purple-900/20">
                  <CardTitle className="text-2xl text-gray-900 dark:text-white flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                      <section.icon className="h-6 w-6 text-white" />
                    </div>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-4">
                    {section.content.map((paragraph, pIndex) => (
                      <div key={pIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-3 flex-shrink-0"></div>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                          {paragraph}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Separator className="my-12 bg-gradient-to-r from-transparent via-purple-200 to-transparent dark:via-purple-800" />

          {/* Additional Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="animate-scale-in border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                    <Bell className="h-5 w-5 text-white" />
                  </div>
                  Your Rights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-gray-600 dark:text-gray-300">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                    <span>Access and update your personal information</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                    <span>Request deletion of your data</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                    <span>Opt-out of marketing communications</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                    <span>Request data portability</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-scale-in border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm" style={{animationDelay: '0.1s'}}>
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Lock className="h-5 w-5 text-white" />
                  </div>
                  Cookies & Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-gray-600 dark:text-gray-300">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                    <span>Essential cookies for website functionality</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                    <span>Analytics cookies to improve our services</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                    <span>Marketing cookies (with your consent)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                    <span>You can manage cookie preferences</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <Card className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 border-0 shadow-2xl animate-scale-in text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4 animate-text-shimmer">
                Have Privacy Questions?
              </h3>
              <p className="text-lg mb-6 text-purple-100">
                If you have any questions about this Privacy Policy or our data practices, please contact us.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="font-semibold mb-1">Email</div>
                  <div className="text-purple-200">privacy@zyra.com</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold mb-1">Phone</div>
                  <div className="text-purple-200">+971 4 123 4567</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold mb-1">Address</div>
                  <div className="text-purple-200">Dubai, UAE</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Container>
        
        <Footer />
      </div>
    </>
  );
};

export default Privacy;
