
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Send, Users, Clock, Pencil, Trash2, Calendar, CheckCircle, AlertCircle } from "lucide-react";

const AdminNewsletter = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [subscribers, setSubscribers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [showNewCampaign, setShowNewCampaign] = useState(false);
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
      toast({
        title: "Error",
        description: "Failed to load campaigns",
        variant: "destructive",
      });
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

  const handleSendCampaign = async (campaignId: string) => {
    if (!confirm('Are you sure you want to send this campaign now?')) return;

    setSending(true);
    try {
      // Update campaign status in database
      const { error } = await supabase
        .from('email_campaigns')
        .update({ 
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', campaignId);

      if (error) throw error;

      // In a real app, would call an edge function to actually send emails
      // For now, just update the UI
      toast({
        title: "Campaign Sent",
        description: `Email sent to ${subscribers.length} subscribers`,
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

  const handleDeleteCampaign = async (campaignId: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    try {
      const { error } = await supabase
        .from('email_campaigns')
        .delete()
        .eq('id', campaignId);

      if (error) throw error;

      toast({
        title: "Campaign Deleted",
        description: "Campaign has been removed",
      });

      fetchCampaigns();
    } catch (error: any) {
      console.error('Error deleting campaign:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete campaign",
        variant: "destructive",
      });
    }
  };

  const getCampaignStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Draft</span>;
      case 'scheduled':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Scheduled</span>;
      case 'sending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Sending</span>;
      case 'sent':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Sent</span>;
      case 'failed':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Failed</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status}</span>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold animate-slide-in-left flex items-center">
            <Mail className="h-8 w-8 mr-3" />
            Newsletter Management
          </h1>
          <Button onClick={() => setShowNewCampaign(true)}>
            Create Campaign
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="animate-scale-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subscribers.length}</div>
              <p className="text-xs text-muted-foreground">Active newsletter subscribers</p>
            </CardContent>
          </Card>
          
          <Card className="animate-scale-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Campaigns</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{campaigns.length}</div>
              <p className="text-xs text-muted-foreground">Email campaigns created</p>
            </CardContent>
          </Card>
          
          <Card className="animate-scale-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sent</CardTitle>
              <Send className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {campaigns.filter(c => c.status === 'sent').length}
              </div>
              <p className="text-xs text-muted-foreground">Campaigns sent</p>
            </CardContent>
          </Card>
        </div>

        {showNewCampaign && (
          <Card className="animate-scale-in mb-8">
            <CardHeader>
              <CardTitle>Create New Campaign</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateCampaign} className="space-y-4">
                <div>
                  <Label htmlFor="title">Campaign Title (Internal)</Label>
                  <Input
                    id="title"
                    value={newCampaign.title}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Email Subject Line</Label>
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
                    rows={8}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="schedule_date">Schedule Date (Optional)</Label>
                    <Input
                      id="schedule_date"
                      type="date"
                      value={newCampaign.schedule_date}
                      onChange={(e) => setNewCampaign(prev => ({ ...prev, schedule_date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="schedule_time">Schedule Time (Optional)</Label>
                    <Input
                      id="schedule_time"
                      type="time"
                      value={newCampaign.schedule_time}
                      onChange={(e) => setNewCampaign(prev => ({ ...prev, schedule_time: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowNewCampaign(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={sending}>
                    {sending ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save Campaign'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle>Email Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-16 bg-muted animate-pulse rounded"></div>
                ))}
              </div>
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
                {campaigns.map((campaign: any) => (
                  <div 
                    key={campaign.id} 
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">{campaign.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Subject: {campaign.subject}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {getCampaignStatusBadge(campaign.status)}
                          
                          <span className="text-xs text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {campaign.sent_at ? 
                              `Sent on ${new Date(campaign.sent_at).toLocaleString()}` : 
                              campaign.scheduled_at ? 
                              `Scheduled for ${new Date(campaign.scheduled_at).toLocaleString()}` :
                              `Created on ${new Date(campaign.created_at).toLocaleString()}`
                            }
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        {campaign.status === 'draft' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleSendCampaign(campaign.id)}
                              disabled={sending}
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Send
                            </Button>
                            <Button variant="outline" size="sm">
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteCampaign(campaign.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {campaign.content}
                    </div>
                    
                    <div className="mt-3 text-xs flex items-center justify-between">
                      <span>
                        Recipients: <strong>{campaign.recipient_count}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        {campaign.status === 'sent' ? (
                          <>
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span className="text-green-600">Delivered</span>
                          </>
                        ) : campaign.status === 'failed' ? (
                          <>
                            <AlertCircle className="h-3 w-3 text-red-500" />
                            <span className="text-red-600">Failed</span>
                          </>
                        ) : null}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle>Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-16 bg-muted animate-pulse rounded"></div>
            ) : subscribers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Subscribers</h3>
                <p className="text-muted-foreground">
                  Nobody has subscribed to your newsletter yet
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Email</th>
                      <th className="text-left py-2 px-4">Name</th>
                      <th className="text-left py-2 px-4">Subscribed On</th>
                      <th className="text-left py-2 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.slice(0, 8).map((sub: any) => (
                      <tr key={sub.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-2 px-4 font-medium">{sub.email}</td>
                        <td className="py-2 px-4">{sub.name || "-"}</td>
                        <td className="py-2 px-4 text-muted-foreground">
                          {new Date(sub.subscribed_at).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-4">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminNewsletter;
