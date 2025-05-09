
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Separator } from "@/components/ui/separator";

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <Separator className="mb-6" />
        
        <div className="prose max-w-none">
          <p>Last Updated: May 9, 2025</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p>
            Welcome to Zyra ("we," "our," or "us"). By accessing or using our website, mobile application, 
            or any of our services, you agree to be bound by these Terms of Service. Please read these terms 
            carefully before using our platform.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">2. Use of Services</h2>
          <p>
            Our services allow you to browse, design, customize and purchase various products. You must use 
            our services only for lawful purposes and in accordance with these terms.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">3. User Accounts</h2>
          <p>
            When you create an account with us, you must provide information that is accurate, complete, and current at all times. 
            You are responsible for safeguarding the password and for all activities that occur under your account.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">4. User Content</h2>
          <p>
            Our services may allow you to upload, submit, store, send or receive content. You retain ownership 
            of any intellectual property rights that you hold in that content. By uploading content to our platform 
            for product customization, you grant us a license to use, host, store, and display that content for 
            the purposes of providing our services.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">5. Prohibited Uses</h2>
          <p>You agree not to use our services:</p>
          <ul className="list-disc pl-5 mb-4">
            <li>In any way that violates any applicable federal, state, local, or international law or regulation</li>
            <li>To transmit, or procure the sending of, any advertising or promotional material, including "spam"</li>
            <li>To impersonate or attempt to impersonate another person or entity</li>
            <li>To upload content that infringes on the intellectual property rights of others</li>
            <li>To engage in any conduct that restricts or inhibits anyone's use or enjoyment of our services</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">6. Products and Orders</h2>
          <p>
            All products are subject to availability. We reserve the right to discontinue any product at any time. 
            Prices for products are subject to change without notice. We reserve the right to refuse any order you place with us.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">7. Shipping and Delivery</h2>
          <p>
            Shipping and delivery times are estimates and cannot be guaranteed. We are not liable for any delays in 
            shipping or delivery. Risk of loss and title for items purchased pass to you upon delivery of the items to the carrier.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">8. Returns and Refunds</h2>
          <p>
            Our return policy allows returns within 30 days of receipt of delivery. Custom-designed products may have 
            different return policies, which will be clearly indicated at the time of purchase.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">9. Disclaimer of Warranties</h2>
          <p>
            Our services are provided on an "as is" and "as available" basis, without any warranties of any kind. 
            We do not warrant that our services will be uninterrupted or error-free.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">10. Limitation of Liability</h2>
          <p>
            In no event shall we be liable for any indirect, incidental, special, consequential or punitive damages, 
            including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">11. Changes to Terms</h2>
          <p>
            We reserve the right to modify or replace these terms at any time at our sole discretion. We will provide 
            notice of any significant changes.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">12. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at <a href="mailto:support@zyra.com" className="text-zyra-purple hover:underline">support@zyra.com</a>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
