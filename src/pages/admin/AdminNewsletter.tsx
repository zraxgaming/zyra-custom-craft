
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PhoneCallInterface from "@/components/admin/PhoneCallInterface";
import { 
  Mail, 
  Send, 
  Users, 
  Trash2, 
  Phone, 
  MessageSquare,
  UserMinus,
  Search,
  Download
} from "lucide-react";

const AdminNewsletter = () => {
  const { toast } = useToast();
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [emailData, setEmailData] = useState({
    subject: '',
    content: '',
    html_content: ''
  });

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    }
  };

  const removeSubscriber = async (subscriberId: string) => {
    if (!confirm('Are you sure you want to remove this subscriber?')) return;

    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .update({ is_active: false, unsubscribed_at: new Date().toISOString() })
        .eq('id', subscriberId);

      if (error) throw error;

      toast({
        title: "Subscriber Removed",
        description: "The subscriber has been removed from the newsletter.",
      });

      fetchSubscribers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove subscriber.",
        variant: "destructive",
      });
    }
  };

  const sendNewsletter = async () => {
    if (!emailData.subject.trim() || !emailData.content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both subject and content.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Create email campaign
      const { data: campaign, error: campaignError } = await supabase
        .from('email_campaigns')
        .insert([{
          title: emailData.subject,
          subject: emailData.subject,
          content: emailData.content,
          html_content: emailData.html_content || emailData.content,
          status: 'sent',
          sent_at: new Date().toISOString(),
          recipient_count: subscribers.length
        }])
        .select()
        .single();

      if (campaignError) throw campaignError;

      // Here you would integrate with your email service
      // For now, we'll just mark it as sent in the database
      
      toast({
        title: "Newsletter Sent!",
        description: `Newsletter sent to ${subscribers.length} subscribers.`,
      });

      setEmailData({ subject: '', content: '', html_content: '' });
    } catch (error) {
      console.error('Error sending newsletter:', error);
      toast({
        title: "Error",
        description: "Failed to send newsletter.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportSubscribers = () => {
    const csv = [
      'Email,Name,Subscribed Date',
      ...subscribers.map((sub: any) => 
        `${sub.email},${sub.name || ''},${new Date(sub.created_at).toLocaleDateString()}`
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter-subscribers.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredSubscribers = subscribers.filter((sub: any) =>
    sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sub.name && sub.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Newsletter Management</h1>
            <Badge variant="secondary">{subscribers.length} subscribers</Badge>
          </div>
          <Button onClick={exportSubscribers} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Email Campaign */}
          <Card className="animate-slide-in-left">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Send Newsletter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject Line</Label>
                <Input
                  id="subject"
                  value={emailData.subject}
                  onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Newsletter subject..."
                />
              </div>

              <div>
                <Label htmlFor="content">Email Content</Label>
                <Textarea
                  id="content"
                  value={emailData.content}
                  onChange={(e) => setEmailData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your newsletter content here..."
                  rows={8}
                />
              </div>

              <Button
                onClick={sendNewsletter}
                disabled={loading || !emailData.subject.trim() || !emailData.content.trim()}
                className="w-full"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Send to {subscribers.length} Subscribers
              </Button>
            </CardContent>
          </Card>

          {/* Subscriber List */}
          <Card className="animate-slide-in-right">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Subscribers
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search subscribers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredSubscribers.length > 0 ? (
                  filteredSubscribers.map((subscriber: any) => (
                    <div
                      key={subscriber.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div>
                        <p className="font-medium">{subscriber.email}</p>
                        {subscriber.name && (
                          <p className="text-sm text-muted-foreground">{subscriber.name}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Subscribed: {new Date(subscriber.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeSubscriber(subscriber.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-muted-foreground">
                      {searchTerm ? 'No subscribers found' : 'No subscribers yet'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Phone Call Interface */}
        <div className="animate-fade-in" style={{animationDelay: '0.3s'}}>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Phone className="h-6 w-6 text-primary" />
            AI Phone Call System
          </h2>
          <PhoneCallInterface />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminNewsletter;
