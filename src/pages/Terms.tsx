
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Separator } from "@/components/ui/separator";
import { FileText, Shield, AlertCircle, Scale, Clock } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";

const Terms = () => {
  const sections = [
    {
      icon: FileText,
      title: "1. Agreement to Terms",
      content: [
        "By accessing and using Zyra's services, you accept and agree to be bound by these Terms of Service.",
        "If you do not agree to abide by the above, please do not use this service.",
        "These terms apply to all users of the site, including browsers, vendors, customers, merchants, and contributors."
      ]
    },
    {
      icon: Shield,
      title: "2. Use License",
      content: [
        "Permission is granted to temporarily download one copy of Zyra materials for personal, non-commercial transitory viewing only.",
        "This is the grant of a license, not a transfer of title, and under this license you may not:",
        "• Modify or copy the materials",
        "• Use the materials for commercial purposes or public display",
        "• Attempt to reverse engineer any software contained on Zyra's website"
      ]
    },
    {
      icon: AlertCircle,
      title: "3. Disclaimer",
      content: [
        "The materials on Zyra's website are provided on an 'as is' basis.",
        "Zyra makes no warranties, expressed or implied, and hereby disclaims all other warranties including implied warranties or conditions of merchantability.",
        "Further, Zyra does not warrant or make any representations concerning the accuracy or reliability of the use of materials on its website."
      ]
    },
    {
      icon: Scale,
      title: "4. Limitations",
      content: [
        "In no event shall Zyra or its suppliers be liable for any damages arising out of the use or inability to use materials on Zyra's website.",
        "Because some jurisdictions do not allow limitations on implied warranties or the exclusion of certain damages, these limitations may not apply to you.",
        "Maximum liability shall not exceed the amount paid for products or services."
      ]
    }
  ];

  return (
    <>
      <SEOHead 
        title="Terms of Service - Zyra"
        description="Read Zyra's Terms of Service. Understand your rights and responsibilities when using our premium customization platform."
        url="https://zyra.lovable.app/terms"
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
        <Navbar />
        
        {/* Hero Section */}
        <section className="pt-20 pb-16 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10">
          <Container>
            <div className="text-center mb-16 animate-fade-in">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-full mb-8 animate-bounce-in shadow-2xl">
                <Scale className="h-12 w-12 text-white animate-wiggle" />
              </div>
              <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent animate-text-shimmer">
                Terms of Service
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-slide-in-up" style={{animationDelay: '0.2s'}}>
                Please read these Terms of Service carefully before using our platform.
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
                <FileText className="h-8 w-8 text-purple-600" />
                Introduction
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-300">
                <p className="text-lg leading-relaxed mb-6">
                  Welcome to Zyra! These Terms of Service ("Terms", "Terms of Service") govern your use of our website located at zyra.lovable.app (the "Service") operated by Zyra ("us", "we", or "our").
                </p>
                <p className="text-lg leading-relaxed">
                  Our Privacy Policy also governs your use of the Service and explains how we collect, safeguard and disclose information that results from your use of our web pages.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Terms Sections */}
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
                      <p key={pIndex} className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Separator className="my-12 bg-gradient-to-r from-transparent via-purple-200 to-transparent dark:via-purple-800" />

          {/* Additional Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="animate-scale-in border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  Revisions and Errata
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  The materials appearing on Zyra's website could include technical, typographical, or photographic errors. Zyra does not warrant that any of the materials on its website are accurate, complete, or current.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-scale-in border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm" style={{animationDelay: '0.1s'}}>
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  Governing Law
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  These terms and conditions are governed by and construed in accordance with the laws of UAE and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <Card className="mt-12 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 border-0 shadow-2xl animate-scale-in text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4 animate-text-shimmer">
                Questions About Our Terms?
              </h3>
              <p className="text-lg mb-6 text-purple-100">
                If you have any questions about these Terms of Service, please contact us.
              </p>
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <div className="font-semibold">Email</div>
                  <div className="text-purple-200">legal@zyra.com</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">Phone</div>
                  <div className="text-purple-200">+971 4 123 4567</div>
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

export default Terms;
