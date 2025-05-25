
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
import { Send, Users, Plus, Mail } from "lucide-react";
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
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const [campaignForm, setCampaignForm] = useState({
    title: "",
    subject: "",
    content: "",
  });

  const [emailForm, setEmailForm] = useState({
    recipient: "",
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
    if (subscribers.length === 0) {
      toast({
        title: "No subscribers",
        description: "There are no active subscribers to send the campaign to.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      const campaign = campaigns.find(c => c.id === campaignId);
      if (!campaign) throw new Error("Campaign not found");

      const subscriberEmails = subscribers.map(sub => sub.email);

      const { error } = await supabase.functions.invoke('send-brevo-email', {
        body: {
          to: subscriberEmails,
          subject: campaign.subject,
          content: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
              <h1 style="color: #333; text-align: center;">${campaign.title}</h1>
              <div style="padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
                ${campaign.content.replace(/\n/g, '<br>')}
              </div>
              <footer style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
                <p style="color: #666; font-size: 12px;">
                  You received this email because you subscribed to our newsletter.<br>
                  <a href="#" style="color: #666;">Unsubscribe</a>
                </p>
              </footer>
            </div>
          `,
          type: "newsletter"
        }
      });

      if (error) throw error;

      // Update campaign status
      const { error: updateError } = await supabase
        .from("email_campaigns")
        .update({ 
          status: "sent",
          sent_at: new Date().toISOString()
        })
        .eq("id", campaignId);

      if (updateError) throw updateError;

      toast({
        title: "Campaign sent",
        description: `Newsletter has been sent to ${subscribers.length} subscribers via Brevo.`,
      });

      fetchCampaigns();
    } catch (error: any) {
      toast({
        title: "Error sending campaign",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleSendDirectEmail = async () => {
    if (!emailForm.recipient || !emailForm.subject || !emailForm.content) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      const { error } = await supabase.functions.invoke('send-brevo-email', {
        body: {
          to: emailForm.recipient,
          subject: emailForm.subject,
          content: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
              <h1 style="color: #333;">Message from Zyra Store</h1>
              <div style="padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
                ${emailForm.content.replace(/\n/g, '<br>')}
              </div>
              <footer style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
                <p style="color: #666; font-size: 12px;">
                  This message was sent from Zyra Store Admin Panel.
                </p>
              </footer>
            </div>
          `,
          type: "direct"
        }
      });

      if (error) throw error;

      toast({
        title: "Email sent",
        description: "Email has been sent successfully via Brevo.",
      });

      setEmailForm({ recipient: "", subject: "", content: "" });
      setShowEmailForm(false);
    } catch (error: any) {
      toast({
        title: "Error sending email",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Newsletter & Email Management</h1>
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowEmailForm(true)}
              variant="outline"
              className="text-foreground border-border"
            >
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </Button>
            <Button 
              onClick={() => setShowCampaignForm(true)}
              className="bg-primary text-primary-foreground"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </div>
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
              <CardTitle className="text-foreground">Sent Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {campaigns.filter(c => c.status === 'sent').length}
              </div>
              <p className="text-muted-foreground">Successfully sent</p>
            </CardContent>
          </Card>
        </div>

        {showEmailForm && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Send Direct Email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="recipient" className="text-foreground">Recipient Email</Label>
                <Input
                  id="recipient"
                  type="email"
                  value={emailForm.recipient}
                  onChange={(e) => setEmailForm({...emailForm, recipient: e.target.value})}
                  placeholder="customer@example.com"
                  className="bg-background text-foreground border-border"
                />
              </div>
              
              <div>
                <Label htmlFor="emailSubject" className="text-foreground">Subject</Label>
                <Input
                  id="emailSubject"
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                  placeholder="Email subject"
                  className="bg-background text-foreground border-border"
                />
              </div>
              
              <div>
                <Label htmlFor="emailContent" className="text-foreground">Message</Label>
                <Textarea
                  id="emailContent"
                  value={emailForm.content}
                  onChange={(e) => setEmailForm({...emailForm, content: e.target.value})}
                  rows={6}
                  placeholder="Your message here..."
                  className="bg-background text-foreground border-border"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={handleSendDirectEmail} 
                  disabled={isSending}
                  className="bg-primary text-primary-foreground"
                >
                  {isSending ? "Sending..." : "Send Email"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowEmailForm(false)}
                  className="text-foreground border-border"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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
