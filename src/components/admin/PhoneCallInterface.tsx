
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Phone, Loader2, Users, MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react';

interface CallLog {
  id: string;
  phone_number: string;
  status: 'pending' | 'completed' | 'failed';
  duration?: number;
  created_at: string;
}

const PhoneCallInterface = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('Welcome to Zyra e-commerce, how may I help today?');
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [blandApiKey, setBlandApiKey] = useState('');

  useEffect(() => {
    fetchBlandApiKey();
    fetchCallLogs();
  }, []);

  const fetchBlandApiKey = async () => {
    try {
      const { data, error } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'bland_ai_api_key')
        .single();

      if (error) throw error;
      if (data?.value) {
        setBlandApiKey(data.value);
      }
    } catch (error) {
      console.error('Error fetching Bland AI API key:', error);
    }
  };

  const fetchCallLogs = async () => {
    // Mock call logs for demonstration
    const mockLogs: CallLog[] = [
      {
        id: '1',
        phone_number: '+971557597200',
        status: 'completed',
        duration: 45,
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString()
      },
      {
        id: '2',
        phone_number: '+971501234567',
        status: 'failed',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
      }
    ];
    setCallLogs(mockLogs);
  };

  const makePhoneCall = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Please enter a phone number to call",
        variant: "destructive",
      });
      return;
    }

    if (!blandApiKey) {
      toast({
        title: "API Key Missing",
        description: "Bland AI API key not configured in site settings",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const callData = {
        phone_number: phoneNumber,
        voice: "June",
        wait_for_greeting: false,
        record: true,
        answered_by_enabled: true,
        noise_cancellation: false,
        interruption_threshold: 100,
        block_interruptions: false,
        max_duration: 12,
        model: "base",
        language: "en",
        background_track: "none",
        endpoint: "https://api.bland.ai",
        voicemail_action: "ignore",
        task: message
      };

      const response = await fetch('https://api.bland.ai/v1/calls', {
        method: 'POST',
        headers: {
          'Authorization': blandApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(callData),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate call');
      }

      const result = await response.json();
      
      // Add to call logs
      const newLog: CallLog = {
        id: result.call_id || Date.now().toString(),
        phone_number: phoneNumber,
        status: 'pending',
        created_at: new Date().toISOString()
      };
      
      setCallLogs(prev => [newLog, ...prev]);
      
      toast({
        title: "Call Initiated! 📞",
        description: `Call started to ${phoneNumber}`,
      });

      // Reset form
      setPhoneNumber('');
    } catch (error: any) {
      console.error('Error making phone call:', error);
      toast({
        title: "Call Failed",
        description: error.message || "Failed to initiate phone call",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Phone Call Interface */}
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 animate-scale-in">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-xl">
            <Phone className="h-6 w-6 animate-bounce" />
            AI Phone Calls
            <Badge variant="secondary" className="bg-white/20 text-white">
              Bland AI
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="phoneNumber" className="text-blue-700 dark:text-blue-300 font-semibold">
                Phone Number *
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+971557597200"
                className="border-2 border-blue-200 focus:border-blue-500 h-12 text-lg"
              />
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                Include country code (e.g., +971 for UAE)
              </p>
            </div>

            <div>
              <Label htmlFor="message" className="text-blue-700 dark:text-blue-300 font-semibold">
                AI Assistant Message
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter the task for the AI assistant"
                rows={4}
                className="border-2 border-blue-200 focus:border-blue-500 resize-none"
              />
            </div>

            <Button
              onClick={makePhoneCall}
              disabled={loading || !phoneNumber.trim()}
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Initiating Call...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5" />
                  Make AI Call
                </div>
              )}
            </Button>
          </div>

          <div className="bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-blue-800 dark:text-blue-200 mb-1">How it works:</p>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• AI will call the provided number</li>
                  <li>• Uses the custom message as conversation starter</li>
                  <li>• Powered by Bland AI for natural conversations</li>
                  <li>• Calls are recorded for quality assurance</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call Logs */}
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 animate-slide-in-right">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-xl">
            <Users className="h-6 w-6 animate-bounce" />
            Recent Calls
            <Badge variant="secondary" className="bg-white/20 text-white">
              {callLogs.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {callLogs.length === 0 ? (
              <div className="text-center py-12 animate-bounce-in">
                <Phone className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-float" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Calls Yet</h3>
                <p className="text-gray-500 dark:text-gray-400">Make your first AI call to see logs here</p>
              </div>
            ) : (
              callLogs.map((log, index) => (
                <div
                  key={log.id}
                  className="p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl border border-purple-100 dark:border-purple-800 hover:shadow-lg transition-all duration-300 animate-slide-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {log.phone_number}
                      </span>
                    </div>
                    <Badge className={getStatusColor(log.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(log.status)}
                        {log.status}
                      </div>
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
                    <div>
                      <span className="font-medium">Time:</span>{' '}
                      {new Date(log.created_at).toLocaleTimeString()}
                    </div>
                    {log.duration && (
                      <div>
                        <span className="font-medium">Duration:</span>{' '}
                        {log.duration}s
                      </div>
                    )}
                  </div>

                  <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                    {new Date(log.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhoneCallInterface;
