
import React from "react";
import { Container } from "@/components/ui/container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const About = () => {
  return (
    <>
      <Navbar />
      <Container className="py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">About Our Store</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg">
              Welcome to our online store, where quality meets style. We're dedicated to providing 
              exceptional products that enhance your everyday life with a touch of elegance and practicality.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Our Story</h2>
            <p>
              Founded in 2023, our journey began with a simple idea: create products that combine 
              beautiful design with functionality. What started as a small workshop has grown into 
              a brand trusted by customers nationwide.
            </p>
            <p>
              Our team of designers and craftspeople work tirelessly to bring you products that stand 
              out. We believe in the power of thoughtful design to transform everyday items into 
              something special.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Our Mission</h2>
            <p>
              We're on a mission to make high-quality, well-designed products accessible to everyone. 
              We believe that beautiful, functional items shouldn't be a luxury - they should be part 
              of everyday life.
            </p>
            <p>
              Each product in our collection is created with intention and purpose. We source the 
              finest materials and work with skilled artisans to ensure that everything we sell meets 
              our exacting standards.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Our Values</h2>
            <ul className="space-y-3 list-disc pl-5">
              <li>
                <strong>Quality:</strong> We never compromise on quality. Every product is tested to 
                ensure it meets our high standards.
              </li>
              <li>
                <strong>Sustainability:</strong> We're committed to reducing our environmental impact 
                through responsible material sourcing and production practices.
              </li>
              <li>
                <strong>Transparency:</strong> We believe in honest communication with our customers 
                about our products, pricing, and practices.
              </li>
              <li>
                <strong>Community:</strong> We value the community we've built and strive to give back 
                through various initiatives and partnerships.
              </li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Our Products</h2>
            <p>
              Our product range is carefully curated to offer something for every taste and need. 
              From home décor to personalized gifts, each item is designed to bring joy and functionality 
              to your daily life.
            </p>
            <p>
              We're particularly proud of our customization options, which allow you to create truly 
              unique items that reflect your personal style.
            </p>
            
            <div className="mt-8 border-t pt-8">
              <h2 className="text-2xl font-bold mb-4">Connect With Us</h2>
              <p>
                We love hearing from our customers! Whether you have a question about a product, want 
                to share your experience, or have a suggestion for how we can improve, please don't 
                hesitate to reach out.
              </p>
              <p className="mt-4">
                Visit our <a href="/contact" className="text-blue-600 hover:underline">Contact Page</a> or 
                find us on social media to join our community.
              </p>
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default About;
