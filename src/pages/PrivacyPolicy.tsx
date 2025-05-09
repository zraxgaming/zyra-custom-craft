
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-zyra-soft-gray py-12">
        <div className="container mx-auto px-4">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-8">
              <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
              
              <div className="space-y-6">
                <section>
                  <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                  <p className="text-gray-700">
                    At Zyra, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website and services.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
                  <p className="text-gray-700">
                    We may collect the following types of information:
                  </p>
                  <ul className="list-disc ml-6 mt-2 text-gray-700">
                    <li>Personal information such as your name, email address, shipping address, and payment information</li>
                    <li>Account information when you register</li>
                    <li>Order information related to purchases</li>
                    <li>User-generated content you upload to our platform</li>
                    <li>Usage data and cookies to improve our services</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
                  <p className="text-gray-700">
                    We use your information to:
                  </p>
                  <ul className="list-disc ml-6 mt-2 text-gray-700">
                    <li>Process and fulfill your orders</li>
                    <li>Provide customer support</li>
                    <li>Improve our products and services</li>
                    <li>Send you updates and promotional offers (with your consent)</li>
                    <li>Ensure security and prevent fraud</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">4. Data Sharing and Disclosure</h2>
                  <p className="text-gray-700">
                    We may share your information with:
                  </p>
                  <ul className="list-disc ml-6 mt-2 text-gray-700">
                    <li>Payment processors to complete transactions</li>
                    <li>Shipping partners to deliver your orders</li>
                    <li>Service providers who help us operate our business</li>
                    <li>Legal authorities when required by law</li>
                  </ul>
                  <p className="text-gray-700 mt-2">
                    We do not sell your personal information to third parties.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
                  <p className="text-gray-700">
                    We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
                  <p className="text-gray-700">
                    Depending on your location, you may have rights to:
                  </p>
                  <ul className="list-disc ml-6 mt-2 text-gray-700">
                    <li>Access your personal information</li>
                    <li>Correct inaccurate information</li>
                    <li>Delete your personal information</li>
                    <li>Object to or restrict processing</li>
                    <li>Data portability</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">7. Cookies</h2>
                  <p className="text-gray-700">
                    We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookies through your browser settings.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
                  <p className="text-gray-700">
                    Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">9. Changes to This Policy</h2>
                  <p className="text-gray-700">
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
                  <p className="text-gray-700">
                    If you have any questions about this Privacy Policy, please contact us through our Contact page.
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

export default PrivacyPolicy;
