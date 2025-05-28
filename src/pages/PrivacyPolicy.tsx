
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { Container } from "@/components/ui/container";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Privacy Policy - Zyra Custom Craft"
        description="Learn how Zyra Custom Craft collects, uses, and protects your personal information. Read our comprehensive privacy policy."
        url="https://shopzyra.vercel.app/privacy"
      />
      <Navbar />
      
      <div className="py-12">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
            
            <div className="space-y-8 text-gray-700 dark:text-gray-300">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Information We Collect</h2>
                <p className="mb-4">We collect information you provide directly to us, such as:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Contact information (name, email, phone number)</li>
                  <li>Billing and shipping addresses</li>
                  <li>Payment information</li>
                  <li>Order history and preferences</li>
                  <li>Custom design uploads and specifications</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">2. How We Use Your Information</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Process and fulfill your orders</li>
                  <li>Communicate about your orders and our services</li>
                  <li>Provide customer support</li>
                  <li>Improve our products and services</li>
                  <li>Send promotional materials (with your consent)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Information Sharing</h2>
                <p className="mb-4">We do not sell or rent your personal information. We may share information:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>With service providers who assist in our operations</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights and property</li>
                  <li>With your consent</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Data Security</h2>
                <p>
                  We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Cookies and Tracking</h2>
                <p>
                  We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Your Rights</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Opt-out of marketing communications</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Contact Us</h2>
                <p>
                  If you have questions about this Privacy Policy, please contact us at:
                </p>
                <ul className="list-none pl-6 space-y-1 mt-2">
                  <li>Email: privacy@zyracustomcraft.com</li>
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

export default PrivacyPolicy;
