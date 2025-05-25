
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <Container className="py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
              <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>1. Acceptance of Terms</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    By accessing and using Zyra's services, you accept and agree to be bound by the terms 
                    and provision of this agreement. If you do not agree to abide by the above, please do 
                    not use this service.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>2. Use License</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground space-y-2">
                    <p>Permission is granted to temporarily use Zyra's services for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>modify or copy the materials</li>
                      <li>use the materials for any commercial purpose or for any public display</li>
                      <li>attempt to reverse engineer any software contained on the website</li>
                      <li>remove any copyright or other proprietary notations from the materials</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>3. Product Orders and Payment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground space-y-2">
                    <p>When you place an order with us, you agree to:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Provide accurate and complete information</li>
                      <li>Pay all charges incurred by you or any users of your account</li>
                      <li>Be responsible for any taxes that may be due</li>
                      <li>Accept our order processing and fulfillment timelines</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>4. Customization and Intellectual Property</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    You retain ownership of any intellectual property you provide for customization. 
                    However, you grant us a limited license to use, reproduce, and modify your content 
                    solely for the purpose of fulfilling your order. You represent that you have the 
                    right to use any content you provide.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>5. Returns and Refunds</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Due to the customized nature of our products, returns are limited to cases of 
                    manufacturing defects or errors on our part. Standard returns for customized 
                    items are not accepted unless the product significantly differs from what was ordered.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>6. Limitation of Liability</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    In no event shall Zyra or its suppliers be liable for any damages (including, 
                    without limitation, damages for loss of data or profit, or due to business 
                    interruption) arising out of the use or inability to use materials on Zyra's 
                    website, even if Zyra or an authorized representative has been notified of the 
                    possibility of such damage.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>7. Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    If you have any questions about these Terms of Service, please contact us at 
                    legal@zyra.com or through our contact page.
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

export default Terms;
