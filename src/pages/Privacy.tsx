
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Eye, Lock, Database, Mail, Phone, MapPin, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import SEOHead from '@/components/seo/SEOHead';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30">
      <SEOHead 
        title="Privacy Policy - Zyra Custom Craft"
        description="Learn about how Zyra Custom Craft protects your privacy and handles your personal information."
      />
      <Navbar />
      
      <div className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12 animate-fade-in">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg animate-pulse-glow">
                  <Shield className="h-8 w-8 text-white animate-float" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Privacy Policy
                </h1>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Your privacy is important to us. This policy explains how we collect, use, and protect your information.
              </p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Last updated: January 2024</span>
              </div>
            </div>

            <div className="space-y-8">
              {/* Information We Collect */}
              <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm animate-slide-in-up">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-2xl text-blue-700 dark:text-blue-300">
                    <div className="p-2 bg-blue-600 rounded-lg shadow-lg">
                      <Database className="h-5 w-5 text-white animate-pulse" />
                    </div>
                    Information We Collect
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Eye className="h-5 w-5 text-purple-600 animate-bounce" />
                        Personal Information
                      </h3>
                      <ul className="space-y-3 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1 animate-pulse" />
                          <span>Name and contact information</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1 animate-pulse" />
                          <span>Email address and phone number</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1 animate-pulse" />
                          <span>Shipping and billing addresses</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1 animate-pulse" />
                          <span>Account credentials and preferences</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Database className="h-5 w-5 text-blue-600 animate-bounce" />
                        Usage Information
                      </h3>
                      <ul className="space-y-3 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1 animate-pulse" />
                          <span>Device and browser information</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1 animate-pulse" />
                          <span>IP address and location data</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1 animate-pulse" />
                          <span>Website usage and navigation patterns</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1 animate-pulse" />
                          <span>Purchase history and preferences</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* How We Use Information */}
              <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm animate-slide-in-up">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-2xl text-purple-700 dark:text-purple-300">
                    <div className="p-2 bg-purple-600 rounded-lg shadow-lg">
                      <Lock className="h-5 w-5 text-white animate-pulse" />
                    </div>
                    How We Use Your Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-800 animate-scale-in">
                      <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-3 flex items-center gap-2">
                        <Mail className="h-4 w-4 animate-bounce" />
                        Service Delivery
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Process orders, manage accounts, provide customer support, and deliver personalized services.
                      </p>
                    </div>
                    
                    <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 rounded-xl border border-purple-200 dark:border-purple-800 animate-scale-in" style={{animationDelay: '200ms'}}>
                      <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-3 flex items-center gap-2">
                        <Phone className="h-4 w-4 animate-bounce" />
                        Communication
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Send order updates, promotional offers, newsletters, and respond to your inquiries.
                      </p>
                    </div>
                    
                    <div className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950/30 dark:to-pink-900/30 rounded-xl border border-pink-200 dark:border-pink-800 animate-scale-in" style={{animationDelay: '400ms'}}>
                      <h4 className="font-semibold text-pink-700 dark:text-pink-300 mb-3 flex items-center gap-2">
                        <MapPin className="h-4 w-4 animate-bounce" />
                        Improvement
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Analyze usage patterns, improve our services, and develop new features based on user feedback.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Protection */}
              <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm animate-slide-in-up">
                <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/50 dark:to-blue-950/50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-2xl text-green-700 dark:text-green-300">
                    <div className="p-2 bg-green-600 rounded-lg shadow-lg">
                      <Shield className="h-5 w-5 text-white animate-pulse" />
                    </div>
                    Data Protection & Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Security Measures</h3>
                        <ul className="space-y-2 text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <Lock className="h-3 w-3 mr-1" />
                              SSL Encryption
                            </Badge>
                          </li>
                          <li className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              <Shield className="h-3 w-3 mr-1" />
                              Secure Payment Processing
                            </Badge>
                          </li>
                          <li className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              <Database className="h-3 w-3 mr-1" />
                              Encrypted Data Storage
                            </Badge>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Your Rights</h3>
                        <ul className="space-y-2 text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-1 animate-pulse" />
                            <span>Access and review your personal data</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-1 animate-pulse" />
                            <span>Request corrections or updates</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-1 animate-pulse" />
                            <span>Delete your account and data</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-1 animate-pulse" />
                            <span>Opt-out of marketing communications</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 backdrop-blur-sm animate-bounce-in">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="h-6 w-6 text-orange-600 animate-bounce" />
                    <h3 className="text-xl font-bold text-orange-700 dark:text-orange-300">
                      Questions About Privacy?
                    </h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    If you have any questions about this Privacy Policy or how we handle your data, please contact us:
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Badge variant="outline" className="bg-white/80 dark:bg-gray-800/80 border-orange-200 dark:border-orange-700 px-4 py-2 hover:scale-105 transition-transform duration-300">
                      <Mail className="h-4 w-4 mr-2 text-orange-600" />
                      zainabusal113@gmail.com
                    </Badge>
                    <Badge variant="outline" className="bg-white/80 dark:bg-gray-800/80 border-blue-200 dark:border-blue-700 px-4 py-2 hover:scale-105 transition-transform duration-300">
                      <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                      UAE, Dubai
                    </Badge>
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

export default Privacy;
