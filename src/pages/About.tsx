
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, Users, Award, Heart, Sparkles, Star, Target, Lightbulb, Shield } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

const About = () => {
  const teamMembers = [
    {
      name: "Sarah Ahmed",
      role: "Founder & Creative Director",
      image: "https://images.unsplash.com/photo-1494790108755-2616b812035e?w=150&h=150&fit=crop&crop=face",
      bio: "Passionate about bringing creativity to life through custom crafts"
    },
    {
      name: "Mohammed Ali",
      role: "Production Manager",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      bio: "Ensuring every product meets our high quality standards"
    },
    {
      name: "Fatima Hassan",
      role: "Design Specialist",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      bio: "Creating beautiful designs that tell your unique story"
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion",
      description: "We love what we do and it shows in every piece we create",
      color: "text-red-500"
    },
    {
      icon: Star,
      title: "Quality",
      description: "Premium materials and meticulous attention to detail",
      color: "text-yellow-500"
    },
    {
      icon: Target,
      title: "Precision",
      description: "Every customization is crafted with accuracy and care",
      color: "text-blue-500"
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Constantly exploring new techniques and technologies",
      color: "text-green-500"
    },
    {
      icon: Shield,
      title: "Trust",
      description: "Building lasting relationships through reliability",
      color: "text-purple-500"
    },
    {
      icon: Users,
      title: "Community",
      description: "Supporting our customers' creative journeys",
      color: "text-pink-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900">
      <SEOHead 
        title="About Us - Zyra Custom Craft"
        description="Learn about Zyra Custom Craft, our story, team, and commitment to creating premium personalized products in Dubai, UAE."
        keywords="about us, custom craft company, Dubai, UAE, personalized products, team"
      />
      <Navbar />
      
      <div className="py-16 animate-fade-in">
        <Container>
          {/* Hero Section */}
          <div className="text-center mb-20 animate-slide-in-up">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="h-12 w-12 text-purple-600 animate-spin-slow" />
              <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-text-shimmer">
                About Zyra
              </h1>
              <Heart className="h-12 w-12 text-pink-500 animate-pulse" />
            </div>
            <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed animate-fade-in-delay">
              Crafting memories, one personalized piece at a time. We're passionate about bringing your creative visions to life through premium custom products.
            </p>
          </div>

          {/* Story Section */}
          <div className="grid lg:grid-cols-2 gap-16 mb-20 items-center">
            <div className="space-y-8 animate-slide-in-left">
              <div>
                <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 text-lg animate-bounce">
                  Our Story
                </Badge>
                <h2 className="text-4xl font-bold mb-6 text-gray-800 dark:text-gray-200 animate-fade-in">
                  From Vision to Reality
                </h2>
                <div className="space-y-4 text-lg text-gray-600 dark:text-gray-400">
                  <p className="animate-fade-in" style={{animationDelay: '200ms'}}>
                    Founded in 2020 in the heart of Dubai, Zyra Custom Craft began as a dream to make personalization accessible to everyone. What started as a small workshop has grown into a leading custom craft studio.
                  </p>
                  <p className="animate-fade-in" style={{animationDelay: '400ms'}}>
                    We believe that every product should tell a story - your story. Whether it's a personalized gift for a loved one or custom branding for your business, we're here to make it extraordinary.
                  </p>
                  <p className="animate-fade-in" style={{animationDelay: '600ms'}}>
                    Today, we're proud to serve customers across the UAE and beyond, creating unique pieces that celebrate life's special moments.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative animate-slide-in-right">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop"
                alt="Our Workshop"
                className="relative w-full h-96 object-cover rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-20">
            <div className="text-center mb-16 animate-slide-in-up">
              <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 text-lg animate-bounce">
                Our Values
              </Badge>
              <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200 animate-fade-in">
                What Drives Us
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <Card 
                  key={index} 
                  className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-fade-in group"
                  style={{animationDelay: `${index * 100}ms`}}
                >
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 mx-auto mb-6 ${value.color} group-hover:scale-110 transition-transform duration-300`}>
                      <value.icon className="w-full h-full animate-float" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-20">
            <div className="text-center mb-16 animate-slide-in-up">
              <Badge className="mb-4 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-2 text-lg animate-bounce">
                Our Team
              </Badge>
              <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200 animate-fade-in">
                Meet the Creators
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <Card 
                  key={index} 
                  className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-slide-in-up group"
                  style={{animationDelay: `${index * 150}ms`}}
                >
                  <CardContent className="p-8 text-center">
                    <div className="relative w-32 h-32 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-lg opacity-20 animate-pulse"></div>
                      <img
                        src={member.image}
                        alt={member.name}
                        className="relative w-full h-full object-cover rounded-full border-4 border-white shadow-lg"
                      />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">
                      {member.name}
                    </h3>
                    <p className="text-purple-600 dark:text-purple-400 font-medium mb-4">
                      {member.role}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Location & Contact */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Map */}
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl animate-slide-in-left overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-96">
                  <iframe
                    src="https://maps.google.com/maps?q=Warsan+City+Building,+International+City+Phase+2,+Dubai,+UAE&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg"
                  ></iframe>
                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-red-500 animate-bounce" />
                      <span className="font-medium text-gray-800 dark:text-gray-200">Our Location</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-8 animate-slide-in-right">
              <div>
                <Badge className="mb-4 bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-2 text-lg animate-bounce">
                  Visit Us
                </Badge>
                <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200 animate-fade-in">
                  Get in Touch
                </h2>
              </div>

              <div className="space-y-6">
                {[
                  {
                    icon: MapPin,
                    title: "Address",
                    content: "Warsan City Building\nInternational City Phase 2\nDubai, UAE",
                    color: "text-red-500"
                  },
                  {
                    icon: Phone,
                    title: "Phone",
                    content: "+971 50 123 4567",
                    color: "text-green-500"
                  },
                  {
                    icon: Mail,
                    title: "Email",
                    content: "info@zyracustomcraft.com",
                    color: "text-blue-500"
                  },
                  {
                    icon: Clock,
                    title: "Hours",
                    content: "Sun - Thu: 9:00 AM - 10:00 PM\nFri - Sat: 9:00 AM - 11:00 PM",
                    color: "text-purple-500"
                  }
                ].map((item, index) => (
                  <Card 
                    key={index}
                    className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in"
                    style={{animationDelay: `${index * 100}ms`}}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 ${item.color} flex-shrink-0 animate-pulse`}>
                          <item.icon className="w-full h-full" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-200">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                            {item.content}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-bounce-in">
                <MapPin className="h-5 w-5 mr-2" />
                Get Directions
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "5000+", label: "Happy Customers", icon: Users },
              { number: "15000+", label: "Products Created", icon: Award },
              { number: "4.9", label: "Average Rating", icon: Star },
              { number: "3+", label: "Years Experience", icon: Clock }
            ].map((stat, index) => (
              <Card 
                key={index}
                className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 border-purple-200 dark:border-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-scale-in"
                style={{animationDelay: `${index * 100}ms`}}
              >
                <CardContent className="p-6">
                  <stat.icon className="w-12 h-12 mx-auto mb-4 text-purple-600 animate-bounce" />
                  <div className="text-3xl font-bold text-purple-700 dark:text-purple-300 mb-2 animate-number-count">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </div>
      
      <Footer />
    </div>
  );
};

export default About;
