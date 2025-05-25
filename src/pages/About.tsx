
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">About Zyra</h1>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Our Story</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Zyra was founded with a simple mission: to provide high-quality, customizable products 
                that help our customers express their unique style and personality.
              </p>
              <p className="text-muted-foreground">
                We believe that everyone deserves products that are not just functional, but also 
                meaningful and personal. That's why we offer extensive customization options on 
                all our products.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Our Values</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Quality First</h3>
                  <p className="text-muted-foreground">
                    We source only the finest materials and work with skilled artisans 
                    to ensure every product meets our high standards.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Customer Focused</h3>
                  <p className="text-muted-foreground">
                    Your satisfaction is our priority. We're here to help you create 
                    something truly special.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Innovation</h3>
                  <p className="text-muted-foreground">
                    We continuously evolve our processes and products to bring you 
                    the latest in customization technology.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Sustainability</h3>
                  <p className="text-muted-foreground">
                    We're committed to responsible manufacturing and sustainable 
                    business practices.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
