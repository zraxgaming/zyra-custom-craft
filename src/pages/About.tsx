
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Users, Target, Award, Globe, Heart, Shield } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: "Quality First",
      description: "We source only the finest materials and work with skilled artisans to ensure every product meets our high standards."
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Customer Focused", 
      description: "Your satisfaction is our priority. We're here to help you create something truly special."
    },
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Innovation",
      description: "We continuously evolve our processes and products to bring you the latest in customization technology."
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Sustainability",
      description: "We're committed to responsible manufacturing and sustainable business practices."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Community",
      description: "Building lasting relationships with our customers and supporting local communities."
    },
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      title: "Global Reach",
      description: "Serving customers worldwide with reliable shipping and customer support."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Container className="py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              About Zyra
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transforming ideas into personalized products that tell your unique story.
            </p>
          </div>
          
          {/* Story Section */}
          <Card className="mb-12 animate-fade-in border-2 border-primary/20 shadow-xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold text-foreground">Our Story</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-lg">
              <p className="text-muted-foreground leading-relaxed">
                Zyra was founded with a simple yet powerful mission: to provide high-quality, customizable products 
                that help our customers express their unique style and personality. In a world of mass production, 
                we believe everyone deserves something truly personal.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                What started as a small workshop has grown into a global platform, but our core values remain unchanged. 
                We believe that products should be more than just functional—they should be meaningful, personal, and 
                crafted with care. That's why we offer extensive customization options on all our products.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Every item that leaves our facility is a testament to our commitment to quality and our customers' 
                creative vision. We're not just selling products; we're helping people bring their ideas to life.
              </p>
            </CardContent>
          </Card>

          {/* Values Section */}
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-center mb-12 text-foreground">Our Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <Card 
                  key={index} 
                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-primary/30 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-8 text-center">
                    <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      {value.icon}
                    </div>
                    <h3 className="font-bold text-xl mb-4 text-foreground group-hover:text-primary transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Mission Section */}
          <Card className="bg-gradient-to-r from-primary/10 to-purple-600/10 border-2 border-primary/30 animate-fade-in">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold text-foreground">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-xl text-muted-foreground leading-relaxed max-w-4xl mx-auto">
                To democratize customization and make personalized products accessible to everyone, 
                while maintaining the highest standards of quality and customer service.
              </p>
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">10K+</div>
                  <div className="text-muted-foreground">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">50+</div>
                  <div className="text-muted-foreground">Countries Served</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">99%</div>
                  <div className="text-muted-foreground">Satisfaction Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default About;
