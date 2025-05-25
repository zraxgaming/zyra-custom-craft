
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactForm from "@/components/contact/ContactForm";
import { Container } from "@/components/ui/container";

const Contact = () => {
  return (
    <>
      <Navbar />
      <Container className="py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Contact Us
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
          <ContactForm />
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default Contact;
