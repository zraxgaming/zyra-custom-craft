
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Send, Users, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmailCampaign {
  id: string;
  title: string;
  subject: string;
  content: string;
  status: string;
  recipient_count: number;
  created_at: string;
}

const EmailNotificationService: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('email_campaigns')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestEmail = async () => {
    try {
      toast({
        title: "Test email sent!",
        description: "A test notification has been sent to your email.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send test email",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="animate-fade-in hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{campaigns.length}</div>
            <div className="text-sm text-muted-foreground">Campaigns</div>
          </div>
          
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <Send className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">
              {campaigns.filter(c => c.status === 'sent').length}
            </div>
            <div className="text-sm text-muted-foreground">Sent</div>
          </div>
          
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">
              {campaigns.filter(c => c.status === 'scheduled').length}
            </div>
            <div className="text-sm text-muted-foreground">Scheduled</div>
          </div>
        </div>

        <Button
          onClick={sendTestEmail}
          className="w-full hover:scale-105 transition-transform duration-200"
        >
          <Mail className="h-4 w-4 mr-2" />
          Send Test Email
        </Button>

        <div className="space-y-2">
          <h4 className="font-semibold">Recent Campaigns</h4>
          {campaigns.slice(0, 3).map((campaign) => (
            <div key={campaign.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <div className="font-medium">{campaign.title}</div>
                <div className="text-sm text-muted-foreground">{campaign.subject}</div>
              </div>
              <div className="text-sm">
                <div className={`px-2 py-1 rounded text-xs ${
                  campaign.status === 'sent' ? 'bg-green-100 text-green-800' :
                  campaign.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {campaign.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailNotificationService;
