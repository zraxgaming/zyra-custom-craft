
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";

const Wishlist = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Container className="py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-foreground">My Wishlist</h1>
          <div className="bg-card p-6 rounded-lg border border-border">
            <p className="text-muted-foreground">Your wishlist is empty. Start adding products you love!</p>
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default Wishlist;
