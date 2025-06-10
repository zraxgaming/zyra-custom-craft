import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scale, FileText, AlertTriangle, CheckCircle, XCircle, DollarSign, Truck, Shield, Mail, MapPin } from 'lucide-react';
import SEOHead from '@/components/seo/SEOHead';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-emerald-950/30 dark:via-blue-950/30 dark:to-purple-950/30">
      <SEOHead 
        title="Terms of Service - Zyra Custom Craft"
        description="Read the terms and conditions for using Zyra Custom Craft services and products."
        url="https://shopzyra.vercel.app/terms"
        keywords="terms, conditions, service, zyra, custom craft"
      />
      <Navbar />
      
      <div className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12 animate-fade-in">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-emerald-600 to-blue-600 rounded-2xl shadow-lg animate-pulse-glow">
                  <Scale className="h-8 w-8 text-white animate-float" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Terms of Service
                </h1>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Please read these terms carefully before using our services. By using Zyra Custom Craft, you agree to these terms.
              </p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Effective Date: January 2024</span>
              </div>
            </div>

            <div className="space-y-8">
              {/* Acceptance of Terms */}
              <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm animate-slide-in-up">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/50 dark:to-blue-950/50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-2xl text-emerald-700 dark:text-emerald-300">
                    <div className="p-2 bg-emerald-600 rounded-lg shadow-lg">
                      <CheckCircle className="h-5 w-5 text-white animate-pulse" />
                    </div>
                    Acceptance of Terms
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    By accessing and using Zyra Custom Craft's website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                      ✅ By placing an order, you confirm that you are at least 18 years old or have parental consent.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Services */}
              <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm animate-slide-in-up">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-2xl text-blue-700 dark:text-blue-300">
                    <div className="p-2 bg-blue-600 rounded-lg shadow-lg">
                      <FileText className="h-5 w-5 text-white animate-pulse" />
                    </div>
                    Our Services
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 animate-bounce" />
                        What We Provide
                      </h3>
                      <ul className="space-y-3 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1 animate-pulse" />
                          <span>Custom product design and manufacturing</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1 animate-pulse" />
                          <span>Digital product delivery and downloads</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1 animate-pulse" />
                          <span>Physical product shipping within UAE</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1 animate-pulse" />
                          <span>Customer support and order assistance</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-red-600 animate-bounce" />
                        Service Limitations
                      </h3>
                      <ul className="space-y-3 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <XCircle className="h-4 w-4 text-red-500 mt-1 animate-pulse" />
                          <span>International shipping not available</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <XCircle className="h-4 w-4 text-red-500 mt-1 animate-pulse" />
                          <span>Custom orders require approval</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <XCircle className="h-4 w-4 text-red-500 mt-1 animate-pulse" />
                          <span>Prohibited content will be rejected</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <XCircle className="h-4 w-4 text-red-500 mt-1 animate-pulse" />
                          <span>Refunds subject to policy terms</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment & Refund Policy */}
              <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm animate-slide-in-up">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-2xl text-purple-700 dark:text-purple-300">
                    <div className="p-2 bg-purple-600 rounded-lg shadow-lg">
                      <DollarSign className="h-5 w-5 text-white animate-pulse" />
                    </div>
                    Payment & Refund Policy
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 rounded-xl border border-green-200 dark:border-green-800 animate-scale-in">
                      <h4 className="font-semibold text-green-700 dark:text-green-300 mb-3 flex items-center gap-2">
                        <DollarSign className="h-4 w-4 animate-bounce" />
                        Payment Terms
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li>• Payment via Ziina only</li>
                        <li>• AED currency accepted</li>
                        <li>• Immediate payment required</li>
                        <li>• Gift cards available</li>
                      </ul>
                    </div>
                    
                    <div className="p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/30 rounded-xl border border-red-200 dark:border-red-800 animate-scale-in" style={{animationDelay: '200ms'}}>
                      <h4 className="font-semibold text-red-700 dark:text-red-300 mb-3 flex items-center gap-2">
                        <XCircle className="h-4 w-4 animate-bounce" />
                        No Refund Items
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li>• Custom designed products</li>
                        <li>• Digital downloads</li>
                        <li>• Personalized items</li>
                        <li>• Gift cards</li>
                      </ul>
                    </div>
                    
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-800 animate-scale-in" style={{animationDelay: '400ms'}}>
                      <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-3 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 animate-bounce" />
                        Refund Eligible
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li>• Defective products</li>
                        <li>• Wrong items shipped</li>
                        <li>• Damaged during shipping</li>
                        <li>• Order cancellation (24hrs)</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 animate-pulse" />
                      <div>
                        <h4 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-1">Important Notice</h4>
                        <p className="text-sm text-yellow-600 dark:text-yellow-400">
                          Most items are marked as "No Refund" due to their custom nature. Please review your order carefully before purchase.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping & Delivery */}
              <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm animate-slide-in-up">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-2xl text-orange-700 dark:text-orange-300">
                    <div className="p-2 bg-orange-600 rounded-lg shadow-lg">
                      <Truck className="h-5 w-5 text-white animate-pulse" />
                    </div>
                    Shipping & Delivery
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Physical Products</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1 animate-pulse" />
                          <span>Free shipping within UAE</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1 animate-pulse" />
                          <span>3-7 business days delivery</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1 animate-pulse" />
                          <span>Tracking number provided</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1 animate-pulse" />
                          <span>Signature required for delivery</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Digital Products</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1 animate-pulse" />
                          <span>Instant download after payment</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1 animate-pulse" />
                          <span>Available in user dashboard</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1 animate-pulse" />
                          <span>Lifetime access guaranteed</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1 animate-pulse" />
                          <span>Multiple download attempts allowed</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Liability & Disclaimers */}
              <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm animate-slide-in-up">
                <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/50 dark:to-pink-950/50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-2xl text-red-700 dark:text-red-300">
                    <div className="p-2 bg-red-600 rounded-lg shadow-lg">
                      <Shield className="h-5 w-5 text-white animate-pulse" />
                    </div>
                    Liability & Disclaimers
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="p-6 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                      <h4 className="font-semibold text-red-700 dark:text-red-300 mb-3">Limitation of Liability</h4>
                      <p className="text-sm text-muted-foreground">
                        Zyra Custom Craft shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
                        including without limitation, loss of profits, data, use, goodwill, or other intangible losses, 
                        resulting from your use of the service.
                      </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <h4 className="font-semibold mb-2">Product Quality</h4>
                        <p className="text-sm text-muted-foreground">
                          We strive for high-quality products but cannot guarantee perfection in custom items. 
                          Minor variations may occur.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <h4 className="font-semibold mb-2">Service Availability</h4>
                        <p className="text-sm text-muted-foreground">
                          Service interruptions may occur for maintenance. We are not liable for temporary unavailability.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 backdrop-blur-sm animate-bounce-in">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="h-6 w-6 text-indigo-600 animate-bounce" />
                    <h3 className="text-xl font-bold text-indigo-700 dark:text-indigo-300">
                      Questions About Terms?
                    </h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    If you have any questions about these Terms of Service, please don't hesitate to contact us:
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Badge variant="outline" className="bg-white/80 dark:bg-gray-800/80 border-indigo-200 dark:border-indigo-700 px-4 py-2 hover:scale-105 transition-transform duration-300">
                      <Mail className="h-4 w-4 mr-2 text-indigo-600" />
                      zainabusal113@gmail.com
                    </Badge>
                    <Badge variant="outline" className="bg-white/80 dark:bg-gray-800/80 border-purple-200 dark:border-purple-700 px-4 py-2 hover:scale-105 transition-transform duration-300">
                      <MapPin className="h-4 w-4 mr-2 text-purple-600" />
                      UAE, Dubai
                    </Badge>
                  </div>
                  
                  <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                    <p className="text-sm text-indigo-700 dark:text-indigo-300">
                      📝 These terms may be updated periodically. Continued use of our services constitutes acceptance of any changes.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </div>
      
      <Footer />
    </div>
  );
};

export default Terms;
