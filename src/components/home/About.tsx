
import React from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { CheckCircle, Star, Award, Users } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  "Premium quality materials",
  "Fast turnaround times",
  "Custom design services",
  "Bulk order discounts",
  "Worldwide shipping",
  "24/7 customer support"
];

const stats = [
  { icon: Users, value: "10,000+", label: "Happy Customers" },
  { icon: Star, value: "4.9/5", label: "Customer Rating" },
  { icon: Award, value: "50+", label: "Design Awards" },
  { icon: CheckCircle, value: "99%", label: "On-Time Delivery" }
];

const About = () => {
  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="animate-slide-in-left">
            <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              Why Choose Zyra Custom Craft?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              We're passionate about bringing your ideas to life with exceptional quality and service. 
              Our team of experts uses cutting-edge technology to create custom products that exceed expectations.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/about">
                Learn More About Us
              </Link>
            </Button>
          </div>

          <div className="animate-slide-in-right">
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-xl animate-scale-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default About;
