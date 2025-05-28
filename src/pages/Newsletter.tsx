
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Container } from '@/components/ui/container';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async () => {
    if (!email) {
      toast({
        title: 'Error',
        description: 'Please enter your email address',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      await fetch('https://hooks.zapier.com/hooks/catch/18195840/2jeyebc/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors',
        body: JSON.stringify({
          type: 'newsletter_subscription',
          email: email,
          subscribed_at: new Date().toISOString()
        })
      });

      toast({ 
        title: 'Subscribed!', 
        description: 'You have been added to our newsletter.' 
      });
      setEmail('');
    } catch (e: any) {
      toast({ 
        title: 'Error', 
        description: 'Subscription failed. Please try again.', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <Container className="py-12">
        <div className="max-w-lg mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Subscribe to our Newsletter</CardTitle>
              <p className="text-center text-muted-foreground">
                Stay updated with our latest products and offers
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={loading}
                />
                <Button onClick={handleSubscribe} disabled={loading || !email}>
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
      
      <Footer />
    </div>
  );
};

export default Newsletter;
