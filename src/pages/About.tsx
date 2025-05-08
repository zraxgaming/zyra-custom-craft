
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Award, 
  Users, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  Mail,
  MapPin,
  Phone
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-24">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">About Zyra Store</h1>
                <p className="text-lg text-gray-700 mb-8">
                  We're dedicated to providing high-quality customizable products that express your unique style and personality. Our mission is to make personalization accessible, fun, and affordable for everyone.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    className="bg-zyra-purple hover:bg-zyra-dark-purple"
                    onClick={() => navigate("/shop")}
                  >
                    Explore Products
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate("/contact")}
                  >
                    Contact Us
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-lg overflow-hidden shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" 
                    alt="Our team at work" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg hidden md:block">
                  <div className="flex items-center">
                    <Award className="h-8 w-8 text-zyra-purple mr-3" />
                    <div>
                      <h3 className="font-bold text-gray-900">Premium Quality</h3>
                      <p className="text-sm text-gray-600">Since 2015</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Our Story Section */}
        <section className="py-16 bg-white">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Story</h2>
              <p className="text-gray-700 mb-8">
                Zyra Store was founded in 2015 by a group of creative enthusiasts who believed that personalization should be accessible to everyone. What started as a small online shop offering custom t-shirts has grown into a comprehensive platform where customers can personalize a wide range of products.
              </p>
              <p className="text-gray-700">
                Our journey has been driven by a simple philosophy: empower people to express their individuality through customized products without compromising on quality. Over the years, we've refined our production processes, expanded our product line, and built a community of loyal customers who share our passion for personalization.
              </p>
            </div>
          </Container>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-gray-50">
          <Container>
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="border-none shadow-md">
                <CardContent className="pt-8 px-6 pb-6 text-center">
                  <div className="rounded-full bg-zyra-purple/10 w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                    <CheckCircle2 className="h-8 w-8 text-zyra-purple" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Quality First</h3>
                  <p className="text-gray-600">
                    We never compromise on the quality of our products or the materials we use.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md">
                <CardContent className="pt-8 px-6 pb-6 text-center">
                  <div className="rounded-full bg-zyra-purple/10 w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                    <Users className="h-8 w-8 text-zyra-purple" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Customer Focus</h3>
                  <p className="text-gray-600">
                    Your satisfaction drives everything we do, from product design to customer service.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md">
                <CardContent className="pt-8 px-6 pb-6 text-center">
                  <div className="rounded-full bg-zyra-purple/10 w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                    <Truck className="h-8 w-8 text-zyra-purple" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                  <p className="text-gray-600">
                    We know time matters, so we work hard to get your order to you as quickly as possible.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md">
                <CardContent className="pt-8 px-6 pb-6 text-center">
                  <div className="rounded-full bg-zyra-purple/10 w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                    <ShieldCheck className="h-8 w-8 text-zyra-purple" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Secure Shopping</h3>
                  <p className="text-gray-600">
                    Your personal information and payment details are always protected with us.
                  </p>
                </CardContent>
              </Card>
            </div>
          </Container>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-white">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Meet Our Team</h2>
              <p className="text-gray-700 max-w-2xl mx-auto">
                The passionate people behind Zyra Store who work tirelessly to deliver quality products and exceptional service.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="relative mb-4 mx-auto w-48 h-48 rounded-full overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" 
                    alt="Sarah Johnson" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">Sarah Johnson</h3>
                <p className="text-zyra-purple font-medium">Founder & CEO</p>
                <p className="mt-2 text-gray-600">
                  With over 15 years in product design, Sarah leads our team with a passion for creativity and customer satisfaction.
                </p>
              </div>
              <div className="text-center">
                <div className="relative mb-4 mx-auto w-48 h-48 rounded-full overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" 
                    alt="Michael Rodriguez" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">Michael Rodriguez</h3>
                <p className="text-zyra-purple font-medium">Head of Design</p>
                <p className="mt-2 text-gray-600">
                  Michael brings his artistic vision to every product we create, ensuring each item is unique and visually appealing.
                </p>
              </div>
              <div className="text-center">
                <div className="relative mb-4 mx-auto w-48 h-48 rounded-full overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=922&q=80" 
                    alt="Emily Chen" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">Emily Chen</h3>
                <p className="text-zyra-purple font-medium">Customer Experience</p>
                <p className="mt-2 text-gray-600">
                  Emily ensures that every customer interaction with Zyra Store is positive, helpful, and memorable.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-gray-50">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-gray-900">Get In Touch</h2>
                <p className="text-gray-700 mb-8">
                  We'd love to hear from you! Whether you have a question about our products, need help with an order, or want to discuss a custom project, our team is here to help.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-zyra-purple mr-3 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Our Address</h3>
                      <p className="text-gray-600">123 Commerce Street, Business District, City, 12345</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-zyra-purple mr-3 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Email Us</h3>
                      <p className="text-gray-600">contact@zyrastore.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-zyra-purple mr-3 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Call Us</h3>
                      <p className="text-gray-600">(555) 123-4567</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <Button 
                    className="bg-zyra-purple hover:bg-zyra-dark-purple"
                    onClick={() => navigate("/contact")}
                  >
                    Contact Us
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="rounded-lg overflow-hidden h-96 shadow-xl">
                  <iframe 
                    title="Zyra Store Location"
                    width="100%" 
                    height="100%" 
                    frameBorder="0"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215151185499!2d-73.98509668459377!3d40.75859497932683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1648584121313!5m2!1sen!2sus"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    style={{ border: 0 }}
                  ></iframe>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-zyra-purple text-white">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Ready to Express Your Style?</h2>
              <p className="text-lg opacity-90 mb-8">
                Browse our collection and discover the perfect customizable products for your needs.
              </p>
              <Button
                variant="secondary"
                size="lg"
                className="text-zyra-purple bg-white hover:bg-gray-100"
                onClick={() => navigate("/shop")}
              >
                Shop Now
              </Button>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default About;
