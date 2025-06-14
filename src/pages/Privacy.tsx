
import React from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Eye, 
  Lock, 
  Database, 
  UserCheck, 
  Mail, 
  Phone, 
  Globe, 
  AlertTriangle,
  CheckCircle,
  Info,
  Heart,
  Smartphone,
  CreditCard,
  FileText,
  Clock,
  MapPin
} from "lucide-react";

const Privacy = () => {
  const sections = [
    {
      id: "information-collection",
      title: "Information We Collect",
      icon: Database,
      color: "blue",
      content: [
        {
          title: "Personal Information",
          items: [
            "Name, email address, and phone number",
            "Billing and shipping addresses",
            "Payment information (processed securely)",
            "Account preferences and settings"
          ]
        },
        {
          title: "Usage Information",
          items: [
            "Pages visited and time spent on our site",
            "Products viewed and purchased",
            "Device and browser information",
            "IP address and location data"
          ]
        }
      ]
    },
    {
      id: "information-use",
      title: "How We Use Your Information",
      icon: Eye,
      color: "green",
      content: [
        {
          title: "Service Provision",
          items: [
            "Process and fulfill your orders",
            "Provide customer support",
            "Send order confirmations and updates",
            "Manage your account and preferences"
          ]
        },
        {
          title: "Improvement & Communication",
          items: [
            "Improve our website and services",
            "Send promotional emails (with your consent)",
            "Analyze usage patterns and trends",
            "Prevent fraud and ensure security"
          ]
        }
      ]
    },
    {
      id: "information-sharing",
      title: "Information Sharing",
      icon: UserCheck,
      color: "purple",
      content: [
        {
          title: "We Never Sell Your Data",
          items: [
            "Your personal information is never sold to third parties",
            "We only share data as described in this policy",
            "All sharing is done with your consent or for service provision"
          ]
        },
        {
          title: "Limited Sharing With",
          items: [
            "Payment processors (Ziina) for transaction processing",
            "Shipping partners for order delivery",
            "Service providers who help operate our website",
            "Legal authorities when required by law"
          ]
        }
      ]
    },
    {
      id: "data-protection",
      title: "Data Protection & Security",
      icon: Lock,
      color: "red",
      content: [
        {
          title: "Security Measures",
          items: [
            "SSL encryption for all data transmission",
            "Secure payment processing through Ziina",
            "Regular security audits and updates",
            "Limited access to personal information"
          ]
        },
        {
          title: "Data Retention",
          items: [
            "Account data retained while account is active",
            "Order history kept for legal and business purposes",
            "Marketing data removed upon unsubscribe",
            "Data deleted upon account closure request"
          ]
        }
      ]
    },
    {
      id: "your-rights",
      title: "Your Privacy Rights",
      icon: Shield,
      color: "indigo",
      content: [
        {
          title: "Access & Control",
          items: [
            "Access your personal information",
            "Update or correct your data",
            "Delete your account and data",
            "Opt-out of marketing communications"
          ]
        },
        {
          title: "Data Portability",
          items: [
            "Export your account data",
            "Receive data in a portable format",
            "Transfer data to another service",
            "Request data correction or deletion"
          ]
        }
      ]
    },
    {
      id: "cookies",
      title: "Cookies & Tracking",
      icon: Globe,
      color: "orange",
      content: [
        {
          title: "Essential Cookies",
          items: [
            "Authentication and security",
            "Shopping cart functionality",
            "User preferences and settings",
            "Basic site functionality"
          ]
        },
        {
          title: "Analytics & Performance",
          items: [
            "Website usage statistics",
            "Performance monitoring",
            "Error tracking and debugging",
            "User experience improvements"
          ]
        }
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: string } = {
      blue: "from-blue-500 to-blue-600 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20",
      green: "from-green-500 to-green-600 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20",
      purple: "from-purple-500 to-purple-600 border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/20",
      red: "from-red-500 to-red-600 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20",
      indigo: "from-indigo-500 to-indigo-600 border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/20",
      orange: "from-orange-500 to-orange-600 border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20"
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Privacy Policy - Zyra Custom Craft</title>
        <meta name="description" content="Learn how Zyra Custom Craft protects your privacy and handles your personal information." />
      </Helmet>
      
      <Navbar />
      
      <div className="py-12 animate-fade-in">
        <Container>
          {/* Header Section */}
          <div className="text-center mb-12 animate-scale-in">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-lg animate-pulse-glow">
                <Shield className="h-12 w-12 text-white animate-float" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-text-shimmer">
              Privacy Policy
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
            </p>
            <div className="flex items-center justify-center gap-4 mt-6">
              <Badge variant="outline" className="px-4 py-2 animate-bounce-in">
                <Clock className="h-4 w-4 mr-2" />
                Last Updated: January 2024
              </Badge>
              <Badge variant="outline" className="px-4 py-2 animate-bounce-in" style={{animationDelay: '200ms'}}>
                <MapPin className="h-4 w-4 mr-2" />
                UAE Jurisdiction
              </Badge>
            </div>
          </div>

          {/* Quick Summary */}
          <Card className="mb-12 animate-slide-in-up border-primary/20 shadow-xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
                  <Info className="h-6 w-6 text-primary animate-pulse" />
                  Privacy at a Glance
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-800 animate-scale-in">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-3 animate-pulse" />
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">We Never Sell Your Data</h3>
                  <p className="text-sm text-green-600 dark:text-green-400">Your personal information is never sold to third parties</p>
                </div>
                <div className="text-center p-6 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800 animate-scale-in" style={{animationDelay: '100ms'}}>
                  <Lock className="h-8 w-8 text-blue-600 mx-auto mb-3 animate-pulse" />
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Secure & Encrypted</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400">All data is protected with industry-standard encryption</p>
                </div>
                <div className="text-center p-6 bg-purple-50 dark:bg-purple-950/20 rounded-xl border border-purple-200 dark:border-purple-800 animate-scale-in" style={{animationDelay: '200ms'}}>
                  <Heart className="h-8 w-8 text-purple-600 mx-auto mb-3 animate-pulse" />
                  <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">You Have Control</h3>
                  <p className="text-sm text-purple-600 dark:text-purple-400">Access, update, or delete your data anytime</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <Card 
                key={section.id} 
                className={`animate-slide-in-up hover:shadow-xl transition-all duration-500 border-2 ${getColorClasses(section.color)}`}
                style={{animationDelay: `${index * 150}ms`}}
              >
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-3 bg-gradient-to-br ${getColorClasses(section.color)} rounded-xl shadow-lg animate-pulse-glow`}>
                      <section.icon className="h-6 w-6 text-white animate-float" />
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent animate-text-shimmer">
                      {section.title}
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {section.content.map((subsection, subIndex) => (
                      <div 
                        key={subIndex} 
                        className="animate-fade-in"
                        style={{animationDelay: `${(index * 150) + (subIndex * 100)}ms`}}
                      >
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                          {subsection.title}
                        </h3>
                        <ul className="space-y-3">
                          {subsection.items.map((item, itemIndex) => (
                            <li 
                              key={itemIndex} 
                              className="flex items-start gap-3 text-muted-foreground animate-slide-in-right hover:text-foreground transition-colors"
                              style={{animationDelay: `${(index * 150) + (subIndex * 100) + (itemIndex * 50)}ms`}}
                            >
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0 animate-pulse" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Section */}
          <Card className="mt-12 animate-bounce-in bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 border-primary/20 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-primary to-purple-600 rounded-2xl shadow-lg animate-pulse-glow">
                  <Mail className="h-8 w-8 text-white animate-float" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent animate-text-shimmer">
                Questions About Your Privacy?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                If you have any questions about this Privacy Policy or how we handle your personal information, 
                please don't hesitate to contact us.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="flex items-center gap-2 p-3 bg-white/70 dark:bg-gray-800/70 rounded-xl backdrop-blur-sm border border-primary/20 animate-scale-in">
                  <Mail className="h-4 w-4 text-primary animate-pulse" />
                  <span className="font-medium">zainabusal113@gmail.com</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-white/70 dark:bg-gray-800/70 rounded-xl backdrop-blur-sm border border-primary/20 animate-scale-in" style={{animationDelay: '100ms'}}>
                  <Phone className="h-4 w-4 text-primary animate-pulse" />
                  <span className="font-medium">Support Available 24/7</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="animate-slide-in-left bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Smartphone className="h-8 w-8 text-blue-600 mx-auto mb-3 animate-bounce" />
                <h3 className="font-semibold mb-2">Mobile App</h3>
                <p className="text-sm text-muted-foreground">This policy applies to our mobile app as well</p>
              </CardContent>
            </Card>
            
            <Card className="animate-scale-in bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <CreditCard className="h-8 w-8 text-green-600 mx-auto mb-3 animate-bounce" />
                <h3 className="font-semibold mb-2">Payment Security</h3>
                <p className="text-sm text-muted-foreground">Powered by Ziina's secure payment processing</p>
              </CardContent>
            </Card>
            
            <Card className="animate-slide-in-right bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <FileText className="h-8 w-8 text-purple-600 mx-auto mb-3 animate-bounce" />
                <h3 className="font-semibold mb-2">Regular Updates</h3>
                <p className="text-sm text-muted-foreground">We update this policy as needed to reflect changes</p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </div>
      
      <Footer />
    </div>
  );
};

export default Privacy;
