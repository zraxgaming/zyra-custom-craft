
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "@/components/seo/SEOHead";

const Privacy = () => {
  return (
    <>
      <SEOHead 
        title="Privacy Policy - Zyra"
        description="Learn how Zyra protects your privacy and handles your personal information."
        url="https://zyra.lovable.app/privacy"
      />
      <Navbar />
      <div className="min-h-screen bg-background">
        <Container className="py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
              <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>1. Information We Collect</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground space-y-2">
                    <p>We collect information you provide directly to us, such as:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Account information (name, email address, password)</li>
                      <li>Order information (shipping address, payment details)</li>
                      <li>Customization data (text, images, design preferences)</li>
                      <li>Communication data (customer service interactions)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>2. How We Use Your Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground space-y-2">
                    <p>We use the information we collect to:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Process and fulfill your orders</li>
                      <li>Communicate with you about your orders and our services</li>
                      <li>Improve our products and services</li>
                      <li>Send you marketing communications (with your consent)</li>
                      <li>Comply with legal obligations</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>3. Information Sharing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground space-y-2">
                    <p>We may share your information with:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Service providers who help us operate our business</li>
                      <li>Payment processors to handle transactions</li>
                      <li>Shipping companies to deliver your orders</li>
                      <li>Legal authorities when required by law</li>
                    </ul>
                    <p className="mt-2">We do not sell, trade, or rent your personal information to third parties.</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>4. Data Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We implement appropriate security measures to protect your personal information 
                    against unauthorized access, alteration, disclosure, or destruction. This includes 
                    encryption of sensitive data, secure servers, and regular security audits.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>5. Your Rights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground space-y-2">
                    <p>You have the right to:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Access your personal information</li>
                      <li>Correct inaccurate information</li>
                      <li>Delete your account and personal data</li>
                      <li>Opt out of marketing communications</li>
                      <li>Request data portability</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>6. Cookies and Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We use cookies and similar technologies to enhance your browsing experience, 
                    analyze site traffic, and understand where our visitors are coming from. 
                    You can control cookie settings through your browser preferences.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>7. Contact Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    If you have any questions about this Privacy Policy or our data practices, 
                    please contact us at privacy@zyra.com or through our contact page.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Privacy;
