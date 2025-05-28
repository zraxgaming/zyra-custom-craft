
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <Container className="py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing and using Zyra Custom Craft, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2>2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials on Zyra Custom Craft's website for personal, non-commercial transitory viewing only.
            </p>

            <h2>3. Disclaimer</h2>
            <p>
              The materials on Zyra Custom Craft's website are provided on an 'as is' basis. Zyra Custom Craft makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>

            <h2>4. Limitations</h2>
            <p>
              In no event shall Zyra Custom Craft or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Zyra Custom Craft's website.
            </p>

            <h2>5. Accuracy of Materials</h2>
            <p>
              The materials appearing on Zyra Custom Craft's website could include technical, typographical, or photographic errors. Zyra Custom Craft does not warrant that any of the materials on its website are accurate, complete, or current.
            </p>

            <h2>6. Links</h2>
            <p>
              Zyra Custom Craft has not reviewed all of the sites linked to our website and is not responsible for the contents of any such linked site.
            </p>

            <h2>7. Modifications</h2>
            <p>
              Zyra Custom Craft may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>

            <h2>8. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of UAE and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
            </p>
          </div>
        </div>
      </Container>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;
