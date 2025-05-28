
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <Container className="py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">About Zyra Custom Craft</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-muted-foreground mb-8">
              Welcome to Zyra Custom Craft, where creativity meets quality craftsmanship.
            </p>

            <h2>Our Story</h2>
            <p>
              Founded with a passion for unique, personalized products, Zyra Custom Craft has been serving customers who value quality and customization. We believe that every item should tell a story and reflect the personality of its owner.
            </p>

            <h2>What We Do</h2>
            <p>
              We specialize in creating custom products that are as unique as you are. From personalized gifts to custom home decor, our skilled artisans work with you to bring your vision to life.
            </p>

            <h2>Our Mission</h2>
            <p>
              To provide high-quality, customizable products that exceed expectations while delivering exceptional customer service and supporting local craftsmanship.
            </p>

            <h2>Quality Promise</h2>
            <p>
              Every product is carefully crafted with attention to detail and quality materials. We stand behind our work and are committed to your satisfaction.
            </p>

            <h2>Contact Us</h2>
            <p>
              Have questions or want to discuss a custom project? We'd love to hear from you. Contact us at info@zyracustomcraft.com or through our contact form.
            </p>
          </div>
        </div>
      </Container>
      
      <Footer />
    </div>
  );
};

export default About;
