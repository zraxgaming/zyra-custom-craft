
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Award, Users, Globe, Heart, Zap } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

const About = () => {
  const values = [
    {
      icon: Sparkles,
      title: "Innovation",
      description: "Pioneering the future of customizable products with cutting-edge technology and design.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Award,
      title: "Quality",
      description: "Uncompromising commitment to excellence in every product we create and deliver.",
      color: "from-blue-500 to-purple-500"
    },
    {
      icon: Users,
      title: "Community",
      description: "Building meaningful connections with our customers and fostering creativity.",
      color: "from-pink-500 to-red-500"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Serving customers worldwide with fast, reliable shipping and local support.",
      color: "from-green-500 to-blue-500"
    }
  ];

  const stats = [
    { label: "Happy Customers", value: "250K+", icon: Heart },
    { label: "Products Customized", value: "1M+", icon: Sparkles },
    { label: "Countries Served", value: "50+", icon: Globe },
    { label: "Design Awards", value: "25+", icon: Award }
  ];

  return (
    <>
      <SEOHead 
        title="About Zyra - Premium Customizable Products"
        description="Discover Zyra's story, our mission to revolutionize personalized products, and our commitment to quality and innovation."
        url="https://zyra.lovable.app/about"
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
        <Navbar />
        
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-purple-600/10 animate-pulse"></div>
          <Container>
            <div className="text-center max-w-4xl mx-auto animate-fade-in">
              <Badge className="mb-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white animate-bounce-in" style={{animationDelay: '0.2s'}}>
                <Zap className="h-4 w-4 mr-2" />
                Crafting Excellence Since 2020
              </Badge>
              <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent animate-text-shimmer">
                Redefining Personalization
              </h1>
              <p className="text-2xl text-gray-600 dark:text-gray-300 leading-relaxed animate-slide-in-up" style={{animationDelay: '0.4s'}}>
                At Zyra, we believe every product should tell your unique story. We're pioneering the future of customizable products, 
                combining cutting-edge technology with artisanal craftsmanship to create items that are uniquely yours.
              </p>
            </div>
          </Container>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="animate-slide-in-left">
                <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  To democratize personalization and make high-quality, customizable products accessible to everyone. 
                  We're building a world where mass-produced doesn't mean mass-identical.
                </p>
                <div className="space-y-4">
                  {["Premium Materials", "Sustainable Practices", "Innovative Technology", "Global Accessibility"].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 animate-slide-in-left" style={{animationDelay: `${0.6 + index * 0.1}s`}}>
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative animate-slide-in-right">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl blur-xl animate-pulse"></div>
                <Card className="relative overflow-hidden border-0 shadow-2xl hover:scale-105 transition-transform duration-500">
                  <CardContent className="p-0">
                    <div className="h-96 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 flex items-center justify-center">
                      <Sparkles className="h-24 w-24 text-white animate-float" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Container>
        </section>

        {/* Values Section */}
        <section className="py-20">
          <Container>
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent">
                Our Core Values
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                The principles that guide everything we do and inspire us to push boundaries every day.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-scale-in border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm" style={{animationDelay: `${index * 0.1}s`}}>
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <value.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <Container>
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-5xl font-bold mb-6">
                Impact by Numbers
              </h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                These numbers represent real people and real stories of creativity and self-expression.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group animate-bounce-in" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="text-4xl font-bold mb-2 animate-text-shimmer">{stat.value}</div>
                  <div className="text-lg opacity-90">{stat.label}</div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <Container>
            <div className="text-center max-w-4xl mx-auto animate-fade-in">
              <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent">
                Built by Dreamers, for Dreamers
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-12">
                Our team combines decades of experience in design, technology, and manufacturing to bring you 
                products that exceed expectations. We're not just building a company; we're building a movement 
                toward a more personalized world.
              </p>
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/50 dark:to-pink-900/50 border-purple-200 dark:border-purple-700 animate-scale-in">
                <CardContent className="p-12">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                      <Heart className="h-12 w-12 text-white" />
                    </div>
                    <p className="text-2xl text-gray-700 dark:text-gray-300 italic">
                      "Every product we create carries a piece of our passion for perfection and your dreams for personalization."
                    </p>
                    <p className="text-lg text-purple-600 dark:text-purple-400 mt-4 font-medium">
                      - The Zyra Team
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Container>
        </section>
        
        <Footer />
      </div>
    </>
  );
};

export default About;
