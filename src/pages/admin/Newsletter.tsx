
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Send, Users, Plus } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

interface Newsletter {
  id: string;
  title: string;
  subject: string;
  content: string;
  html_content?: string;
  status: string;
  scheduled_at?: string;
  sent_at?: string;
  recipient_count: number;
  created_at: string;
}

interface Subscriber {
  id: string;
  email: string;
  name?: string;
  is_active: boolean;
  subscribed_at: string;
}

const AdminNewsletter = () => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    content: '',
    html_content: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchNewsletters();
    fetchSubscribers();
  }, []);

  const fetchNewsletters = async () => {
    try {
      const { data, error } = await supabase
        .from('email_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNewsletters(data || []);
    } catch (error) {
      console.error('Error fetching newsletters:', error);
      toast({
        title: "Error",
        description: "Failed to load newsletters",
        variant: "destructive",
      });
    }
  };

  const fetchSubscribers = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .eq('is_active', true)
        .order('subscribed_at', { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('email_campaigns')
        .insert({
          title: formData.title,
          subject: formData.subject,
          content: formData.content,
          html_content: formData.html_content,
          status: 'draft',
          recipient_count: subscribers.length
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Newsletter created successfully",
      });

      setFormData({ title: '', subject: '', content: '', html_content: '' });
      setShowForm(false);
      fetchNewsletters();
    } catch (error) {
      console.error('Error creating newsletter:', error);
      toast({
        title: "Error",
        description: "Failed to create newsletter",
        variant: "destructive",
      });
    }
  };

  const handleSend = async (newsletterId: string) => {
    if (!confirm('Are you sure you want to send this newsletter to all subscribers?')) return;

    try {
      const newsletter = newsletters.find(n => n.id === newsletterId);
      if (!newsletter) return;

      const { error } = await supabase.functions.invoke('send-newsletter', {
        body: {
          subject: newsletter.subject,
          content: newsletter.content,
          htmlContent: newsletter.html_content
        }
      });

      if (error) throw error;

      await supabase
        .from('email_campaigns')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', newsletterId);

      toast({
        title: "Success",
        description: "Newsletter sent successfully",
      });

      fetchNewsletters();
    } catch (error) {
      console.error('Error sending newsletter:', error);
      toast({
        title: "Error",
        description: "Failed to send newsletter",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold animate-slide-in-left">Newsletter Management</h1>
          <Button 
            onClick={() => setShowForm(true)}
            className="animate-slide-in-right hover:scale-105 transition-transform"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Newsletter
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 animate-scale-in">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Active Subscribers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{subscribers.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800 animate-scale-in" style={{ animationDelay: '100ms' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Total Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">{newsletters.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Newsletter Form */}
        {showForm && (
          <Card className="animate-scale-in">
            <CardHeader>
              <CardTitle>Create New Newsletter</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Campaign Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subject">Email Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    rows={6}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Create Newsletter</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Newsletters List */}
        <div className="grid gap-4">
          {newsletters.map((newsletter, index) => (
            <Card key={newsletter.id} className="animate-slide-in-up hover:shadow-lg transition-all duration-300" style={{animationDelay: `${index * 50}ms`}}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{newsletter.title}</h3>
                    <p className="text-sm text-muted-foreground">{newsletter.subject}</p>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        newsletter.status === 'sent' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {newsletter.status}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Recipients: {newsletter.recipient_count}
                      </span>
                      {newsletter.sent_at && (
                        <span className="text-xs text-muted-foreground">
                          Sent: {new Date(newsletter.sent_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {newsletter.status === 'draft' && (
                    <Button 
                      onClick={() => handleSend(newsletter.id)}
                      className="hover:scale-105 transition-transform"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Now
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminNewsletter;
