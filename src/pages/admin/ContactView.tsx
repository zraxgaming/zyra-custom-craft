import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAuth } from "@/hooks/use-auth";
import { ArrowLeft, Send, Mail, Calendar, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { ContactSubmission } from "@/types/contact";

const ContactView = () => {
  const { id } = useParams<{ id: string }>();
  const [submission, setSubmission] = useState<ContactSubmission | null>(null);
  const [reply, setReply] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if not admin
  useEffect(() => {
    if (user && !isAdmin) {
      navigate("/");
      toast({
        title: "Access denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
    }
  }, [isAdmin, user, navigate, toast]);

  // Fetch submission details
  useEffect(() => {
    const fetchSubmission = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from("contact_submissions")
          .select("*")
          .eq("id", id)
          .single();
          
        if (error) throw error;
        
        // Map the data to ensure proper typing
        const mappedSubmission: ContactSubmission = {
          ...data,
          status: data.status as 'unread' | 'read' | 'replied'
        };
        
        setSubmission(mappedSubmission);
        
        // Mark as read if it's unread
        if (data.status === 'unread') {
          await supabase
            .from("contact_submissions")
            .update({ status: 'read' })
            .eq("id", id);
          
          setSubmission(prev => prev ? { ...prev, status: 'read' } : null);
        }
      } catch (error: any) {
        toast({
          title: "Error fetching submission",
          description: error.message,
          variant: "destructive",
        });
        navigate("/admin/contact");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSubmission();
  }, [id, toast, navigate]);

  const handleSendReply = async () => {
    if (!submission || !reply.trim()) return;
    
    setIsSending(true);
    try {
      // Update the submission with the reply
      const { error } = await supabase
        .from("contact_submissions")
        .update({ 
          admin_reply: reply,
          status: 'replied'
        })
        .eq("id", submission.id);
        
      if (error) throw error;
      
      // TODO: Send email with the reply using an edge function
      // For now, we'll just update the status
      
      setSubmission(prev => prev ? {
        ...prev,
        admin_reply: reply,
        status: 'replied'
      } : null);
      
      setReply("");
      
      toast({
        title: "Reply sent",
        description: "Your reply has been saved. Email functionality will be added soon.",
      });
    } catch (error: any) {
      toast({
        title: "Error sending reply",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unread':
        return <Badge variant="destructive">Unread</Badge>;
      case 'read':
        return <Badge variant="secondary">Read</Badge>;
      case 'replied':
        return <Badge variant="default" className="bg-green-500">Replied</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!user) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zyra-purple"></div>
        </div>
      </AdminLayout>
    );
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zyra-purple"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!submission) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Submission not found</h1>
            <Button onClick={() => navigate("/admin/contact")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Contact Submissions
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate("/admin/contact")}
            className="text-gray-600 dark:text-gray-400"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Contact Submission</h1>
          {getStatusBadge(submission.status)}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Submission Details */}
          <div className="lg:col-span-2">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <MessageSquare className="h-5 w-5" />
                  Message Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">From</label>
                  <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{submission.name}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
                  <p className="text-gray-900 dark:text-gray-100">{submission.email}</p>
                </div>
                
                {submission.subject && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Subject</label>
                    <p className="text-gray-900 dark:text-gray-100">{submission.subject}</p>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Message</label>
                  <div className="mt-1 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="whitespace-pre-wrap text-gray-900 dark:text-gray-100">{submission.message}</p>
                  </div>
                </div>
                
                {submission.admin_reply && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Previous Reply</label>
                    <div className="mt-1 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                      <p className="whitespace-pre-wrap text-gray-900 dark:text-gray-100">{submission.admin_reply}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Submission Info */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Calendar className="h-5 w-5" />
                  Submission Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Received</label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {format(new Date(submission.created_at), "PPP 'at' p")}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(submission.status)}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Reply Section */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Mail className="h-5 w-5" />
                  Send Reply
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Type your reply here..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={6}
                  className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                />
                
                <Button 
                  onClick={handleSendReply}
                  disabled={!reply.trim() || isSending}
                  className="w-full"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSending ? "Sending..." : "Send Reply"}
                </Button>
                
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Your reply will be sent to {submission.email}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ContactView;
