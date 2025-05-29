
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PhoneCallInterfaceProps {
  onCallInitiated?: (callId: string) => void;
}

const PhoneCallInterface: React.FC<PhoneCallInterfaceProps> = ({ onCallInitiated }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchApiKey();
  }, []);

  const fetchApiKey = async () => {
    try {
      const { data, error } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'bland_ai_api_key')
        .single();

      if (error) throw error;
      if (data?.value) {
        setApiKey(String(data.value));
      }
    } catch (error) {
      console.error('Error fetching Bland AI API key:', error);
    }
  };

  const initiateCall = async () => {
    if (!phoneNumber || !message) {
      toast({
        title: "Missing Information",
        description: "Please provide both phone number and message",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey) {
      toast({
        title: "API Key Missing",
        description: "Bland AI API key not configured in site settings",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://api.bland.ai/v1/calls', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          task: message,
          voice: 'maya',
          reduce_latency: true,
          webhook: `${window.location.origin}/api/webhooks/bland-ai`,
          max_duration: 300, // 5 minutes max
          answered_by_enabled: true,
          wait_for_greeting: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to initiate call: ${response.status}`);
      }

      const data = await response.json();

      toast({
        title: "Call Initiated Successfully! 📞",
        description: `Call ID: ${data.call_id}`,
      });

      if (onCallInitiated) {
        onCallInitiated(data.call_id);
      }

      // Reset form
      setPhoneNumber('');
      setMessage('');

    } catch (error: any) {
      console.error('Error initiating call:', error);
      toast({
        title: "Call Failed",
        description: error.message || "Failed to initiate phone call",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <Phone className="h-5 w-5" />
          AI Phone Call Interface
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!apiKey && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg animate-pulse">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-700">
                Bland AI API key not configured. Please add it in site settings.
              </span>
            </div>
          </div>
        )}

        <div className="space-y-2 animate-slide-in-up">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="+1234567890"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="transition-all duration-300 focus:scale-105"
          />
        </div>

        <div className="space-y-2 animate-slide-in-up" style={{animationDelay: '100ms'}}>
          <Label htmlFor="message">Call Message/Task</Label>
          <Textarea
            id="message"
            placeholder="Enter the message or task for the AI to communicate during the call..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="transition-all duration-300 focus:scale-105"
          />
        </div>

        <Button
          onClick={initiateCall}
          disabled={isLoading || !apiKey}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 animate-bounce"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Initiating Call...
            </>
          ) : (
            <>
              <Phone className="h-4 w-4 mr-2" />
              Initiate AI Call
            </>
          )}
        </Button>

        <div className="text-xs text-muted-foreground text-center animate-fade-in">
          <p>Powered by Bland AI • Secure & Reliable</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhoneCallInterface;
