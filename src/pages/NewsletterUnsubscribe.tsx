
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/seo/SEOHead';

const NewsletterUnsubscribe = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Add to unsubscribe table
      const { error: unsubError } = await supabase
        .from('newsletter_unsubscribes')
        .insert({
          email: email.toLowerCase(),
          reason: reason || null
        });

      if (unsubError && unsubError.code !== '23505') { // Ignore unique constraint violations
        throw unsubError;
      }

      // Update subscription status
      const { error: updateError } = await supabase
        .from('newsletter_subscriptions')
        .update({
          is_active: false,
          unsubscribed_at: new Date().toISOString()
        })
        .eq('email', email.toLowerCase());

      if (updateError) {
        console.warn('Update subscription error:', updateError);
      }

      setIsUnsubscribed(true);
      toast({
        title: "Unsubscribed",
        description: "You have been successfully unsubscribed from our newsletter."
      });
    } catch (error: any) {
      console.error('Unsubscribe error:', error);
      toast({
        title: "Error",
        description: "Failed to unsubscribe. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead 
        title="Unsubscribe from Newsletter | Zyra Custom Craft"
        description="Unsubscribe from Zyra Custom Craft newsletter updates and promotional emails."
        url="https://shopzyra.vercel.app/newsletter/unsubscribe"
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-muted rounded-full w-fit">
                  {isUnsubscribed ? (
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  ) : (
                    <Mail className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <CardTitle>
                  {isUnsubscribed ? 'Successfully Unsubscribed' : 'Unsubscribe from Newsletter'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isUnsubscribed ? (
                  <div className="text-center space-y-4">
                    <p className="text-muted-foreground">
                      You have been successfully unsubscribed from our newsletter. 
                      You will no longer receive promotional emails from us.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      If you change your mind, you can always subscribe again on our website.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleUnsubscribe} className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="reason">Reason (Optional)</Label>
                      <Textarea
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Tell us why you're unsubscribing..."
                        rows={3}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Unsubscribing..." : "Unsubscribe"}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      We're sorry to see you go. Your feedback helps us improve our content.
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default NewsletterUnsubscribe;
