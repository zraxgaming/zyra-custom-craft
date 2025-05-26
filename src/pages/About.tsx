
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Users, Award, Target, Heart, Sparkles, Star } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Quality First",
      description: "We're committed to delivering premium products that exceed expectations."
    },
    {
      icon: Heart,
      title: "Customer Care",
      description: "Your satisfaction is our priority. We're here to help every step of the way."
    },
    {
      icon: Sparkles,
      title: "Innovation",
      description: "Constantly evolving to bring you the latest in customization technology."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Striving for perfection in every product and every customer interaction."
    }
  ];

  return (
    <>
      <SEOHead 
        title="About Us - Zyra"
        description="Learn about Zyra's mission to provide premium customizable products with exceptional quality and service."
        url="https://zyra.lovable.app/about"
      />
      <div className="min-h-screen bg-background floating-dots-bg particle-field-bg">
        <Navbar />
        
        <section className="py-20 bg-gradient-to-br from-primary/5 via-purple-500/5 to-background">
          <Container>
            <div className="text-center mb-16 animate-fade-in">
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                About Zyra
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                We're passionate about bringing your creative visions to life through premium customizable products and exceptional service.
              </p>
            </div>
          </Container>
        </section>

        <Container className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
            <div className="animate-slide-in-left">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded with a vision to democratize custom manufacturing, Zyra started as a small team 
                  of designers and technologists who believed that everyone deserves access to high-quality, 
                  personalized products.
                </p>
                <p>
                  Today, we've grown into a leading platform that combines cutting-edge technology with 
                  artisanal craftsmanship, enabling customers worldwide to create products that truly 
                  reflect their personality and style.
                </p>
                <p>
                  Our commitment to quality, innovation, and customer satisfaction has made us the 
                  trusted choice for individuals and businesses looking for premium customization solutions.
                </p>
              </div>
            </div>
            
            <div className="animate-slide-in-right">
              <Card className="h-full hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <Users className="h-8 w-8 text-primary mr-3" />
                    <h3 className="text-2xl font-bold">Our Mission</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    To empower creativity and self-expression through accessible, high-quality customization 
                    technology that transforms ideas into reality.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <div className="text-2xl font-bold text-primary">10K+</div>
                      <div className="text-sm text-muted-foreground">Happy Customers</div>
                    </div>
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <div className="text-2xl font-bold text-primary">50K+</div>
                      <div className="text-sm text-muted-foreground">Products Created</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mb-20">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-muted-foreground">The principles that guide everything we do</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card 
                  key={value.title} 
                  className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 animate-fade-in">
            <CardContent className="p-12 text-center">
              <div className="flex justify-center mb-6">
                <Star className="h-12 w-12 text-primary animate-pulse" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Whether you're an individual looking to create something special or a business seeking 
                custom solutions, we're here to help bring your vision to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/shop" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Start Creating
                </a>
                <a 
                  href="/contact" 
                  className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Get in Touch
                </a>
              </div>
            </CardContent>
          </Card>
        </Container>
        
        <Footer />
      </div>
    </>
  );
};

export default About;
