
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";

const Account = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Container className="py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-foreground">My Account</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Profile Information</h2>
              <p className="text-muted-foreground">Manage your account details and preferences.</p>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Order History</h2>
              <p className="text-muted-foreground">View your past orders and their status.</p>
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default Account;
