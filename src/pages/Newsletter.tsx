import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { sendOrderEmail } from '@/utils/resend';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      await sendOrderEmail({
        to: 'zainabusal113@gmail.com',
        subject: 'New Newsletter Subscription',
        html: `
<div style="font-family: 'Segoe UI', sans-serif; background: linear-gradient(to bottom right, #6c4dc1, #b974e6); padding: 24px; color: #ffffff;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; color: #333333; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);">
    <div style="background-color: #7c3aed; padding: 20px; text-align: center">
      <img src="https://shopzyra.vercel.app/favicon.ico" alt="Zyra Logo" style="height: 40px; margin-bottom: 8px" />
      <h2 style="margin: 0; font-size: 20px; color: #ffffff">📰 New Newsletter Subscriber</h2>
    </div>
    <div style="padding: 24px; font-size: 15px">
      <p><strong>Email:</strong> ${email}</p>
    </div>
    <div style="background-color: #f9f9f9; text-align: center; font-size: 13px; color: #888; padding: 16px;">
      Sent from <a href="mailto:${email}" style="color: #7c3aed">${email}</a>
    </div>
  </div>
</div>`
      });
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Subscribed!', description: 'You have been added to our newsletter.' });
        setEmail('');
      } else {
        throw new Error(data.error || 'Subscription failed');
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12">
      <Card>
        <CardHeader>
          <CardTitle>Subscribe to our Newsletter</CardTitle>
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
  );
};

export default Newsletter;
