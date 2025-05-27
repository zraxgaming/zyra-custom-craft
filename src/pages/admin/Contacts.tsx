
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Mail, User, Clock, Reply, CheckCircle } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

const AdminContacts = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch contact submissions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Contact status updated to ${status}`
      });

      fetchContacts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const sendReply = async (contactId: string) => {
    if (!replyText.trim()) {
      toast({
        title: "Reply Required",
        description: "Please enter a reply message",
        variant: "destructive"
      });
      return;
    }

    setSendingReply(true);
    try {
      // Update the contact with admin reply
      const { error } = await supabase
        .from('contact_submissions')
        .update({
          admin_reply: replyText,
          status: 'resolved',
          updated_at: new Date().toISOString()
        })
        .eq('id', contactId);

      if (error) throw error;

      toast({
        title: "Reply Sent",
        description: "Your reply has been saved and the contact has been marked as resolved"
      });

      setReplyingTo(null);
      setReplyText("");
      fetchContacts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSendingReply(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <MessageSquare className="h-8 w-8" />
            Contact Management
          </h1>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {contacts.filter(c => c.status === 'open').length} Open
            </Badge>
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
              {contacts.filter(c => c.status === 'in_progress').length} In Progress
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              {contacts.filter(c => c.status === 'resolved').length} Resolved
            </Badge>
          </div>
        </div>

        {/* Contact Submissions */}
        <div className="space-y-4">
          {contacts.map((contact) => (
            <Card key={contact.id} className="animate-fade-in">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-lg">{contact.name}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        {contact.email}
                        <Clock className="h-4 w-4 ml-2" />
                        {new Date(contact.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(contact.status)}>
                      {getStatusIcon(contact.status)}
                      <span className="ml-1">{contact.status.replace('_', ' ').toUpperCase()}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {contact.subject && (
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">Subject:</h4>
                    <p className="font-medium">{contact.subject}</p>
                  </div>
                )}
                
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">Message:</h4>
                  <p className="bg-muted/30 p-3 rounded-lg">{contact.message}</p>
                </div>

                {contact.admin_reply && (
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">Admin Reply:</h4>
                    <p className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                      {contact.admin_reply}
                    </p>
                  </div>
                )}

                {replyingTo === contact.id ? (
                  <div className="space-y-4 border-t pt-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Reply to {contact.name}:</h4>
                      <Textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply here..."
                        rows={4}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => sendReply(contact.id)}
                        disabled={sendingReply}
                      >
                        {sendingReply ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Reply className="h-4 w-4 mr-2" />
                            Send Reply
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 border-t pt-4">
                    {contact.status !== 'resolved' && (
                      <Button
                        variant="outline"
                        onClick={() => setReplyingTo(contact.id)}
                      >
                        <Reply className="h-4 w-4 mr-2" />
                        Reply
                      </Button>
                    )}
                    
                    {contact.status === 'open' && (
                      <Button
                        variant="outline"
                        onClick={() => updateStatus(contact.id, 'in_progress')}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Mark In Progress
                      </Button>
                    )}
                    
                    {contact.status !== 'resolved' && (
                      <Button
                        variant="outline"
                        onClick={() => updateStatus(contact.id, 'resolved')}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Resolved
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {contacts.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Contact Submissions</h3>
                <p className="text-muted-foreground">
                  When customers contact you, their messages will appear here.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminContacts;
