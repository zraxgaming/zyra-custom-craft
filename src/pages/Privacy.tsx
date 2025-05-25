
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Shield, Eye, Lock, UserCheck } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

const Privacy = () => {
  return (
    <>
      <SEOHead 
        title="Privacy Policy - Zyra"
        description="Learn how we protect and handle your personal information at Zyra."
        url="https://zyra.lovable.app/privacy"
      />
      <Navbar />
      <div className="min-h-screen bg-background">
        {/* Premium Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="privacy-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                <circle cx="60" cy="60" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
                <path d="M20,60 Q60,20 100,60 Q60,100 20,60" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.4"/>
                <circle cx="60" cy="60" r="8" fill="currentColor" opacity="0.2"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#privacy-pattern)"/>
          </svg>
        </div>

        <Container className="py-16 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12 animate-fade-in">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-primary/10 to-purple-500/10 p-4 rounded-2xl border border-primary/20 backdrop-blur-sm">
                    <Shield className="h-10 w-10 text-primary animate-pulse" />
                  </div>
                </div>
                <div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Privacy Policy
                  </h1>
                  <p className="text-muted-foreground text-lg mt-2">
                    Your privacy and data protection is our priority
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-8">
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center gap-3 mb-6">
                  <Eye className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">Information We Collect</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Personal information (name, email, phone number)</li>
                    <li>Payment information (processed securely by our payment partners)</li>
                    <li>Order history and preferences</li>
                    <li>Communication preferences</li>
                  </ul>
                </div>
              </div>

              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center gap-3 mb-6">
                  <Lock className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">How We Use Your Information</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p>We use the information we collect to provide, maintain, and improve our services:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Process and fulfill your orders</li>
                    <li>Send you important updates about your orders</li>
                    <li>Provide customer support</li>
                    <li>Improve our products and services</li>
                    <li>Send promotional communications (with your consent)</li>
                  </ul>
                </div>
              </div>

              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center gap-3 mb-6">
                  <UserCheck className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">Your Rights</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p>You have the right to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Access your personal information</li>
                    <li>Update or correct your information</li>
                    <li>Delete your account and data</li>
                    <li>Opt-out of marketing communications</li>
                    <li>Request a copy of your data</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 rounded-2xl p-8 animate-scale-in" style={{ animationDelay: '0.4s' }}>
                <h2 className="text-2xl font-bold text-foreground mb-4">Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have any questions about this Privacy Policy, please contact us at{' '}
                  <a href="mailto:privacy@zyra.com" className="text-primary hover:underline font-medium">
                    privacy@zyra.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Privacy;
