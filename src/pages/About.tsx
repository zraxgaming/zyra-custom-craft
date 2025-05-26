
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Award, Globe, Heart, Target, Lightbulb, Sparkles, Star } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

const About = () => {
  const values = [
    {
      icon: Users,
      title: "Our Team",
      description: "A dedicated team of designers, craftspeople, and customer service specialists committed to delivering exceptional products and experiences.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Award,
      title: "Quality First",
      description: "Every product undergoes rigorous quality checks to ensure it meets our high standards before reaching your hands.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Serving customers worldwide with reliable shipping and localized customer support in multiple languages.",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: Heart,
      title: "Customer Love",
      description: "Your satisfaction is our priority. We go above and beyond to ensure every customer has an amazing experience.",
      color: "from-red-500 to-orange-500"
    },
    {
      icon: Target,
      title: "Our Mission",
      description: "To make premium, customizable products accessible to everyone without compromising on quality or craftsmanship.",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Constantly improving our processes and expanding our offerings to meet the evolving needs of our customers.",
      color: "from-yellow-500 to-orange-500"
    },
  ];

  const stats = [
    { number: "50K+", label: "Happy Customers", icon: Users },
    { number: "100K+", label: "Products Created", icon: Star },
    { number: "99.9%", label: "Quality Rate", icon: Award },
    { number: "24/7", label: "Support", icon: Heart }
  ];

  return (
    <>
      <SEOHead 
        title="About Us - Zyra"
        description="Learn about Zyra's mission to provide premium customizable products with exceptional quality and service."
        url="https://zyra.lovable.app/about"
      />
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-purple-500/10 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-primary to-purple-500 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-60 right-10 w-80 h-80 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
          <div className="absolute bottom-40 left-1/4 w-72 h-72 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full blur-3xl animate-float" style={{ animationDelay: '6s' }}></div>
        </div>

        <Container className="py-12 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-20 animate-fade-in">
              <div className="relative mb-8">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 via-purple-500/30 to-pink-500/30 rounded-full blur-xl animate-pulse"></div>
                <Badge className="relative mb-6 bg-gradient-to-r from-primary to-purple-600 hover:scale-110 transition-transform duration-300 text-lg px-6 py-2" variant="outline">
                  <Sparkles className="h-5 w-5 mr-3" />
                  About Zyra
                </Badge>
              </div>
              <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-scale-in">
                Crafting Premium
                <br />
                <span className="animate-pulse-glow">Experiences</span>
              </h1>
              <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-slide-in-right">
                We're passionate about creating premium, customizable products that bring your unique vision to life with exceptional quality and unmatched service.
              </p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
              {stats.map((stat, index) => (
                <Card 
                  key={index}
                  className="text-center hover:shadow-2xl hover:scale-105 transition-all duration-500 border-border/50 hover:border-primary/30 animate-bounce-in bg-card/60 backdrop-blur-sm"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="p-3 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl w-fit mx-auto mb-4 hover:rotate-12 transition-transform duration-300">
                      <stat.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
                      {stat.number}
                    </div>
                    <p className="text-muted-foreground font-medium">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {values.map((value, index) => (
                <Card 
                  key={index} 
                  className="group hover:shadow-2xl hover:scale-105 transition-all duration-500 border-border/50 hover:border-primary/30 animate-fade-in bg-card/60 backdrop-blur-sm overflow-hidden"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <CardContent className="p-8 relative">
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${value.color} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
                    <div className="relative">
                      <div className={`flex items-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <div className={`p-3 rounded-2xl bg-gradient-to-br ${value.color} bg-opacity-20 mr-4 group-hover:rotate-12 transition-transform duration-300`}>
                          <value.icon className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                          {value.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed text-lg group-hover:text-foreground transition-colors duration-300">
                        {value.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Story Section */}
            <Card className="mb-16 hover:shadow-2xl transition-all duration-500 animate-scale-in bg-gradient-to-br from-card/80 to-primary/5 backdrop-blur-sm border-border/50">
              <CardContent className="p-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-3xl">
                    <Sparkles className="h-10 w-10 text-primary" />
                  </div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Our Story
                  </h2>
                </div>
                <div className="space-y-8">
                  <p className="text-muted-foreground text-xl leading-relaxed animate-fade-in">
                    Founded in 2023, Zyra began with a simple mission: to make premium, 
                    customizable products accessible to everyone. We noticed a gap in the market 
                    for high-quality products that could be personalized without compromising on craftsmanship.
                  </p>
                  <p className="text-muted-foreground text-xl leading-relaxed animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    Starting with a small collection of customizable items, we've grown into a 
                    comprehensive platform offering everything from personalized gifts to 
                    professional business materials. Our commitment to quality and customer 
                    satisfaction has been the driving force behind our rapid growth.
                  </p>
                  <p className="text-muted-foreground text-xl leading-relaxed animate-fade-in" style={{ animationDelay: '0.6s' }}>
                    Today, we continue to innovate and expand our offerings, always keeping 
                    our customers' needs at the heart of everything we do. Join us on this 
                    journey as we redefine what premium customization means.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* CTA Section */}
            <div className="text-center animate-bounce-in">
              <Card className="bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 border-primary/30 hover:shadow-2xl transition-all duration-500 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-12 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 animate-pulse"></div>
                  <div className="relative">
                    <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Ready to Create Something Amazing?
                    </h3>
                    <p className="text-muted-foreground mb-8 text-xl max-w-2xl mx-auto">
                      Join thousands of satisfied customers who trust Zyra for their custom product needs.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                      <a 
                        href="/shop" 
                        className="inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-primary to-purple-600 text-primary-foreground rounded-2xl font-semibold text-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 hover:rotate-1"
                      >
                        <Sparkles className="h-5 w-5 mr-2" />
                        Start Shopping
                      </a>
                      <a 
                        href="/contact" 
                        className="inline-flex items-center justify-center px-10 py-4 border-2 border-primary/30 text-foreground rounded-2xl font-semibold text-lg hover:scale-105 hover:shadow-2xl hover:bg-primary/10 transition-all duration-300 hover:-rotate-1"
                      >
                        <Heart className="h-5 w-5 mr-2" />
                        Contact Us
                      </a>
                    </div>
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
