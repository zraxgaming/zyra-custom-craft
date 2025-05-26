
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Award, Globe, Heart, Target, Lightbulb } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

const About = () => {
  const values = [
    {
      icon: Users,
      title: "Our Team",
      description: "A dedicated team of designers, craftspeople, and customer service specialists committed to delivering exceptional products and experiences.",
    },
    {
      icon: Award,
      title: "Quality First",
      description: "Every product undergoes rigorous quality checks to ensure it meets our high standards before reaching your hands.",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Serving customers worldwide with reliable shipping and localized customer support in multiple languages.",
    },
    {
      icon: Heart,
      title: "Customer Love",
      description: "Your satisfaction is our priority. We go above and beyond to ensure every customer has an amazing experience.",
    },
    {
      icon: Target,
      title: "Our Mission",
      description: "To make premium, customizable products accessible to everyone without compromising on quality or craftsmanship.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Constantly improving our processes and expanding our offerings to meet the evolving needs of our customers.",
    },
  ];

  return (
    <>
      <SEOHead 
        title="About Us - Zyra"
        description="Learn about Zyra's mission to provide premium customizable products with exceptional quality and service."
        url="https://zyra.lovable.app/about"
      />
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Container className="py-12">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16 animate-fade-in">
              <Badge className="mb-4 bg-gradient-to-r from-primary to-purple-600 hover:scale-110 transition-transform duration-300" variant="outline">
                About Zyra
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-scale-in">
                Crafting Premium Experiences
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-slide-in-right">
                We're passionate about creating premium, customizable products that bring your unique vision to life with exceptional quality and unmatched service.
              </p>
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {values.map((value, index) => (
                <Card 
                  key={index} 
                  className="hover:shadow-xl hover:scale-105 transition-all duration-300 border-border/50 hover:border-primary/20 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="p-2 rounded-lg bg-primary/10 mr-3 hover:bg-primary/20 transition-colors duration-300">
                        <value.icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold">{value.title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Story Section */}
            <Card className="mb-12 hover:shadow-xl transition-shadow duration-300 animate-scale-in">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Our Story
                </h2>
                <div className="prose max-w-none space-y-6">
                  <p className="text-muted-foreground mb-4 text-lg leading-relaxed animate-fade-in">
                    Founded in 2023, Zyra began with a simple mission: to make premium, 
                    customizable products accessible to everyone. We noticed a gap in the market 
                    for high-quality products that could be personalized without compromising on craftsmanship.
                  </p>
                  <p className="text-muted-foreground mb-4 text-lg leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    Starting with a small collection of customizable items, we've grown into a 
                    comprehensive platform offering everything from personalized gifts to 
                    professional business materials. Our commitment to quality and customer 
                    satisfaction has been the driving force behind our rapid growth.
                  </p>
                  <p className="text-muted-foreground text-lg leading-relaxed animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    Today, we continue to innovate and expand our offerings, always keeping 
                    our customers' needs at the heart of everything we do. Join us on this 
                    journey as we redefine what premium customization means.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* CTA Section */}
            <div className="text-center animate-bounce-in">
              <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20 hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    Ready to Create Something Amazing?
                  </h3>
                  <p className="text-muted-foreground mb-6 text-lg">
                    Join thousands of satisfied customers who trust Zyra for their custom product needs.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a 
                      href="/shop" 
                      className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-primary to-purple-600 text-primary-foreground rounded-lg font-medium hover:scale-105 hover:shadow-lg transition-all duration-300"
                    >
                      Start Shopping
                    </a>
                    <a 
                      href="/contact" 
                      className="inline-flex items-center justify-center px-8 py-3 border border-primary/20 text-foreground rounded-lg font-medium hover:scale-105 hover:shadow-lg hover:bg-primary/5 transition-all duration-300"
                    >
                      Contact Us
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default About;
