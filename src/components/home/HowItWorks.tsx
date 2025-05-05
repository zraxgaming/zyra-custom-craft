
import React from "react";
import { Check } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Choose a Product",
    description:
      "Browse our collection of customizable products and select the one that fits your needs.",
    icon: "📦",
  },
  {
    id: 2,
    title: "Design It",
    description:
      "Use our intuitive design tool to add text, upload images, and arrange everything just right.",
    icon: "🎨",
  },
  {
    id: 3,
    title: "Preview",
    description:
      "See a realistic preview of your creation before finalizing your purchase.",
    icon: "👁️",
  },
  {
    id: 4,
    title: "Order & Enjoy",
    description:
      "Complete your purchase and we'll handle the rest. Your custom product will be delivered straight to your door.",
    icon: "🚚",
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          <p className="mt-2 text-gray-600">
            Create your custom product in just a few simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                <span className="flex items-center justify-center w-6 h-6 bg-zyra-purple rounded-full text-white text-xs mr-2">
                  {step.id}
                </span>
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-zyra-purple to-zyra-dark-purple rounded-xl p-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <h3 className="text-2xl font-bold mb-4">Why Choose Zyra?</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>High-quality materials for durable products</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Easy-to-use customization tools</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Fast production and shipping</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>100% satisfaction guarantee</span>
                </li>
              </ul>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&auto=format&fit=crop&q=60" 
                alt="Customer with custom product" 
                className="rounded-lg w-full h-64 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
