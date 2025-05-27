
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Users, Award, Globe, Heart, Star, Sparkles, Shield, Zap } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";

const About = () => {
  const stats = [
    { icon: Users, label: "Happy Customers", value: "50,000+", color: "text-blue-600" },
    { icon: Award, label: "Products Delivered", value: "100,000+", color: "text-green-600" },
    { icon: Globe, label: "Countries Served", value: "25+", color: "text-purple-600" },
    { icon: Heart, label: "5-Star Reviews", value: "45,000+", color: "text-pink-600" }
  ];

  const values = [
    {
      icon: Star,
      title: "Premium Quality",
      description: "We source only the finest materials and work with top-tier manufacturers to ensure every product meets our exacting standards.",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: Sparkles,
      title: "Endless Customization",
      description: "Your imagination is the only limit. Our advanced customization platform allows you to create truly unique products.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Shield,
      title: "Customer Trust",
      description: "We protect your data, secure your payments, and stand behind every product with our comprehensive guarantee.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "From order to delivery, we've optimized every step to get your custom creations to you as quickly as possible.",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <>
      <SEOHead 
        title="About Zyra - Premium Custom Products"
        description="Learn about Zyra's mission to deliver premium customizable products. Discover our story, values, and commitment to quality."
        url="https://zyra.lovable.app/about"
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
        <Navbar />
        
        {/* Hero Section */}
        <section className="pt-20 pb-16 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10">
          <Container>
            <div className="text-center mb-16 animate-fade-in">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-full mb-8 animate-bounce-in shadow-2xl">
                <Heart className="h-12 w-12 text-white animate-pulse" />
              </div>
              <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent animate-text-shimmer">
                About Zyra
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-slide-in-up leading-relaxed" style={{animationDelay: '0.2s'}}>
                We're passionate about transforming ordinary products into extraordinary personalized experiences. Since our founding, we've been dedicated to bringing your unique vision to life with premium quality and unmatched customization.
              </p>
            </div>
          </Container>
        </section>

        {/* Stats Section */}
        <Container className="pb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-scale-in border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm" style={{animationDelay: `${index * 0.1}s`}}>
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-2xl mb-4 shadow-lg">
                    <stat.icon className={`h-8 w-8 ${stat.color} animate-float`} />
                  </div>
                  <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Story Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="animate-slide-in-left">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                <p>
                  Founded in 2020 with a simple mission: to make premium customization accessible to everyone. What started as a small team of designers and engineers has grown into a global platform serving customers worldwide.
                </p>
                <p>
                  We believe that every product should tell a story - your story. Whether it's a personalized gift for a loved one or a custom piece that reflects your unique style, we're here to bring your vision to life with exceptional quality and attention to detail.
                </p>
                <p>
                  Today, we're proud to offer thousands of customizable products, working with carefully selected suppliers and using cutting-edge technology to ensure every order exceeds expectations.
                </p>
              </div>
            </div>
            <div className="animate-slide-in-right">
              <div className="bg-gradient-to-br from-purple-100 via-white to-pink-100 dark:from-purple-900/30 dark:via-gray-800 dark:to-pink-900/30 rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">2020</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Founded</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-2">25+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Countries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">50K+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">100K+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Orders</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-20">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Our Values
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                These core principles guide everything we do, from product design to customer service.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-scale-in border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm overflow-hidden" style={{animationDelay: `${index * 0.15}s`}}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${value.gradient} rounded-2xl flex items-center justify-center shadow-xl`}>
                        <value.icon className="h-7 w-7 text-white animate-pulse" />
                      </div>
                      <CardTitle className="text-2xl text-gray-900 dark:text-white">
                        {value.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Mission Statement */}
          <Card className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 border-0 shadow-2xl animate-scale-in text-white overflow-hidden">
            <CardContent className="p-12 text-center relative">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <Sparkles className="h-16 w-16 mx-auto mb-6 animate-float" />
                <h3 className="text-4xl font-bold mb-6 animate-text-shimmer">
                  Our Mission
                </h3>
                <p className="text-xl leading-relaxed max-w-4xl mx-auto animate-fade-in">
                  To empower individuals and businesses to express their unique identity through premium customizable products, while maintaining the highest standards of quality, sustainability, and customer satisfaction. We believe everyone deserves products that are as unique as they are.
                </p>
                <div className="flex items-center justify-center gap-6 mt-8">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-lg px-4 py-2">
                    <Star className="h-4 w-4 mr-2" />
                    Premium Quality
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-lg px-4 py-2">
                    <Globe className="h-4 w-4 mr-2" />
                    Global Reach
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-lg px-4 py-2">
                    <Heart className="h-4 w-4 mr-2" />
                    Customer First
                  </Badge>
                </div>
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
