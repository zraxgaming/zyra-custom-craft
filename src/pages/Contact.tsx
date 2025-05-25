
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactForm from "@/components/contact/ContactForm";
import TypeformFeedback from "@/components/feedback/TypeformFeedback";
import { Container } from "@/components/ui/container";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Container className="py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-foreground">
              Contact Us
            </h1>
            <p className="text-lg text-muted-foreground">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
          <ContactForm />
          
          {/* Embedded Typeform for detailed feedback */}
          <div className="mt-16 p-8 bg-card rounded-lg border border-border">
            <h2 className="text-2xl font-bold mb-4 text-foreground text-center">
              Share Your Experience
            </h2>
            <p className="text-muted-foreground text-center mb-6">
              Help us improve by sharing your detailed feedback about our website and services.
            </p>
            <div className="flex justify-center">
              <TypeformFeedback 
                typeformId="GcTxpZxC"
                triggerText="Share Detailed Feedback"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-lg"
              />
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default Contact;
