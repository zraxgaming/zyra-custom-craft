
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Award, Globe, Heart } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

const About = () => {
  return (
    <>
      <SEOHead 
        title="About Us - Zyra"
        description="Learn about Zyra's mission to provide premium customizable products with exceptional quality and service."
        url="https://zyra.lovable.app/about"
      />
      <Navbar />
      <div className="min-h-screen bg-background">
        <Container className="py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4" variant="outline">About Zyra</Badge>
              <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Crafting Premium Experiences
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We're passionate about creating premium, customizable products that bring your unique vision to life.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Users className="h-8 w-8 text-primary mr-3" />
                    <h3 className="text-xl font-semibold">Our Team</h3>
                  </div>
                  <p className="text-muted-foreground">
                    A dedicated team of designers, craftspeople, and customer service specialists 
                    committed to delivering exceptional products and experiences.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Award className="h-8 w-8 text-primary mr-3" />
                    <h3 className="text-xl font-semibold">Quality First</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Every product undergoes rigorous quality checks to ensure it meets our 
                    high standards before reaching your hands.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Globe className="h-8 w-8 text-primary mr-3" />
                    <h3 className="text-xl font-semibold">Global Reach</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Serving customers worldwide with reliable shipping and localized 
                    customer support in multiple languages.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Heart className="h-8 w-8 text-primary mr-3" />
                    <h3 className="text-xl font-semibold">Customer Love</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Your satisfaction is our priority. We go above and beyond to ensure 
                    every customer has an amazing experience.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Our Story</h2>
                <div className="prose max-w-none">
                  <p className="text-muted-foreground mb-4">
                    Founded in 2023, Zyra began with a simple mission: to make premium, 
                    customizable products accessible to everyone. We noticed a gap in the market 
                    for high-quality products that could be personalized without compromising on craftsmanship.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    Starting with a small collection of customizable items, we've grown into a 
                    comprehensive platform offering everything from personalized gifts to 
                    professional business materials. Our commitment to quality and customer 
                    satisfaction has been the driving force behind our rapid growth.
                  </p>
                  <p className="text-muted-foreground">
                    Today, we continue to innovate and expand our offerings, always keeping 
                    our customers' needs at the heart of everything we do. Join us on this 
                    journey as we redefine what premium customization means.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default About;
