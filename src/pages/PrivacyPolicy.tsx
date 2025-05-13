
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Separator } from "@/components/ui/separator";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Privacy Policy</h1>
          <Separator className="mb-8" />
          
          <div className="prose max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last Updated: May 9, 2025</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
            <p>
              We collect several types of information from and about users of our website, including:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Personal identifiable information (such as name, email address, mailing address, phone number)</li>
              <li>Order information and history</li>
              <li>Payment details (processed by our secure payment processors)</li>
              <li>User-generated content, including custom designs and product customizations</li>
              <li>Technical data, including IP address, browser type, device information</li>
              <li>Usage data about how you interact with our website</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Fulfill and manage your orders</li>
              <li>Process your payments</li>
              <li>Communicate with you about orders, products, and services</li>
              <li>Provide customer support</li>
              <li>Improve and customize our website and services</li>
              <li>Comply with our legal obligations</li>
              <li>Send you marketing communications (if you've opted in)</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Share Your Information</h2>
            <p>
              We may share your personal information with:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Service providers who assist us in operating our website and business</li>
              <li>Payment processors to complete transactions</li>
              <li>Shipping and logistics companies to deliver your orders</li>
              <li>Marketing and analytics service providers</li>
              <li>Law enforcement when required by law</li>
            </ul>
            <p>
              We do not sell your personal information to third parties.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our website and hold certain information. 
              Cookies are files with small amounts of data which may include an anonymous unique identifier. 
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 my-6">
              <h3 className="font-medium mb-2 text-lg">Your Cookie Choices</h3>
              <p className="text-sm mb-2">You can control how cookies are used on our site:</p>
              <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300">
                <li>Essential cookies: Always active and necessary for the website to function</li>
                <li>Analytics cookies: Help us improve our website by collecting anonymous information</li>
                <li>Marketing cookies: Used to deliver relevant advertisements and track marketing campaign performance</li>
              </ul>
            </div>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
            <p>
              Our security measures include:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Encryption of sensitive data</li>
              <li>Secure socket layer (SSL) technology</li>
              <li>Regular security assessments</li>
              <li>Employee training on data protection</li>
              <li>Access controls and authentication measures</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Your Data Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Right to access the personal information we hold about you</li>
              <li>Right to correct inaccurate information</li>
              <li>Right to delete your personal information</li>
              <li>Right to object to or restrict processing of your information</li>
              <li>Right to data portability</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Children's Privacy</h2>
            <p>
              Our services are not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top.
            </p>
            <div className="bg-zyra-purple bg-opacity-10 rounded-lg p-4 my-6 border border-zyra-purple border-opacity-20">
              <h3 className="font-medium mb-2 text-lg text-zyra-purple dark:text-zyra-purple">Stay Informed</h3>
              <p className="text-sm">
                We recommend reviewing this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
              </p>
            </div>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 my-6 shadow-sm border border-gray-200 dark:border-gray-600">
              <p className="mb-2">
                <strong>Email:</strong> <a href="mailto:privacy@zyra.com" className="text-zyra-purple hover:underline dark:text-zyra-purple">privacy@zyra.com</a>
              </p>
              <p className="mb-2">
                <strong>Address:</strong> 123 E-Commerce St, Web City, WC 12345
              </p>
              <p>
                <strong>Phone:</strong> (555) 123-4567
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
