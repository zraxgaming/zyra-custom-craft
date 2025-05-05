
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-zyra-purple to-zyra-dark-purple rounded-2xl overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Create Your <br />Custom Product?
              </h2>
              <p className="text-white/90 mb-8 text-lg max-w-md">
                Express yourself with high-quality customized items. Our easy design
                tools help you create exactly what you want.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-white hover:bg-gray-100 text-zyra-purple font-medium">
                  <Link to="/shop">Browse Products</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-transparent hover:bg-white/10 text-white border-white font-medium">
                  <Link to="/customize" className="flex items-center gap-2">
                    Start Designing <ArrowRight size={16} />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-zyra-dark-purple/40"></div>
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&auto=format&fit=crop&q=60"
                alt="Custom products"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
