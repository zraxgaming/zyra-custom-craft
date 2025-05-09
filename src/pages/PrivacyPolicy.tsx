
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Separator } from "@/components/ui/separator";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <Separator className="mb-6" />
        
        <div className="prose max-w-none">
          <p>Last Updated: May 9, 2025</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
          <p>
            We collect several types of information from and about users of our website, including:
          </p>
          <ul className="list-disc pl-5 mb-4">
            <li>Personal identifiable information (such as name, email address, mailing address, phone number)</li>
            <li>Order information and history</li>
            <li>Payment details (processed by our secure payment processors)</li>
            <li>User-generated content, including custom designs and product customizations</li>
            <li>Technical data, including IP address, browser type, device information</li>
            <li>Usage data about how you interact with our website</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-5 mb-4">
            <li>Fulfill and manage your orders</li>
            <li>Process your payments</li>
            <li>Communicate with you about orders, products, and services</li>
            <li>Provide customer support</li>
            <li>Improve and customize our website and services</li>
            <li>Comply with our legal obligations</li>
            <li>Send you marketing communications (if you've opted in)</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">3. How We Share Your Information</h2>
          <p>
            We may share your personal information with:
          </p>
          <ul className="list-disc pl-5 mb-4">
            <li>Service providers who assist us in operating our website and business</li>
            <li>Payment processors to complete transactions</li>
            <li>Shipping and logistics companies to deliver your orders</li>
            <li>Marketing and analytics service providers</li>
            <li>Law enforcement when required by law</li>
          </ul>
          <p>
            We do not sell your personal information to third parties.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">4. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our website and hold certain information. 
            Cookies are files with small amounts of data which may include an anonymous unique identifier. 
            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">5. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information. However, no method of 
            transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">6. Your Data Rights</h2>
          <p>
            Depending on your location, you may have certain rights regarding your personal information, including:
          </p>
          <ul className="list-disc pl-5 mb-4">
            <li>Right to access the personal information we hold about you</li>
            <li>Right to correct inaccurate information</li>
            <li>Right to delete your personal information</li>
            <li>Right to object to or restrict processing of your information</li>
            <li>Right to data portability</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">7. Children's Privacy</h2>
          <p>
            Our services are not intended for children under 16 years of age. We do not knowingly collect personal 
            information from children under 16. If you are a parent or guardian and believe your child has provided 
            us with personal information, please contact us.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">8. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
            Privacy Policy on this page and updating the "Last Updated" date at the top.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@zyra.com" className="text-zyra-purple hover:underline">privacy@zyra.com</a>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
