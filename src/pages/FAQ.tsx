
import React, { useState } from "react";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, HelpCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const faqCategories = {
    general: {
      title: "General",
      faqs: [
        {
          question: "What is Zyra?",
          answer: "Zyra is a custom e-commerce platform where you can purchase ready-made products or create custom designs for personalized items."
        },
        {
          question: "How do I create an account?",
          answer: "Click the 'Sign Up' button in the top right corner and follow the registration process. You can also sign up using your Google account."
        },
        {
          question: "Is my personal information secure?",
          answer: "Yes, we use industry-standard encryption and security measures to protect your personal information and payment details."
        }
      ]
    },
    orders: {
      title: "Orders & Shipping",
      faqs: [
        {
          question: "How do I track my order?",
          answer: "You can track your order by visiting the 'My Orders' section in your account or using our order tracking page with your order ID."
        },
        {
          question: "What are the shipping options?",
          answer: "We offer standard shipping (3-5 business days) and express shipping (1-2 business days). Shipping costs vary by location and method."
        },
        {
          question: "Can I change or cancel my order?",
          answer: "Orders can be modified or cancelled within 1 hour of placement. After that, please contact our support team for assistance."
        },
        {
          question: "Do you ship internationally?",
          answer: "Yes, we ship to most countries worldwide. International shipping times and costs vary by destination."
        }
      ]
    },
    customization: {
      title: "Customization",
      faqs: [
        {
          question: "How does product customization work?",
          answer: "Select a customizable product, click 'Customize', then use our design tool to add text, images, or modify colors. You'll see a live preview of your design."
        },
        {
          question: "What file formats can I upload?",
          answer: "We accept JPG, PNG, and SVG files for image uploads. Files should be high resolution for best print quality."
        },
        {
          question: "Can I save my designs for later?",
          answer: "Yes, your custom designs are automatically saved to your account and can be accessed anytime."
        },
        {
          question: "What if I need help with my design?",
          answer: "Our design team can assist you with complex customizations. Contact support with your requirements and we'll help bring your vision to life."
        }
      ]
    },
    payments: {
      title: "Payments & Billing",
      faqs: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept PayPal, Zina, and major credit cards. All payments are processed securely."
        },
        {
          question: "Can I use gift cards?",
          answer: "Yes, you can purchase and redeem gift cards during checkout. Gift cards never expire."
        },
        {
          question: "Do you offer refunds?",
          answer: "We offer refunds within 30 days of purchase for unused items in original condition. Custom items may have different return policies."
        },
        {
          question: "Are there any hidden fees?",
          answer: "No, all costs including taxes and shipping are clearly displayed during checkout. There are no hidden fees."
        }
      ]
    }
  };

  const filteredFAQs = Object.entries(faqCategories).reduce((acc, [key, category]) => {
    const filteredFaqs = category.faqs.filter(
      faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (filteredFaqs.length > 0) {
      acc[key] = { ...category, faqs: filteredFaqs };
    }
    
    return acc;
  }, {} as typeof faqCategories);

  return (
    <>
      <Navbar />
      <Container className="py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <HelpCircle className="h-16 w-16 text-zyra-purple mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
            <p className="text-gray-600">
              Find answers to common questions about Zyra
            </p>
          </div>

          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="customization">Customization</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>

            {Object.entries(filteredFAQs).map(([key, category]) => (
              <TabsContent key={key} value={key}>
                <Accordion type="single" collapsible className="w-full">
                  {category.faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`${key}-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            ))}
          </Tabs>

          {Object.keys(filteredFAQs).length === 0 && searchTerm && (
            <div className="text-center py-8">
              <p className="text-gray-500">No FAQs found matching your search.</p>
            </div>
          )}

          <div className="mt-12 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
            <h3 className="font-semibold mb-2">Still have questions?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <a href="/contact" className="text-zyra-purple hover:underline">
              Contact Support
            </a>
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default FAQ;
