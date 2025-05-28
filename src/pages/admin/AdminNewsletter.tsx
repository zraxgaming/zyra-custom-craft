
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ChatBot from "@/components/chat/ChatBot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { sendNewsletterEmail } from "@/utils/emailService";
import { Mail, Send, Users, MessageSquare } from "lucide-react";

const AdminNewsletter = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [subscribers, setSubscribers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    subject: '',
    content: '',
    schedule_date: '',
    schedule_time: ''
  });

  useEffect(() => {
    fetchSubscribers();
    fetchCampaigns();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .eq('is_active', true)
        .order('subscribed_at', { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (error: any) {
      console.error('Error fetching subscribers:', error);
      toast({
        title: "Error",
        description: "Failed to load subscribers",
        variant: "destructive",
      });
    }
  };

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('email_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching campaigns:', error);
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      let scheduledAt = null;
      if (newCampaign.schedule_date && newCampaign.schedule_time) {
        scheduledAt = new Date(`${newCampaign.schedule_date}T${newCampaign.schedule_time}`).toISOString();
      }

      const { data, error } = await supabase
        .from('email_campaigns')
        .insert({
          title: newCampaign.title,
          subject: newCampaign.subject,
          content: newCampaign.content,
          status: scheduledAt ? 'scheduled' : 'draft',
          scheduled_at: scheduledAt,
          created_by: (await supabase.auth.getUser()).data.user?.id,
          recipient_count: subscribers.length
        })
        .select();

      if (error) throw error;

      toast({
        title: "Campaign Created",
        description: scheduledAt 
          ? "Campaign has been scheduled" 
          : "Campaign saved as draft",
      });

      setNewCampaign({
        title: '',
        subject: '',
        content: '',
        schedule_date: '',
        schedule_time: ''
      });
      setShowNewCampaign(false);
      fetchCampaigns();
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create campaign",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleSendCampaign = async (campaign: any) => {
    if (!confirm('Are you sure you want to send this campaign now?')) return;

    setSending(true);
    try {
      let successCount = 0;
      
      for (const subscriber of subscribers) {
        const emailSent = await sendNewsletterEmail({
          to: subscriber.email,
          subject: campaign.subject,
          content: campaign.content,
          campaign_name: campaign.title
        });
        
        if (emailSent) successCount++;
      }

      await supabase
        .from('email_campaigns')
        .update({ 
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', campaign.id);

      toast({
        title: "Campaign Sent",
        description: `Email sent to ${successCount} subscribers`,
      });

      fetchCampaigns();
    } catch (error: any) {
      console.error('Error sending campaign:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send campaign",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold flex items-center">
              <Mail className="h-8 w-8 mr-3" />
              Newsletter Management
            </h1>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Admin Assistant
              </Button>
              <Button onClick={() => setShowNewCampaign(true)}>
                Create Campaign
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{subscribers.length}</div>
                <p className="text-xs text-muted-foreground">Active newsletter subscribers</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Campaigns</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{campaigns.length}</div>
                <p className="text-xs text-muted-foreground">Email campaigns created</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sent</CardTitle>
                <Send className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {campaigns.filter((c: any) => c.status === 'sent').length}
                </div>
                <p className="text-xs text-muted-foreground">Campaigns sent</p>
              </CardContent>
            </Card>
          </div>

          {showNewCampaign && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Create New Campaign</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateCampaign} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Campaign Title</Label>
                    <Input
                      id="title"
                      value={newCampaign.title}
                      onChange={(e) => setNewCampaign(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Email Subject</Label>
                    <Input
                      id="subject"
                      value={newCampaign.subject}
                      onChange={(e) => setNewCampaign(prev => ({ ...prev, subject: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="content">Email Content</Label>
                    <Textarea
                      id="content"
                      value={newCampaign.content}
                      onChange={(e) => setNewCampaign(prev => ({ ...prev, content: e.target.value }))}
                      rows={6}
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowNewCampaign(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={sending}>
                      {sending ? 'Saving...' : 'Save Campaign'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Recent Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading campaigns...</div>
              ) : campaigns.length === 0 ? (
                <div className="text-center py-8">
                  <Mail className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Campaigns</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first email campaign to engage with subscribers
                  </p>
                  <Button onClick={() => setShowNewCampaign(true)}>
                    Create Campaign
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {campaigns.slice(0, 5).map((campaign: any) => (
                    <div 
                      key={campaign.id} 
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{campaign.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Subject: {campaign.subject}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            campaign.status === 'sent' ? 'bg-green-100 text-green-800' :
                            campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {campaign.status}
                          </span>
                        </div>
                        
                        {campaign.status === 'draft' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleSendCampaign(campaign)}
                            disabled={sending}
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Send
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminLayout>

      {/* Admin Chatbot */}
      <ChatBot 
        type="admin" 
        isOpen={isChatOpen} 
        onToggle={() => setIsChatOpen(!isChatOpen)} 
      />
    </>
  );
};

export default AdminNewsletter;
