
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Mail, Lock, User, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import SEOHead from "@/components/seo/SEOHead";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Account created successfully",
        description: "Welcome to Zyra!",
      });
      
      navigate("/");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <SEOHead 
        title="Create Account - Zyra"
        description="Join Zyra today and start customizing amazing products. Create your account to unlock personalized shopping experience."
        url="https://shopzyra.vercel.app/auth"
      />
      <Navbar />
      <div className="min-h-screen bg-background flex items-center justify-center py-12">
        {/* Premium Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="register-pattern" x="0" y="0" width="90" height="90" patternUnits="userSpaceOnUse">
                <polygon points="45,10 70,35 45,60 20,35" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
                <circle cx="45" cy="35" r="10" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.4"/>
                <circle cx="45" cy="35" r="3" fill="currentColor" opacity="0.2"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#register-pattern)"/>
          </svg>
        </div>

        <Container className="relative z-10">
          <div className="max-w-md mx-auto">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-2xl animate-scale-in">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-primary/10 to-purple-500/10 p-4 rounded-2xl border border-primary/20">
                    <UserPlus className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Create Account
                </CardTitle>
                <p className="text-muted-foreground">Join Zyra and start customizing</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
                      <Label htmlFor="firstName" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                        className="bg-background/50 border-border/50 focus:border-primary transition-colors"
                      />
                    </div>
                    
                    <div className="space-y-2 animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                        className="bg-background/50 border-border/50 focus:border-primary transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      className="bg-background/50 border-border/50 focus:border-primary transition-colors"
                    />
                  </div>
                  
                  <div className="space-y-2 animate-slide-in-left" style={{ animationDelay: '0.3s' }}>
                    <Label htmlFor="password" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                      className="bg-background/50 border-border/50 focus:border-primary transition-colors"
                    />
                  </div>
                  
                  <div className="space-y-2 animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      required
                      className="bg-background/50 border-border/50 focus:border-primary transition-colors"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300 animate-fade-in group" 
                    disabled={isLoading}
                    style={{ animationDelay: '0.5s' }}
                  >
                    {isLoading ? (
                      "Creating account..."
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
                
                <div className="mt-6 text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
                  <p className="text-muted-foreground">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary hover:underline font-medium">
                      Sign in
                    </Link>
                  </p>
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

export default Register;
