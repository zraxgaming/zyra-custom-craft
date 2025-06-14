
import React from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Scale, 
  ShoppingCart, 
  CreditCard, 
  Truck, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle,
  Info,
  Mail,
  Phone,
  Globe,
  Shield,
  Clock,
  MapPin,
  User,
  Package,
  Gavel
} from "lucide-react";

const Terms = () => {
  const sections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: Scale,
      color: "blue",
      content: [
        {
          title: "Agreement",
          items: [
            "By using our website, you agree to these terms and conditions",
            "These terms constitute a legally binding agreement",
            "If you disagree with any part, please do not use our services",
            "Your continued use indicates acceptance of any updates"
          ]
        },
        {
          title: "Modifications",
          items: [
            "We may update these terms at any time",
            "Changes will be posted on this page",
            "Continued use after changes constitutes acceptance",
            "Major changes will be highlighted and dated"
          ]
        }
      ]
    },
    {
      id: "products-services",
      title: "Products & Services",
      icon: Package,
      color: "green",
      content: [
        {
          title: "Product Information",
          items: [
            "We strive for accurate product descriptions",
            "Colors may vary due to monitor settings",
            "Custom products are made to order",
            "Digital products are delivered electronically"
          ]
        },
        {
          title: "Availability",
          items: [
            "Product availability is subject to change",
            "We reserve the right to discontinue products",
            "Stock levels are updated regularly but not guaranteed",
            "Custom orders may have extended lead times"
          ]
        }
      ]
    },
    {
      id: "ordering-payment",
      title: "Ordering & Payment",
      icon: CreditCard,
      color: "purple",
      content: [
        {
          title: "Order Process",
          items: [
            "Orders are subject to acceptance and availability",
            "We reserve the right to refuse or cancel orders",
            "Order confirmation will be sent via email",
            "Custom orders require design approval before production"
          ]
        },
        {
          title: "Payment Terms",
          items: [
            "Payment is required at time of order",
            "We accept payments through Ziina only",
            "All prices are in USD unless otherwise specified",
            "Payment processing is handled securely by Ziina"
          ]
        }
      ]
    },
    {
      id: "shipping-delivery",
      title: "Shipping & Delivery",
      icon: Truck,
      color: "orange",
      content: [
        {
          title: "Shipping Policy",
          items: [
            "We currently ship within the UAE only",
            "Shipping costs will be calculated at checkout",
            "Delivery times are estimates and not guaranteed",
            "Risk of loss passes to buyer upon delivery"
          ]
        },
        {
          title: "Digital Products",
          items: [
            "Digital products are delivered via download link",
            "Download links are sent to your email address",
            "Downloads are available immediately after payment",
            "Download links remain active permanently"
          ]
        }
      ]
    },
    {
      id: "returns-refunds",
      title: "Returns & Refunds",
      icon: RefreshCw,
      color: "red",
      content: [
        {
          title: "Return Policy",
          items: [
            "Most items are marked as 'No Refund' due to custom nature",
            "Defective items may be eligible for replacement",
            "Returns must be requested within 7 days of delivery",
            "Items must be in original condition for return"
          ]
        },
        {
          title: "Refund Process",
          items: [
            "Approved refunds will be processed within 5-10 business days",
            "Refunds will be issued to the original payment method",
            "Shipping costs are non-refundable",
            "Custom and personalized items are non-refundable"
          ]
        }
      ]
    },
    {
      id: "user-accounts",
      title: "User Accounts",
      icon: User,
      color: "indigo",
      content: [
        {
          title: "Account Responsibility",
          items: [
            "You are responsible for maintaining account security",
            "Provide accurate and complete information",
            "Notify us immediately of any unauthorized use",
            "You may not share your account with others"
          ]
        },
        {
          title: "Account Termination",
          items: [
            "We may terminate accounts for violation of terms",
            "You may close your account at any time",
            "Termination does not affect existing orders",
            "Some data may be retained for legal purposes"
          ]
        }
      ]
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property",
      icon: Shield,
      color: "teal",
      content: [
        {
          title: "Our Rights",
          items: [
            "All website content is owned by Zyra Custom Craft",
            "Product designs and descriptions are protected",
            "You may not copy or reproduce our content",
            "Trademarks and logos are protected intellectual property"
          ]
        },
        {
          title: "User Content",
          items: [
            "You retain rights to content you provide",
            "You grant us license to use content for service provision",
            "You are responsible for ensuring you have rights to content",
            "We may remove content that violates terms or laws"
          ]
        }
      ]
    },
    {
      id: "limitation-liability",
      title: "Limitation of Liability",
      icon: AlertTriangle,
      color: "amber",
      content: [
        {
          title: "Service Limitations",
          items: [
            "Services are provided 'as is' without warranties",
            "We do not guarantee uninterrupted service",
            "Technical issues may occasionally affect service",
            "We are not liable for indirect or consequential damages"
          ]
        },
        {
          title: "Maximum Liability",
          items: [
            "Our liability is limited to the amount paid for the product",
            "We are not liable for business losses or lost profits",
            "Some jurisdictions may not allow liability limitations",
            "These limitations apply to the fullest extent permitted by law"
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
      orange: "from-orange-500 to-orange-600 border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20",
      red: "from-red-500 to-red-600 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20",
      indigo: "from-indigo-500 to-indigo-600 border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/20",
      teal: "from-teal-500 to-teal-600 border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/20",
      amber: "from-amber-500 to-amber-600 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20"
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Terms of Service - Zyra Custom Craft</title>
        <meta name="description" content="Read the terms and conditions for using Zyra Custom Craft's services and products." />
      </Helmet>
      
      <Navbar />
      
      <div className="py-12 animate-fade-in">
        <Container>
          {/* Header Section */}
          <div className="text-center mb-12 animate-scale-in">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-lg animate-pulse-glow">
                <FileText className="h-12 w-12 text-white animate-float" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-text-shimmer">
              Terms of Service
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Please read these terms carefully before using our services. They outline your rights and responsibilities.
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
              <Badge variant="outline" className="px-4 py-2 animate-bounce-in" style={{animationDelay: '400ms'}}>
                <Gavel className="h-4 w-4 mr-2" />
                Legally Binding
              </Badge>
            </div>
          </div>

          {/* Quick Summary */}
          <Card className="mb-12 animate-slide-in-up border-primary/20 shadow-xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
                  <Info className="h-6 w-6 text-primary animate-pulse" />
                  Key Terms at a Glance
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800 animate-scale-in">
                  <ShoppingCart className="h-6 w-6 text-blue-600 mx-auto mb-2 animate-pulse" />
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 text-sm mb-1">Custom Orders</h3>
                  <p className="text-xs text-blue-600 dark:text-blue-400">Made to order, no refunds</p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-800 animate-scale-in" style={{animationDelay: '100ms'}}>
                  <CreditCard className="h-6 w-6 text-green-600 mx-auto mb-2 animate-pulse" />
                  <h3 className="font-semibold text-green-800 dark:text-green-200 text-sm mb-1">Payment</h3>
                  <p className="text-xs text-green-600 dark:text-green-400">Ziina payments only</p>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-xl border border-purple-200 dark:border-purple-800 animate-scale-in" style={{animationDelay: '200ms'}}>
                  <Truck className="h-6 w-6 text-purple-600 mx-auto mb-2 animate-pulse" />
                  <h3 className="font-semibold text-purple-800 dark:text-purple-200 text-sm mb-1">Shipping</h3>
                  <p className="text-xs text-purple-600 dark:text-purple-400">UAE delivery only</p>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-xl border border-orange-200 dark:border-orange-800 animate-scale-in" style={{animationDelay: '300ms'}}>
                  <RefreshCw className="h-6 w-6 text-orange-600 mx-auto mb-2 animate-pulse" />
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 text-sm mb-1">Returns</h3>
                  <p className="text-xs text-orange-600 dark:text-orange-400">7 days for defects only</p>
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
                Questions About These Terms?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                If you have any questions about these Terms of Service or need clarification on any point, 
                please contact our support team.
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
                <div className="flex items-center gap-2 p-3 bg-white/70 dark:bg-gray-800/70 rounded-xl backdrop-blur-sm border border-primary/20 animate-scale-in" style={{animationDelay: '200ms'}}>
                  <Globe className="h-4 w-4 text-primary animate-pulse" />
                  <span className="font-medium">UAE Based</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal Notice */}
          <Card className="mt-8 animate-fade-in bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 animate-pulse" />
                <div>
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Important Legal Notice</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    These terms are governed by UAE law. Any disputes will be resolved in UAE courts. 
                    By using our services, you agree to this jurisdiction and waive any objections to venue.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Container>
      </div>
      
      <Footer />
    </div>
  );
};

export default Terms;
