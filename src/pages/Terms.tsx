
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ShoppingCart, CreditCard, Truck, RotateCcw, AlertTriangle } from 'lucide-react';
import SEOHead from '@/components/seo/SEOHead';

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Terms of Service - Zyra Custom Craft"
        description="Read our terms of service to understand the rules and guidelines for using Zyra Custom Craft's platform and services."
      />
      <Navbar />
      
      <div className="py-12 animate-fade-in">
        <Container>
          <div className="text-center mb-12 animate-scale-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Terms of Service
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Please read these terms carefully before using our services. By using Zyra Custom Craft, you agree to these terms.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Last updated: December 2024
            </p>
          </div>

          <div className="grid gap-8 max-w-4xl mx-auto">
            <Card className="animate-slide-in-up hover:shadow-lg transition-all duration-300" style={{animationDelay: '100ms'}}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary" />
                  Acceptance of Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  By accessing and using Zyra Custom Craft's website and services, you accept and agree to be bound by 
                  the terms and provision of this agreement.
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>You must be at least 18 years old to use our services</li>
                  <li>You are responsible for maintaining the confidentiality of your account</li>
                  <li>You agree to provide accurate and complete information</li>
                  <li>You will not use our service for any unlawful purposes</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="animate-slide-in-up hover:shadow-lg transition-all duration-300" style={{animationDelay: '200ms'}}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                  Products & Orders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Product Information</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>We strive to display accurate product information and images</li>
                    <li>Colors may vary slightly due to monitor differences</li>
                    <li>Custom products are made to order and may take additional time</li>
                    <li>We reserve the right to limit quantities and discontinue products</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Order Processing</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Orders are processed within 1-2 business days</li>
                    <li>Custom orders require additional processing time</li>
                    <li>We will notify you of any delays or issues</li>
                    <li>Order confirmation does not guarantee availability</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-slide-in-up hover:shadow-lg transition-all duration-300" style={{animationDelay: '300ms'}}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <CreditCard className="h-6 w-6 text-primary" />
                  Payment Terms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>All prices are in UAE Dirhams (AED) unless otherwise stated</li>
                  <li>Payment is required at the time of purchase</li>
                  <li>We accept major credit cards and secure payment methods</li>
                  <li>Failed payments may result in order cancellation</li>
                  <li>Promotional codes cannot be combined unless specified</li>
                  <li>Prices are subject to change without notice</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="animate-slide-in-up hover:shadow-lg transition-all duration-300" style={{animationDelay: '400ms'}}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Truck className="h-6 w-6 text-primary" />
                  Shipping & Delivery
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Shipping Policy</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Free shipping on orders over AED 200 within UAE</li>
                    <li>Standard delivery takes 3-5 business days</li>
                    <li>Express delivery available for additional cost</li>
                    <li>International shipping rates apply for overseas orders</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Delivery</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Delivery times are estimates and not guaranteed</li>
                    <li>Someone must be available to receive the package</li>
                    <li>Delivery attempts will be made during business hours</li>
                    <li>Additional charges may apply for failed delivery attempts</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-slide-in-up hover:shadow-lg transition-all duration-300" style={{animationDelay: '500ms'}}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <RotateCcw className="h-6 w-6 text-primary" />
                  Returns & Refunds
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Return Policy</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Returns accepted within 30 days of delivery</li>
                    <li>Items must be in original condition with tags attached</li>
                    <li>Custom/personalized items cannot be returned unless defective</li>
                    <li>Return shipping costs are customer's responsibility</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Refund Process</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Refunds processed within 5-7 business days after receiving return</li>
                    <li>Original payment method will be credited</li>
                    <li>Shipping costs are non-refundable unless item is defective</li>
                    <li>Partial refunds may apply for used or damaged items</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-slide-in-up hover:shadow-lg transition-all duration-300" style={{animationDelay: '600ms'}}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-primary" />
                  Limitations & Liability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <strong>Service Availability:</strong> We do not guarantee that our service will be uninterrupted, 
                    secure, or error-free. We reserve the right to modify or discontinue services at any time.
                  </p>
                  <p>
                    <strong>Limitation of Liability:</strong> Our liability is limited to the purchase price of the 
                    products. We are not liable for indirect, incidental, or consequential damages.
                  </p>
                  <p>
                    <strong>Intellectual Property:</strong> All content on our website is protected by copyright and 
                    other intellectual property laws. You may not reproduce or distribute our content without permission.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="text-center animate-fade-in">
              <div className="bg-primary/5 rounded-lg p-6 border border-primary/10">
                <h3 className="font-semibold mb-2">Contact Information</h3>
                <p className="text-muted-foreground text-sm mb-2">
                  For questions about these Terms of Service, please contact us:
                </p>
                <p className="text-sm">
                  <strong>Email:</strong> legal@zyracustomcraft.com<br />
                  <strong>Address:</strong> 123 Craft Street, Dubai, UAE<br />
                  <strong>Phone:</strong> +971 XX XXX XXXX
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>
      
      <Footer />
    </div>
  );
};

export default Terms;
