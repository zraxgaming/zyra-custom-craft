
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogIn, UserPlus, Mail, Lock, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Container } from "@/components/ui/container";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: ""
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  const referralCode = searchParams.get('ref');

  useEffect(() => {
    // If there's a referral code, show signup form by default
    if (referralCode) {
      setIsLogin(false);
      toast({
        title: "Welcome!",
        description: "You've been referred by a friend. Sign up to get your welcome bonus!",
      });
    }
  }, [referralCode, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        toast({
          title: "Welcome back!",
          description: "You have been logged in successfully.",
        });

        navigate(redirectTo);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              referral_code: referralCode
            }
          }
        });

        if (error) throw error;

        // If there's a referral code, create a referral record
        if (referralCode && data.user) {
          try {
            // Find the referrer
            const { data: referrer } = await supabase
              .from('referrals')
              .select('referrer_id')
              .eq('referral_code', referralCode)
              .single();

            if (referrer) {
              // Create a new referral record for the referred user
              await supabase
                .from('referrals')
                .insert({
                  referrer_id: referrer.referrer_id,
                  referred_id: data.user.id,
                  referral_code: referralCode,
                  status: 'pending'
                });
            }
          } catch (referralError) {
            console.error('Error processing referral:', referralError);
          }
        }

        toast({
          title: "Account created!",
          description: referralCode 
            ? "Please check your email to verify your account. You'll receive your referral bonus after verification!"
            : "Please check your email to verify your account.",
        });
      }
    } catch (error: any) {
      toast({
        title: isLogin ? "Login failed" : "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center py-12 animate-fade-in">
      <Container className="max-w-md">
        <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-2xl animate-scale-in">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-primary/10 to-purple-500/10 p-4 rounded-2xl border border-primary/20">
                {isLogin ? (
                  <LogIn className="h-8 w-8 text-primary" />
                ) : (
                  <UserPlus className="h-8 w-8 text-primary" />
                )}
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {isLogin ? "Welcome Back" : "Create Account"}
            </CardTitle>
            {referralCode && !isLogin && (
              <p className="text-sm text-green-600 font-medium">
                🎉 You've been referred! Get special bonuses when you join!
              </p>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">
                      <User className="h-4 w-4 inline mr-2" />
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      required={!isLogin}
                      className="animate-fade-in"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      required={!isLogin}
                      className="animate-fade-in"
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="animate-fade-in"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">
                  <Lock className="h-4 w-4 inline mr-2" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                  className="animate-fade-in"
                />
              </div>
              
              <Button type="submit" className="w-full animate-scale-in" disabled={isLoading}>
                {isLoading ? "Loading..." : (isLogin ? "Sign In" : "Create Account")}
              </Button>
            </form>
            
            <div className="mt-4 text-center">
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover-scale"
              >
                {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default AuthPage;
