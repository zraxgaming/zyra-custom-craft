
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
        </div>
      </Container>
      <TypeformFeedback 
        typeformId="GcTxpZxC"
        triggerText="Quick Feedback"
        className="fixed bottom-4 right-4 z-50"
      />
      <Footer />
    </div>
  );
};

export default Contact;
