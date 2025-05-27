
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, User, Sparkles, Chrome } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";

const EnhancedAuthPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await signIn(formData.email, formData.password);
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await signUp(formData.email, formData.password, {
        first_name: formData.firstName,
        last_name: formData.lastName
      });
    } catch (error) {
      console.error('Sign up error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google sign in error:', error);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20 py-12">
        <Container>
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8 animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-full mb-6 animate-bounce-in shadow-2xl">
                <Sparkles className="h-10 w-10 text-white animate-pulse" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent mb-4 animate-text-shimmer">
                Welcome to Zyra
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 animate-slide-in-up">
                Create beautiful, custom products with ease
              </p>
            </div>

            <Card className="animate-scale-in shadow-2xl border-purple-200/50 dark:border-purple-800/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-50 via-white to-pink-50 dark:from-purple-950/50 dark:via-gray-800 dark:to-pink-950/50 border-b border-purple-200/30 dark:border-purple-800/30">
                <CardTitle className="text-center text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Authentication
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {/* Google Sign In Button */}
                <Button
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  variant="outline"
                  className="w-full mb-6 h-12 border-2 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all duration-300 animate-slide-in-up"
                >
                  {googleLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600 mr-3"></div>
                  ) : (
                    <Chrome className="h-5 w-5 mr-3 text-purple-600" />
                  )}
                  <span className="font-medium">Continue with Google</span>
                </Button>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300 dark:border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-gray-900 text-gray-500">Or continue with email</span>
                  </div>
                </div>

                <Tabs defaultValue="signin" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-2 bg-purple-100 dark:bg-purple-900/30">
                    <TabsTrigger value="signin" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger value="signup" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                      Sign Up
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="signin" className="space-y-6 animate-slide-in-left">
                    <form onSubmit={handleSignIn} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email" className="flex items-center gap-2 font-medium">
                          <Mail className="h-4 w-4 text-purple-600" />
                          Email
                        </Label>
                        <Input
                          id="signin-email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="Enter your email"
                          className="h-12 border-2 border-purple-200 dark:border-purple-800 focus:border-purple-500 dark:focus:border-purple-400 transition-all duration-300"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signin-password" className="flex items-center gap-2 font-medium">
                          <Lock className="h-4 w-4 text-purple-600" />
                          Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="signin-password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            placeholder="Enter your password"
                            className="h-12 border-2 border-purple-200 dark:border-purple-800 focus:border-purple-500 dark:focus:border-purple-400 transition-all duration-300 pr-12"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {loading ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        ) : null}
                        Sign In
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-6 animate-slide-in-right">
                    <form onSubmit={handleSignUp} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first-name" className="flex items-center gap-2 font-medium">
                            <User className="h-4 w-4 text-purple-600" />
                            First Name
                          </Label>
                          <Input
                            id="first-name"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            placeholder="John"
                            className="h-12 border-2 border-purple-200 dark:border-purple-800 focus:border-purple-500 dark:focus:border-purple-400 transition-all duration-300"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-name" className="font-medium">
                            Last Name
                          </Label>
                          <Input
                            id="last-name"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            placeholder="Doe"
                            className="h-12 border-2 border-purple-200 dark:border-purple-800 focus:border-purple-500 dark:focus:border-purple-400 transition-all duration-300"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="flex items-center gap-2 font-medium">
                          <Mail className="h-4 w-4 text-purple-600" />
                          Email
                        </Label>
                        <Input
                          id="signup-email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="Enter your email"
                          className="h-12 border-2 border-purple-200 dark:border-purple-800 focus:border-purple-500 dark:focus:border-purple-400 transition-all duration-300"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="flex items-center gap-2 font-medium">
                          <Lock className="h-4 w-4 text-purple-600" />
                          Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="signup-password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            placeholder="Create a password"
                            className="h-12 border-2 border-purple-200 dark:border-purple-800 focus:border-purple-500 dark:focus:border-purple-400 transition-all duration-300 pr-12"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {loading ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        ) : null}
                        Create Account
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default EnhancedAuthPage;
