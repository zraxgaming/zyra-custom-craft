
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail } from "lucide-react";
import { sendEmail, getNewsletterTemplate } from '@/utils/sendgrid';

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
      // Check if already subscribed
      const { data: existing } = await supabase
        .from("newsletter_subscriptions")
        .select("id, is_active")
        .eq("email", email)
        .single();

      if (existing) {
        if (existing.is_active) {
          toast({
            title: "Already subscribed",
            description: "This email is already subscribed to our newsletter.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        } else {
          // Reactivate subscription
          await supabase
            .from("newsletter_subscriptions")
            .update({
              is_active: true,
              name: name || null,
              unsubscribed_at: null,
              updated_at: new Date().toISOString()
            })
            .eq("id", existing.id);
        }
      } else {
        // Create new subscription
        const { error } = await supabase
          .from("newsletter_subscriptions")
          .insert({
            email,
            name: name || null,
            is_active: true,
            subscribed_at: new Date().toISOString(),
          });

        if (error) throw error;
      }

      // Send welcome email
      const welcomeContent = `
        <h2 style="color: #7c3aed;">Welcome to the Zyra Newsletter!</h2>
        <p>Thank you for subscribing, ${name || 'friend'}!</p>
        <p>You'll now receive updates about our latest products, special offers, and crafting inspiration.</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p><strong>What to expect:</strong></p>
          <ul>
            <li>🎨 Latest custom craft designs</li>
            <li>💰 Exclusive subscriber discounts</li>
            <li>📚 Crafting tips and tutorials</li>
            <li>🎉 Early access to new products</li>
          </ul>
        </div>
      `;

      await sendEmail({
        to: email,
        subject: 'Welcome to Zyra Custom Craft!',
        html: getNewsletterTemplate(welcomeContent, 'Welcome to Zyra Custom Craft!')
          .replace('{{email}}', encodeURIComponent(email))
      });

      // Send admin notification
      await sendEmail({
        to: 'zainabusal113@gmail.com',
        subject: 'New Newsletter Subscription',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>📰 New Newsletter Subscriber</h2>
            <p><strong>Email:</strong> ${email}</p>
            ${name ? `<p><strong>Name:</strong> ${name}</p>` : ''}
            <p><strong>Subscribed at:</strong> ${new Date().toLocaleString()}</p>
          </div>
        `
      });

      toast({
        title: "Successfully subscribed!",
        description: "Welcome to our newsletter! Check your email for confirmation.",
      });
      
      setEmail("");
      setName("");
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);
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
      
      <p className="text-xs text-muted-foreground text-center">
        By subscribing, you agree to receive marketing emails. You can unsubscribe at any time.
      </p>
    </form>
  );
};

export default NewsletterSignup;
