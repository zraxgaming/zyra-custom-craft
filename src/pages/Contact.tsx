
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, Phone, MapPin, Send, Clock, MessageCircle } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

const Contact = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: user?.email || '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          user_id: user?.id || null,
        });

      if (error) throw error;

      toast({
        title: "Message Sent Successfully!",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });

      setFormData({
        name: '',
        email: user?.email || '',
        subject: '',
        message: ''
      });
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help from our support team",
      contact: "support@zyra.com",
      color: "from-blue-500 to-purple-500"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our team",
      contact: "+1 (555) 123-4567",
      color: "from-green-500 to-blue-500"
    },
    {
      icon: MapPin,
      title: "Office Location",
      description: "Visit our headquarters",
      contact: "123 Innovation Drive, Tech City, TC 12345",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Clock,
      title: "Support Hours",
      description: "When we're available to help",
      contact: "Mon-Fri: 9AM-6PM EST",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <>
      <SEOHead 
        title="Contact Us - Zyra Support"
        description="Get in touch with Zyra's support team. We're here to help with your questions, orders, and customization needs."
        url="https://zyra.lovable.app/contact"
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
        <Navbar />
        
        {/* Hero Section */}
        <section className="py-20">
          <Container>
            <div className="text-center mb-16 animate-fade-in">
              <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent animate-text-shimmer">
                Get in Touch
              </h1>
              <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-slide-in-up" style={{animationDelay: '0.2s'}}>
                Have questions? Need help with an order? Want to collaborate? We'd love to hear from you.
              </p>
            </div>
          </Container>
        </section>

        {/* Contact Info Cards */}
        <section className="py-12">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {contactInfo.map((info, index) => (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-scale-in border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm" style={{animationDelay: `${index * 0.1}s`}}>
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${info.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <info.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {info.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {info.description}
                    </p>
                    <p className="text-purple-600 dark:text-purple-400 font-medium">
                      {info.contact}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        {/* Contact Form */}
        <section className="py-12">
          <Container>
            <div className="max-w-4xl mx-auto">
              <Card className="animate-slide-in-up border-0 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                <CardHeader className="text-center bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-in">
                    <MessageCircle className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-3xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Send us a Message
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="animate-slide-in-left" style={{animationDelay: '0.1s'}}>
                        <Label htmlFor="name" className="text-base font-semibold text-gray-900 dark:text-white">
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="mt-2 h-12 bg-white/80 dark:bg-gray-800/80 border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 transition-all duration-300"
                          placeholder="Your full name"
                        />
                      </div>
                      <div className="animate-slide-in-right" style={{animationDelay: '0.2s'}}>
                        <Label htmlFor="email" className="text-base font-semibold text-gray-900 dark:text-white">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="mt-2 h-12 bg-white/80 dark:bg-gray-800/80 border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 transition-all duration-300"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                    
                    <div className="animate-slide-in-up" style={{animationDelay: '0.3s'}}>
                      <Label htmlFor="subject" className="text-base font-semibold text-gray-900 dark:text-white">
                        Subject *
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="mt-2 h-12 bg-white/80 dark:bg-gray-800/80 border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 transition-all duration-300"
                        placeholder="What's this about?"
                      />
                    </div>
                    
                    <div className="animate-slide-in-up" style={{animationDelay: '0.4s'}}>
                      <Label htmlFor="message" className="text-base font-semibold text-gray-900 dark:text-white">
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="mt-2 bg-white/80 dark:bg-gray-800/80 border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 transition-all duration-300 resize-none"
                        placeholder="Tell us more about how we can help you..."
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-14 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 hover:from-purple-700 hover:via-purple-800 hover:to-pink-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] animate-bounce-in"
                      style={{animationDelay: '0.5s'}}
                    >
                      {loading ? (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Sending Message...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <Send className="h-5 w-5" />
                          <span>Send Message</span>
                        </div>
                      )}
                    </Button>
                  </form>
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

export default Contact;
