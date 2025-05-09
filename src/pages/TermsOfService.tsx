
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-zyra-soft-gray py-12">
        <div className="container mx-auto px-4">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-8">
              <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
              
              <div className="space-y-6">
                <section>
                  <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                  <p className="text-gray-700">
                    By accessing and using Zyra's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
                  <p className="text-gray-700">
                    Zyra provides a platform for designing and purchasing customized products. We offer various customization options and printing services for personal and commercial use.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
                  <p className="text-gray-700">
                    You may need to create an account to use certain features of our service. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">4. User Content</h2>
                  <p className="text-gray-700">
                    You retain ownership of any content you upload to our platform. However, by uploading content, you grant us a non-exclusive license to use, reproduce, and display that content in connection with providing our services.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">5. Prohibited Content</h2>
                  <p className="text-gray-700">
                    You may not upload content that is illegal, offensive, or infringes on intellectual property rights. We reserve the right to remove any content that violates these terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">6. Payment and Refunds</h2>
                  <p className="text-gray-700">
                    All prices are in USD unless otherwise specified. Payment must be received before production begins. Refunds may be issued according to our Refund Policy.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">7. Shipping and Delivery</h2>
                  <p className="text-gray-700">
                    Delivery times are estimates and not guarantees. We are not responsible for delays caused by shipping carriers or customs.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
                  <p className="text-gray-700">
                    We may modify these terms at any time. Your continued use of our services after such modifications constitutes acceptance of the updated terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
                  <p className="text-gray-700">
                    We reserve the right to terminate or suspend your account at our discretion, without notice, for conduct that we believe violates these terms or is harmful to others.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">10. Governing Law</h2>
                  <p className="text-gray-700">
                    These terms shall be governed by and construed in accordance with the laws of the jurisdiction where Zyra is registered, without regard to its conflict of law provisions.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">11. Contact</h2>
                  <p className="text-gray-700">
                    If you have any questions about these Terms, please contact us through our Contact page.
                  </p>
                </section>

                <p className="text-gray-500 mt-8">
                  Last Updated: May 9, 2025
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
