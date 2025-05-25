
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Heart, Award, Users, Palette, Shield } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

const About = () => {
  const features = [
    {
      icon: <Palette className="h-8 w-8" />,
      title: "Custom Creations",
      description: "Transform your ideas into reality with our advanced customization tools"
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Premium Quality",
      description: "Only the finest materials and craftsmanship go into every product"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure & Trusted",
      description: "Your data and transactions are protected with enterprise-grade security"
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Made with Love",
      description: "Every product is crafted with passion and attention to detail"
    }
  ];

  const team = [
    {
      name: "Alex Chen",
      role: "Founder & CEO",
      description: "Visionary leader with 10+ years in e-commerce innovation"
    },
    {
      name: "Sarah Rodriguez",
      role: "Head of Design",
      description: "Creative genius behind our stunning product customization tools"
    },
    {
      name: "Michael Park",
      role: "CTO",
      description: "Tech wizard ensuring our platform runs smoothly and securely"
    },
    {
      name: "Emma Thompson",
      role: "Customer Success",
      description: "Dedicated to making every customer experience exceptional"
    }
  ];

  return (
    <>
      <SEOHead 
        title="About Zyra - Premium Custom Products"
        description="Learn about Zyra's mission to deliver premium customizable products with cutting-edge technology and exceptional craftsmanship."
        keywords="about zyra, custom products, premium quality, e-commerce innovation"
        url="https://zyra.lovable.app/about"
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5"></div>
          <Container className="relative z-10">
            <div className="text-center max-w-4xl mx-auto animate-fade-in">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-primary/10 to-purple-500/10 p-4 rounded-2xl border border-primary/20 backdrop-blur-sm">
                    <Sparkles className="h-10 w-10 text-primary animate-pulse" />
                  </div>
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 animate-scale-in">
                About Zyra
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed animate-slide-in-right">
                We're revolutionizing the way people create and customize products. 
                From personalized phone cases to custom apparel, we make it easy to 
                bring your unique vision to life with premium quality and cutting-edge technology.
              </p>
            </div>
          </Container>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-muted/30">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-slide-in-left">
                <Badge className="mb-4 bg-gradient-to-r from-primary to-purple-600">Our Mission</Badge>
                <h2 className="text-4xl font-bold mb-6 text-foreground">
                  Empowering Creativity Through Technology
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  At Zyra, we believe everyone deserves products that reflect their unique personality. 
                  Our mission is to democratize customization, making it accessible, affordable, and 
                  enjoyable for everyone.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We combine state-of-the-art technology with traditional craftsmanship to deliver 
                  products that not only look amazing but also stand the test of time.
                </p>
              </div>
              <div className="relative animate-slide-in-right">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl blur-xl"></div>
                <Card className="relative bg-card/50 backdrop-blur-sm border border-border/50">
                  <CardContent className="p-8">
                    <div className="grid grid-cols-2 gap-6 text-center">
                      <div>
                        <div className="text-3xl font-bold text-primary mb-2">50K+</div>
                        <div className="text-sm text-muted-foreground">Happy Customers</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-primary mb-2">1M+</div>
                        <div className="text-sm text-muted-foreground">Products Created</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
                        <div className="text-sm text-muted-foreground">Uptime</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                        <div className="text-sm text-muted-foreground">Support</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Container>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <Container>
            <div className="text-center mb-12 animate-fade-in">
              <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600">Why Choose Zyra</Badge>
              <h2 className="text-4xl font-bold mb-4 text-foreground">What Makes Us Different</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We're not just another e-commerce platform. We're your creative partner in bringing unique ideas to life.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  className="group bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-muted/30">
          <Container>
            <div className="text-center mb-12 animate-fade-in">
              <Badge className="mb-4 bg-gradient-to-r from-pink-600 to-primary">Our Team</Badge>
              <h2 className="text-4xl font-bold mb-4 text-foreground">Meet the Creators</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The passionate individuals behind Zyra's success
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <Card 
                  key={index} 
                  className="group bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-1 text-foreground">{member.name}</h3>
                    <p className="text-primary font-medium mb-3">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default About;
