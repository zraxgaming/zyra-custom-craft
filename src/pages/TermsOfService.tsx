
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Separator } from "@/components/ui/separator";

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Terms of Service</h1>
          <Separator className="mb-8" />
          
          <div className="prose max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last Updated: May 9, 2025</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p>
              Welcome to Zyra ("Company," "we," "our," "us")! As you have clicked "I agree" to these Terms of Service, you have agreed to be bound by all of the provisions set forth in these Terms. 
              These Terms of Service constitute a legally binding agreement made between you and Zyra, concerning your access to and use of our website and services.
            </p>
            <p>
              You agree that by accessing the Site, you have read, understood, and agree to be bound by all of these Terms of Service. 
              If you do not agree with all of these Terms of Service, then you are expressly prohibited from using the Site and you must discontinue use immediately.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Products</h2>
            <p>
              We make every effort to display as accurately as possible the colors, features, specifications, and details of the products available on our site. 
              However, we do not guarantee that the colors, features, specifications, and details of the products will be accurate, complete, reliable, current, or free of other errors. 
              Your electronic display may not accurately reflect the actual colors and details of the products.
            </p>
            <p>
              All products are subject to availability, and we cannot guarantee that items will be in stock. 
              We reserve the right to discontinue any products at any time for any reason. 
              Prices for all products are subject to change.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Purchases and Payment</h2>
            <p>
              You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Site. 
              You further agree to promptly update account and payment information, including email address, payment method, and payment card expiration date, 
              so that we can complete your transactions and contact you as needed.
            </p>
            <p>
              We reserve the right to refuse any order placed through the Site. 
              We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order. 
              These restrictions may include orders placed by or under the same customer account, the same payment method, and/or orders that use the same billing or shipping address.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Shipping and Delivery</h2>
            <p>
              Delivery times may vary depending on the delivery option selected, the destination, and other factors. 
              We are not responsible for any delays or damages caused by shipping carriers. 
              Risk of loss and title for items purchased from our website pass to you upon delivery of the items to the carrier.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Returns and Refunds</h2>
            <p>
              Our Return & Refund Policy provides detailed information about options and procedures for returning your purchase. 
              To be eligible for a return, your item must be unused and in the same condition that you received it. 
              It must also be in the original packaging.
            </p>
            <p>
              Certain types of items cannot be returned, including customized products, gift cards, downloadable products, and certain health and personal care items.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. User Accounts</h2>
            <p>
              When you create an account with us, you must provide accurate, complete, and current information at all times. 
              Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
            </p>
            <p>
              You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. 
              You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Intellectual Property</h2>
            <p>
              The Site and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof), are owned by us, our licensors, or other providers and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
            </p>
            <p>
              These Terms permit you to use the Site for your personal, non-commercial use only. You must not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Site.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Prohibited Activities</h2>
            <p>
              You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
            </p>
            <p>
              As a user of the Site, you agree not to:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Use the Site in any manner that could disable, overburden, damage, or impair the site</li>
              <li>Use any robot, spider, or other automatic device to access the Site</li>
              <li>Use any manual process to monitor or copy any of the material on the Site</li>
              <li>Introduce any viruses, trojan horses, worms, or other material which is malicious or technologically harmful</li>
              <li>Attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the Site</li>
              <li>Attack the Site via a denial-of-service attack or a distributed denial-of-service attack</li>
              <li>Otherwise attempt to interfere with the proper working of the Site</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Limitation of Liability</h2>
            <p>
              IN NO EVENT WILL WE, OUR AFFILIATES, OR THEIR LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS BE LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING OUT OF OR IN CONNECTION WITH YOUR USE, OR INABILITY TO USE, THE SITE, ANY WEBSITES LINKED TO IT, ANY CONTENT ON THE SITE OR SUCH OTHER WEBSITES, INCLUDING ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Changes to Terms</h2>
            <p>
              We may revise and update these Terms of Service from time to time in our sole discretion. All changes are effective immediately when we post them, and apply to all access to and use of the Site thereafter.
            </p>
            <p>
              Your continued use of the Site following the posting of revised Terms means that you accept and agree to the changes. You are expected to check this page frequently so you are aware of any changes, as they are binding on you.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">11. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="mt-4">
              <strong>Email:</strong> <a href="mailto:legal@zyra.com" className="text-zyra-purple hover:underline dark:text-zyra-purple">legal@zyra.com</a>
            </p>
            <p>
              <strong>Address:</strong> 123 E-Commerce St, Web City, WC 12345
            </p>
            <p>
              <strong>Phone:</strong> (555) 123-4567
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
