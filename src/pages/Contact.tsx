
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactForm from "@/components/contact/ContactForm";
import NewsletterSignup from "@/components/newsletter/NewsletterSignup";
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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <ContactForm />
            
            {/* Newsletter Signup */}
            <div className="p-8 bg-card rounded-lg border border-border">
              <h2 className="text-2xl font-bold mb-4 text-foreground">
                Stay Updated
              </h2>
              <p className="text-muted-foreground mb-6">
                Subscribe to our newsletter for the latest updates, promotions, and news.
              </p>
              <NewsletterSignup />
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default Contact;
