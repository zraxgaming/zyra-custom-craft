
import React from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="hidden lg:flex lg:w-1/2 bg-zyra-purple p-12 flex-col justify-between">
        <div>
          <Link to="/" className="text-3xl font-bold text-white">ZYRA</Link>
          <h1 className="text-4xl font-bold text-white mt-12">
            Create custom products <br />
            that are uniquely yours
          </h1>
          <p className="text-white/80 mt-4 text-lg max-w-md">
            Join our community of creative customers and design personalized gifts that stand out.
          </p>
        </div>
        <div className="text-white/70 text-sm">
          © {new Date().getFullYear()} Zyra Custom Crafts. All rights reserved.
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link to="/" className="text-3xl font-bold text-zyra-purple">ZYRA</Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
