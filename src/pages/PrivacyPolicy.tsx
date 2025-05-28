
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <Container className="py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <h2>Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.
            </p>

            <h2>How We Use Your Information</h2>
            <p>
              We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.
            </p>

            <h2>Information Sharing</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
            </p>

            <h2>Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h2>Cookies</h2>
            <p>
              We use cookies to enhance your experience on our website. You can choose to disable cookies through your browser settings.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at privacy@zyracustomcraft.com.
            </p>
          </div>
        </div>
      </Container>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
