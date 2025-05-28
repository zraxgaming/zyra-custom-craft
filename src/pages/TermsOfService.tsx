
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { Container } from "@/components/ui/container";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Terms of Service - Zyra Custom Craft"
        description="Read our terms of service for Zyra Custom Craft. Learn about our policies, user responsibilities, and service conditions."
        url="https://shopzyra.vercel.app/terms"
      />
      <Navbar />
      
      <div className="py-12">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
            
            <div className="space-y-8 text-gray-700 dark:text-gray-300">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Acceptance of Terms</h2>
                <p>
                  By accessing and using Zyra Custom Craft's website and services, you accept and agree to be bound by the terms and provision of this agreement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Services</h2>
                <p>
                  Zyra Custom Craft provides personalized craft and gift services, including but not limited to custom printing, engraving, and design services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">3. User Responsibilities</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate and complete information when placing orders</li>
                  <li>Ensure uploaded content does not violate copyright or trademark laws</li>
                  <li>Use our services in compliance with applicable laws and regulations</li>
                  <li>Respect intellectual property rights of others</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Orders and Payment</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All orders are subject to acceptance and availability</li>
                  <li>Prices are subject to change without notice</li>
                  <li>Payment must be received before production begins</li>
                  <li>Custom orders may have longer processing times</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Intellectual Property</h2>
                <p>
                  You retain ownership of your original content. By uploading content, you grant us a license to use it for the purpose of fulfilling your order.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Limitation of Liability</h2>
                <p>
                  Our liability is limited to the cost of the product or service ordered. We are not liable for indirect, incidental, or consequential damages.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Contact Information</h2>
                <p>
                  For questions about these Terms of Service, please contact us at:
                </p>
                <ul className="list-none pl-6 space-y-1 mt-2">
                  <li>Email: support@zyracustomcraft.com</li>
                  <li>Phone: +971 XX XXX XXXX</li>
                </ul>
              </section>
            </div>
          </div>
        </Container>
      </div>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;
