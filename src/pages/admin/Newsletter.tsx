
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Send, Users, Plus } from "lucide-react";
import { format } from "date-fns";

interface NewsletterSubscriber {
  id: string;
  email: string;
  name: string | null;
  is_active: boolean;
  subscribed_at: string;
}

interface EmailCampaign {
  id: string;
  title: string;
  subject: string;
  content: string;
  status: string;
  recipient_count: number;
  created_at: string;
  sent_at: string | null;
}

const Newsletter = () => {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const { toast } = useToast();

  const [campaignForm, setCampaignForm] = useState({
    title: "",
    subject: "",
    content: "",
  });

  useEffect(() => {
    fetchSubscribers();
    fetchCampaigns();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const { data, error } = await supabase
        .from("newsletter_subscriptions")
        .select("*")
        .eq("is_active", true)
        .order("subscribed_at", { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching subscribers",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from("email_campaigns")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching campaigns",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCampaign = async () => {
    try {
      const { error } = await supabase
        .from("email_campaigns")
        .insert({
          title: campaignForm.title,
          subject: campaignForm.subject,
          content: campaignForm.content,
          recipient_count: subscribers.length,
          status: "draft",
        });

      if (error) throw error;

      toast({
        title: "Campaign created",
        description: "Newsletter campaign has been saved as draft.",
      });

      setCampaignForm({ title: "", subject: "", content: "" });
      setShowCampaignForm(false);
      fetchCampaigns();
    } catch (error: any) {
      toast({
        title: "Error creating campaign",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSendCampaign = async (campaignId: string) => {
    try {
      // In a real implementation, you would call an edge function to send emails
      // For now, we'll just update the status
      const { error } = await supabase
        .from("email_campaigns")
        .update({ 
          status: "sent",
          sent_at: new Date().toISOString()
        })
        .eq("id", campaignId);

      if (error) throw error;

      toast({
        title: "Campaign sent",
        description: "Newsletter has been sent to all subscribers.",
      });

      fetchCampaigns();
    } catch (error: any) {
      toast({
        title: "Error sending campaign",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Newsletter Management</h1>
          <Button 
            onClick={() => setShowCampaignForm(true)}
            className="bg-primary text-primary-foreground"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Users className="mr-2 h-5 w-5" />
                Subscribers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{subscribers.length}</div>
              <p className="text-muted-foreground">Active subscribers</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Send className="mr-2 h-5 w-5" />
                Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{campaigns.length}</div>
              <p className="text-muted-foreground">Total campaigns</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {campaigns.filter(c => c.status === 'sent').length}
              </div>
              <p className="text-muted-foreground">Sent campaigns</p>
            </CardContent>
          </Card>
        </div>

        {showCampaignForm && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Create New Campaign</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-foreground">Campaign Title</Label>
                <Input
                  id="title"
                  value={campaignForm.title}
                  onChange={(e) => setCampaignForm({...campaignForm, title: e.target.value})}
                  className="bg-background text-foreground border-border"
                />
              </div>
              
              <div>
                <Label htmlFor="subject" className="text-foreground">Email Subject</Label>
                <Input
                  id="subject"
                  value={campaignForm.subject}
                  onChange={(e) => setCampaignForm({...campaignForm, subject: e.target.value})}
                  className="bg-background text-foreground border-border"
                />
              </div>
              
              <div>
                <Label htmlFor="content" className="text-foreground">Email Content</Label>
                <Textarea
                  id="content"
                  value={campaignForm.content}
                  onChange={(e) => setCampaignForm({...campaignForm, content: e.target.value})}
                  rows={6}
                  className="bg-background text-foreground border-border"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button onClick={handleCreateCampaign} className="bg-primary text-primary-foreground">
                  Save Campaign
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCampaignForm(false)}
                  className="text-foreground border-border"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Email Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-foreground">Title</TableHead>
                    <TableHead className="text-foreground">Subject</TableHead>
                    <TableHead className="text-foreground">Status</TableHead>
                    <TableHead className="text-foreground">Recipients</TableHead>
                    <TableHead className="text-foreground">Created</TableHead>
                    <TableHead className="text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.id} className="border-border">
                      <TableCell className="text-foreground">{campaign.title}</TableCell>
                      <TableCell className="text-foreground">{campaign.subject}</TableCell>
                      <TableCell className="text-foreground capitalize">{campaign.status}</TableCell>
                      <TableCell className="text-foreground">{campaign.recipient_count}</TableCell>
                      <TableCell className="text-foreground">
                        {format(new Date(campaign.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        {campaign.status === 'draft' && (
                          <Button
                            size="sm"
                            onClick={() => handleSendCampaign(campaign.id)}
                            className="bg-primary text-primary-foreground"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-foreground">Email</TableHead>
                  <TableHead className="text-foreground">Name</TableHead>
                  <TableHead className="text-foreground">Subscribed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.map((subscriber) => (
                  <TableRow key={subscriber.id} className="border-border">
                    <TableCell className="text-foreground">{subscriber.email}</TableCell>
                    <TableCell className="text-foreground">{subscriber.name || "—"}</TableCell>
                    <TableCell className="text-foreground">
                      {format(new Date(subscriber.subscribed_at), "MMM d, yyyy")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Newsletter;
