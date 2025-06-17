import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { sendOrderEmail } from '@/utils/resend';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, Heart } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import ContactForm from "@/components/contact/ContactForm";

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
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: 'All fields required',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }
    setIsSubmitting(true);
    try {
      // Send to admin
      await sendOrderEmail({
        to: 'zainabusal113@gmail.com',
        subject: `Contact Form: ${formData.subject || 'No Subject'}`,
        html: `
<div style="font-family: 'Segoe UI', sans-serif; background: linear-gradient(to bottom right, #6c4dc1, #b974e6); padding: 24px; color: #ffffff;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; color: #333333; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);">
    <div style="background-color: #7c3aed; padding: 20px; text-align: center">
      <img src="https://shopzyra.vercel.app/favicon.ico" alt="Zyra Logo" style="height: 40px; margin-bottom: 8px" />
      <h2 style="margin: 0; font-size: 20px; color: #ffffff">📩 New Contact Message</h2>
    </div>
    <div style="padding: 24px; font-size: 15px">
      <p><strong>Name:</strong> ${formData.name}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Message:</strong><br>${formData.message}</p>
    </div>
    <div style="background-color: #f9f9f9; text-align: center; font-size: 13px; color: #888; padding: 16px;">
      Sent from <a href="mailto:${formData.email}" style="color: #7c3aed">${formData.email}</a>
    </div>
  </div>
</div>`
      });
      // Send thank you to user
      await sendOrderEmail({
        to: formData.email,
        subject: 'Thank you for contacting Zyra',
        html: `
<div style="font-family: 'Segoe UI', sans-serif; background: linear-gradient(to bottom right, #6c4dc1, #b974e6); padding: 24px; color: #ffffff;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; color: #333333; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);">
    <div style="background-color: #7c3aed; padding: 20px; text-align: center">
      <img src="https://shopzyra.vercel.app/favicon.ico" alt="Zyra Logo" style="height: 40px; margin-bottom: 8px" />
      <h2 style="margin: 0; font-size: 20px; color: #ffffff">Thank you for contacting Zyra!</h2>
    </div>
    <div style="padding: 24px; font-size: 15px">
      <p>Hi ${formData.name || 'there'},</p>
      <p>Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.</p>
      <p style="margin-top: 32px">– The Zyra Team</p>
    </div>
    <div style="background-color: #f9f9f9; text-align: center; font-size: 13px; color: #888; padding: 16px;">
      <a href="https://shopzyra.vercel.app" style="color: #7c3aed">shopzyra.com</a>
    </div>
  </div>
</div>`
      });
      toast({
        title: 'Message sent!',
        description: 'Your message has been sent. We will get back to you soon.',
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error: any) {
      toast({
        title: 'Failed to send',
        description: error.message || 'Could not send your message.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Our Store",
      content: ["123 Custom Street", "Design District", "Dubai, UAE 12345"],
      color: "from-purple-600 to-purple-700"
    },
    {
      icon: Phone,
      title: "Call Us",
      content: ["+971 55 759 7200", "Available 24/7"],
      color: "from-pink-600 to-pink-700"
    },
    {
      icon: Mail,
      title: "Email Us",
      content: ["hello@zyra.com", "support@zyra.com", "orders@zyra.com"],
      color: "from-indigo-600 to-indigo-700"
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: ["Mon - Fri: 9:00 - 18:00", "Sat: 10:00 - 16:00", "Sun: Closed"],
      color: "from-emerald-600 to-emerald-700"
    }
  ];

  return (
    <>
      <SEOHead 
        title="Contact Us - Zyra"
        description="Get in touch with Zyra's customer support team. We're here to help with your orders, customizations, and any questions you may have."
        url="https://shopzyra.vercel.app/contact"
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
        <Navbar />
        
        {/* Hero Section */}
        <section className="pt-20 pb-12">
          <Container>
            <div className="text-center mb-16 animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-full mb-8 animate-bounce-in shadow-2xl">
                <MessageSquare className="h-10 w-10 text-white animate-pulse" />
              </div>
              <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent animate-text-shimmer">
                Get in Touch
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-slide-in-up" style={{animationDelay: '0.2s'}}>
                Have a question, need support, or want to share feedback? We'd love to hear from you!
              </p>
              <div className="flex items-center justify-center gap-2 mt-6 animate-fade-in" style={{animationDelay: '0.4s'}}>
                <Heart className="h-5 w-5 text-red-500 animate-pulse" />
                <span className="text-sm text-gray-500 dark:text-gray-400">We typically respond within 2 hours</span>
              </div>
            </div>
          </Container>
        </section>

        {/* Contact Info Grid */}
        <section className="py-12">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {contactInfo.map((info, index) => (
                <Card key={index} className="text-center animate-scale-in hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm" style={{animationDelay: `${index * 0.1}s`}}>
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 bg-gradient-to-br ${info.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl animate-float`} style={{animationDelay: `${index * 0.5}s`}}>
                      <info.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{info.title}</h3>
                    <div className="space-y-2">
                      {info.content.map((line, lineIndex) => (
                        <p key={lineIndex} className="text-gray-600 dark:text-gray-400 text-sm">
                          {line}
                        </p>
                      ))}
                    </div>
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
              <Card className="animate-scale-in border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-2xl">
                <CardHeader className="text-center bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 rounded-t-lg">
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Send us a Message
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Fill out the form below and we'll get back to you as soon as possible
                  </p>
                </CardHeader>
                <CardContent className="p-8">
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </Container>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gradient-to-r from-purple-600/5 to-pink-600/5">
          <Container>
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Quick answers to common questions
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {[
                {
                  q: "How long does customization take?",
                  a: "Most customizations are completed within 2-3 business days. Complex designs may take up to 5 business days."
                },
                {
                  q: "Do you offer international shipping?",
                  a: "Yes! We ship worldwide. Shipping costs and delivery times vary by location."
                },
                {
                  q: "Can I cancel or modify my order?",
                  a: "Orders can be modified or cancelled within 2 hours of placement. After that, please contact us for assistance."
                },
                {
                  q: "What payment methods do you accept?",
                  a: "We accept all major credit cards, PayPal, and Ziina for customers in the UAE."
                }
              ].map((faq, index) => (
                <Card key={index} className="animate-scale-in hover:shadow-xl transition-all duration-300 border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm" style={{animationDelay: `${index * 0.1}s`}}>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">{faq.q}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
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

export default Contact;
