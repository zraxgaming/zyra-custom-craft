
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail } from "lucide-react";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("newsletter_subscriptions")
        .insert({
          email,
          name: name || null,
          is_active: true,
          subscribed_at: new Date().toISOString(),
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already subscribed",
            description: "This email is already subscribed to our newsletter.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Successfully subscribed!",
          description: "Thank you for subscribing to our newsletter.",
        });
        setEmail("");
        setName("");
      }
    } catch (error: any) {
      toast({
        title: "Subscription failed",
        description: error.message || "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="newsletter-name" className="text-foreground">Name (Optional)</Label>
        <Input
          id="newsletter-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="bg-background text-foreground border-border"
        />
      </div>
      
      <div>
        <Label htmlFor="newsletter-email" className="text-foreground">Email Address</Label>
        <Input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          required
          className="bg-background text-foreground border-border"
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isLoading ? (
          "Subscribing..."
        ) : (
          <>
            <Mail className="w-4 h-4 mr-2" />
            Subscribe to Newsletter
          </>
        )}
      </Button>
    </form>
  );
};

export default NewsletterSignup;
