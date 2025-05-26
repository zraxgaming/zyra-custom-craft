
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Clock, Send, Sparkles, MessageCircle } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          status: 'open'
        });

      if (error) throw error;

      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });

      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error: any) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "support@zyra.com",
      subtitle: "We typically respond within 24 hours",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+1 (555) 123-4567",
      subtitle: "Monday - Friday, 9AM - 6PM EST",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      content: "123 Premium Street\nSuite 100\nNew York, NY 10001",
      subtitle: "",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM\nSunday: Closed",
      subtitle: "",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <>
      <SEOHead 
        title="Contact Us - Zyra"
        description="Get in touch with our team. We're here to help with any questions about our products or services."
        url="https://zyra.lovable.app/contact"
      />
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-purple-500/10 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-primary to-purple-500 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-40 right-10 w-80 h-80 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full blur-3xl animate-float-reverse"></div>
        </div>

        <Container className="py-12 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16 animate-fade-in">
              <div className="relative mb-8">
                <Badge className="mb-6 bg-gradient-to-r from-primary to-purple-600 hover:scale-110 transition-transform duration-300 text-lg px-6 py-3" variant="outline">
                  <MessageCircle className="h-5 w-5 mr-3" />
                  Get in Touch
                </Badge>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-scale-in">
                Contact Us
              </h1>
              <p className="text-xl text-muted-foreground animate-slide-in-right">
                We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card className="hover:shadow-2xl transition-all duration-500 animate-slide-in-left bg-card/60 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl">
                      <Send className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Send us a message</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          required
                          className="hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          required
                          className="hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-sm font-medium">Subject</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                        required
                        className="hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-medium">Message</Label>
                      <Textarea
                        id="message"
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        required
                        className="hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-primary to-purple-600 hover:scale-105 transition-all duration-300 hover:shadow-lg" 
                      disabled={isSubmitting}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-6 animate-slide-in-right">
                {contactInfo.map((info, index) => (
                  <Card 
                    key={index}
                    className="hover:shadow-2xl hover:scale-105 transition-all duration-500 bg-card/60 backdrop-blur-sm border-border/50 overflow-hidden"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6 relative">
                      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${info.color} opacity-10 rounded-full blur-2xl`}></div>
                      <div className="flex items-start gap-4 relative">
                        <div className={`p-3 rounded-2xl bg-gradient-to-br ${info.color} bg-opacity-20 hover:rotate-12 transition-transform duration-300`}>
                          <info.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2 text-foreground">{info.title}</h3>
                          <p className="text-muted-foreground whitespace-pre-line mb-1">{info.content}</p>
                          {info.subtitle && (
                            <p className="text-sm text-muted-foreground">{info.subtitle}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <Card className="mt-16 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 border-primary/30 hover:shadow-2xl transition-all duration-500 animate-bounce-in backdrop-blur-sm">
              <CardContent className="p-12 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 animate-pulse"></div>
                <div className="relative">
                  <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Need Immediate Help?
                  </h3>
                  <p className="text-muted-foreground mb-8 text-xl max-w-2xl mx-auto">
                    Our customer support team is here to assist you with any questions or concerns.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Button 
                      className="inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-primary to-purple-600 text-primary-foreground rounded-2xl font-semibold text-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
                    >
                      <Phone className="h-5 w-5 mr-2" />
                      Call Now
                    </Button>
                    <Button 
                      variant="outline"
                      className="inline-flex items-center justify-center px-10 py-4 border-2 border-primary/30 text-foreground rounded-2xl font-semibold text-lg hover:scale-105 hover:shadow-2xl hover:bg-primary/10 transition-all duration-300"
                    >
                      <Mail className="h-5 w-5 mr-2" />
                      Email Us
                    </Button>
                  </div>
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

export default Contact;
