
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle, Mail, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import SEOHead from "@/components/seo/SEOHead";
import { Link } from "react-router-dom";

const Unsubscribe = () => {
  const { userId } = useParams();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const [isLoading, setIsLoading] = useState(true);
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    handleUnsubscribe();
  }, [userId, email]);

  const handleUnsubscribe = async () => {
    if (!userId && !email) {
      setError("Invalid unsubscribe link");
      setIsLoading(false);
      return;
    }

    try {
      let query = supabase
        .from('newsletter_subscriptions')
        .update({ 
          is_active: false, 
          unsubscribed_at: new Date().toISOString() 
        });

      if (userId) {
        // If user ID is provided, use it to find the subscription
        const { data: profile } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', userId)
          .single();
        
        if (profile?.email) {
          query = query.eq('email', profile.email);
        } else {
          throw new Error("User not found");
        }
      } else if (email) {
        // If email is provided directly
        query = query.eq('email', email);
      }

      const { error } = await query;

      if (error) throw error;

      setIsUnsubscribed(true);
      toast({
        title: "Successfully Unsubscribed",
        description: "You have been removed from our newsletter.",
      });

    } catch (error: any) {
      console.error('Unsubscribe error:', error);
      setError(error.message || "Failed to unsubscribe");
      toast({
        title: "Unsubscribe Failed",
        description: error.message || "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEOHead 
        title="Unsubscribe - Zyra Custom Craft"
        description="Unsubscribe from Zyra Custom Craft newsletter"
        url="https://shopzyra.vercel.app/unsubscribe"
      />
      <Navbar />
      <div className="min-h-screen bg-background py-16">
        <Container>
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg border-0">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  ) : isUnsubscribed ? (
                    <CheckCircle className="h-12 w-12 text-green-500" />
                  ) : (
                    <XCircle className="h-12 w-12 text-red-500" />
                  )}
                </div>
                <CardTitle className="text-2xl">
                  {isLoading 
                    ? "Processing..." 
                    : isUnsubscribed 
                      ? "Successfully Unsubscribed" 
                      : "Unsubscribe Failed"
                  }
                </CardTitle>
              </CardHeader>
              
              <CardContent className="text-center space-y-6">
                {isLoading ? (
                  <p className="text-muted-foreground">
                    We're processing your unsubscribe request...
                  </p>
                ) : isUnsubscribed ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <Mail className="h-5 w-5" />
                      <span>You've been removed from our newsletter</span>
                    </div>
                    <p className="text-muted-foreground">
                      We're sorry to see you go! You will no longer receive marketing emails from Zyra Custom Craft.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      You may still receive transactional emails related to your orders and account.
                    </p>
                    <div className="pt-4">
                      <p className="text-sm mb-4">Changed your mind?</p>
                      <Link to="/newsletter">
                        <Button variant="outline">
                          <Mail className="h-4 w-4 mr-2" />
                          Subscribe Again
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-red-600 font-medium">
                      {error || "Unable to process unsubscribe request"}
                    </p>
                    <p className="text-muted-foreground">
                      Please contact our support team if you continue to have issues.
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Link to="/contact">
                        <Button variant="outline">
                          Contact Support
                        </Button>
                      </Link>
                      <Button onClick={handleUnsubscribe}>
                        Try Again
                      </Button>
                    </div>
                  </div>
                )}

                <div className="pt-6 border-t border-border">
                  <Link to="/">
                    <Button variant="ghost" className="text-muted-foreground">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Return to Homepage
                    </Button>
                  </Link>
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

export default Unsubscribe;
