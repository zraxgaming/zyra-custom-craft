
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, Lock, UserCheck, FileText, Mail } from 'lucide-react';
import SEOHead from '@/components/seo/SEOHead';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Privacy Policy - Zyra Custom Craft"
        description="Read our comprehensive privacy policy to understand how we collect, use, and protect your personal information at Zyra Custom Craft."
      />
      <Navbar />
      
      <div className="py-12 animate-fade-in">
        <Container>
          <div className="text-center mb-12 animate-scale-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Last updated: December 2024
            </p>
          </div>

          <div className="grid gap-8 max-w-4xl mx-auto">
            <Card className="animate-slide-in-up hover:shadow-lg transition-all duration-300" style={{animationDelay: '100ms'}}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Eye className="h-6 w-6 text-primary" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Personal Information</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Name, email address, and contact information</li>
                    <li>Billing and shipping addresses</li>
                    <li>Payment information (processed securely through our payment partners)</li>
                    <li>Account preferences and settings</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Usage Information</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Pages visited and time spent on our website</li>
                    <li>Products viewed and purchased</li>
                    <li>Search queries and interactions</li>
                    <li>Device information and browser details</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-slide-in-up hover:shadow-lg transition-all duration-300" style={{animationDelay: '200ms'}}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <UserCheck className="h-6 w-6 text-primary" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Process and fulfill your orders</li>
                  <li>Provide customer support and respond to inquiries</li>
                  <li>Send order confirmations and shipping updates</li>
                  <li>Improve our products and services</li>
                  <li>Send promotional emails (with your consent)</li>
                  <li>Prevent fraud and ensure platform security</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="animate-slide-in-up hover:shadow-lg transition-all duration-300" style={{animationDelay: '300ms'}}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Lock className="h-6 w-6 text-primary" />
                  Data Protection & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We implement industry-standard security measures to protect your personal information:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>SSL encryption for all data transmission</li>
                  <li>Secure payment processing through trusted partners</li>
                  <li>Regular security audits and updates</li>
                  <li>Limited access to personal data on a need-to-know basis</li>
                  <li>Data backup and recovery procedures</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="animate-slide-in-up hover:shadow-lg transition-all duration-300" style={{animationDelay: '400ms'}}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary" />
                  Your Rights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Access & Control</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                      <li>Request a copy of your data</li>
                      <li>Update or correct your information</li>
                      <li>Delete your account and data</li>
                      <li>Opt out of marketing communications</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Data Portability</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                      <li>Export your data in a readable format</li>
                      <li>Transfer data to another service</li>
                      <li>Request data processing restrictions</li>
                      <li>Object to certain data processing</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-slide-in-up hover:shadow-lg transition-all duration-300" style={{animationDelay: '500ms'}}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Mail className="h-6 w-6 text-primary" />
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about this Privacy Policy or how we handle your data, please contact us:
                </p>
                <div className="space-y-2">
                  <p><strong>Email:</strong> privacy@zyracustomcraft.com</p>
                  <p><strong>Address:</strong> 123 Craft Street, Dubai, UAE</p>
                  <p><strong>Phone:</strong> +971 XX XXX XXXX</p>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  We will respond to your inquiry within 30 days.
                </p>
              </CardContent>
            </Card>

            <div className="text-center animate-fade-in">
              <div className="bg-primary/5 rounded-lg p-6 border border-primary/10">
                <h3 className="font-semibold mb-2">Policy Updates</h3>
                <p className="text-muted-foreground text-sm">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes 
                  by posting the new policy on this page and updating the "Last updated" date. Please review this 
                  policy periodically for any changes.
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

export default Privacy;
