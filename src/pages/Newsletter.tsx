import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { sendEmailDirect } from '@/utils/sendgrid';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      // Send notification email to admin
      await sendEmailDirect({
        to: 'zainabusal113@gmail.com',
        subject: 'New Newsletter Subscription',
        html: `<p>New subscriber: <strong>${email}</strong></p>`
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
