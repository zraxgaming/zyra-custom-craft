
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { FileText, Scale, AlertCircle, CheckCircle } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

const Terms = () => {
  return (
    <>
      <SEOHead 
        title="Terms of Service - Zyra"
        description="Read our terms of service and understand your rights and responsibilities when using Zyra."
        url="https://zyra.lovable.app/terms"
      />
      <Navbar />
      <div className="min-h-screen bg-background">
        {/* Premium Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="terms-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect x="20" y="20" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
                <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.4"/>
                <path d="M35,35 L65,65 M65,35 L35,65" stroke="currentColor" strokeWidth="0.2" opacity="0.2"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#terms-pattern)"/>
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
                    <FileText className="h-10 w-10 text-primary animate-pulse" />
                  </div>
                </div>
                <div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Terms of Service
                  </h1>
                  <p className="text-muted-foreground text-lg mt-2">
                    Please read these terms carefully before using our service
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-8">
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center gap-3 mb-6">
                  <Scale className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">Acceptance of Terms</h2>
                </div>
                <p className="text-muted-foreground">
                  By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
                </p>
              </div>

              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">Use License</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p>Permission is granted to temporarily download one copy of the materials on Zyra's website for personal, non-commercial transitory viewing only.</p>
                  <p>This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>modify or copy the materials</li>
                    <li>use the materials for any commercial purpose or for any public display</li>
                    <li>attempt to reverse engineer any software contained on the website</li>
                    <li>remove any copyright or other proprietary notations from the materials</li>
                  </ul>
                </div>
              </div>

              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center gap-3 mb-6">
                  <AlertCircle className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">Disclaimer</h2>
                </div>
                <p className="text-muted-foreground">
                  The materials on Zyra's website are provided on an 'as is' basis. Zyra makes no warranties, expressed or implied, 
                  and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions 
                  of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
              </div>

              <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 rounded-2xl p-8 animate-scale-in" style={{ animationDelay: '0.4s' }}>
                <h2 className="text-2xl font-bold text-foreground mb-4">Contact Information</h2>
                <p className="text-muted-foreground">
                  If you have any questions about these Terms of Service, please contact us at{' '}
                  <a href="mailto:legal@zyra.com" className="text-primary hover:underline font-medium">
                    legal@zyra.com
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

export default Terms;
