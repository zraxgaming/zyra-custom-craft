
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { makePhoneCall } from "@/utils/phoneCallApi";
import { Phone, Send, Loader2, Mic } from "lucide-react";

const PhoneCallInterface = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [callData, setCallData] = useState({
    phone_number: '',
    task: 'Welcome to Zyra e-commerce, how may I help today?',
    voice: 'June',
    max_duration: 12,
    language: 'en'
  });

  const handleMakeCall = async () => {
    if (!callData.phone_number.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Please enter a phone number to call.",
        variant: "destructive",
      });
      return;
    }

    if (!callData.task.trim()) {
      toast({
        title: "Task Required",
        description: "Please enter a task/prompt for the call.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await makePhoneCall(callData);
      
      toast({
        title: "Call Initiated Successfully!",
        description: `Call has been started to ${callData.phone_number}`,
      });

      console.log('Call result:', result);
      
      // Reset form
      setCallData(prev => ({
        ...prev,
        phone_number: '',
        task: 'Welcome to Zyra e-commerce, how may I help today?'
      }));
      
    } catch (error: any) {
      console.error('Call error:', error);
      toast({
        title: "Call Failed",
        description: "Failed to initiate the phone call. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Phone className="h-6 w-6 text-primary" />
          AI Phone Call Interface
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone_number" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number *
            </Label>
            <Input
              id="phone_number"
              value={callData.phone_number}
              onChange={(e) => setCallData(prev => ({ ...prev, phone_number: e.target.value }))}
              placeholder="+971557597200"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="voice">Voice</Label>
            <Select value={callData.voice} onValueChange={(value) => setCallData(prev => ({ ...prev, voice: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="June">June (Female)</SelectItem>
                <SelectItem value="Maya">Maya (Female)</SelectItem>
                <SelectItem value="Ryan">Ryan (Male)</SelectItem>
                <SelectItem value="Alex">Alex (Male)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="max_duration">Max Duration (minutes)</Label>
            <Input
              id="max_duration"
              type="number"
              min="1"
              max="30"
              value={callData.max_duration}
              onChange={(e) => setCallData(prev => ({ ...prev, max_duration: parseInt(e.target.value) || 12 }))}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="language">Language</Label>
            <Select value={callData.language} onValueChange={(value) => setCallData(prev => ({ ...prev, language: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ar">Arabic</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="task" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            Task/Prompt *
          </Label>
          <Textarea
            id="task"
            value={callData.task}
            onChange={(e) => setCallData(prev => ({ ...prev, task: e.target.value }))}
            placeholder="Enter the task or prompt for the AI to follow during the call..."
            rows={4}
            className="mt-1"
          />
        </div>

        <Button
          onClick={handleMakeCall}
          disabled={loading || !callData.phone_number.trim() || !callData.task.trim()}
          className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <Send className="h-5 w-5 mr-2" />
          )}
          {loading ? 'Initiating Call...' : 'Make Phone Call'}
        </Button>

        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">Example Phone Numbers:</h4>
          <div className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
            <p>+971557597200 (UAE)</p>
            <p>+966501234567 (Saudi Arabia)</p>
            <p>+96512345678 (Kuwait)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhoneCallInterface;
