
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, User, Calendar, MessageSquare, Send } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ContactSubmission {
  id: string;
  created_at: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied";
  admin_reply?: string;
}

const ContactView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submission, setSubmission] = useState<ContactSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    const fetchSubmission = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from("contact_submissions")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setSubmission(data);
        setReplyText(data.admin_reply || "");
        
        // Mark as read if it was unread
        if (data.status === "unread") {
          await updateStatus("read");
        }
      } catch (error: any) {
        console.error("Error fetching contact submission:", error);
        toast({
          title: "Error",
          description: "Failed to load contact submission details",
          variant: "destructive",
        });
        navigate("/admin/contact");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmission();
  }, [id, navigate, toast]);

  const updateStatus = async (status: "unread" | "read" | "replied") => {
    if (!submission || !id) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      setSubmission({ ...submission, status });
      toast({
        title: "Status updated",
        description: `Marked as ${status}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const saveReply = async () => {
    if (!submission || !id) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ 
          admin_reply: replyText,
          status: "replied"
        })
        .eq("id", id);

      if (error) throw error;

      setSubmission({ ...submission, admin_reply: replyText, status: "replied" });
      toast({
        title: "Reply saved",
        description: "Admin reply has been saved",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save reply",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const sendEmailReply = () => {
    if (!submission) return;
    
    const subject = `Re: ${submission.subject}`;
    const body = replyText || "";
    const mailtoLink = `mailto:${submission.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
    
    // Update status to replied
    updateStatus("replied");
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zyra-purple"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!submission) {
    return (
      <AdminLayout>
        <div className="p-6">
          <h1>Contact submission not found</h1>
          <Button onClick={() => navigate("/admin/contact")}>Back to submissions</Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/contact")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Submissions
          </Button>
          <Badge
            variant={
              submission.status === "unread" ? "destructive" :
              submission.status === "read" ? "secondary" :
              "default"
            }
          >
            {submission.status}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Contact Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Name
                  </div>
                  <div className="text-lg font-medium">{submission.name}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                  <div className="text-lg">
                    <a 
                      href={`mailto:${submission.email}`} 
                      className="text-zyra-purple hover:underline"
                    >
                      {submission.email}
                    </a>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-muted-foreground">Subject</div>
                <div className="text-lg font-medium">{submission.subject}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-muted-foreground">Message</div>
                <div className="mt-2 p-4 bg-muted rounded-md whitespace-pre-wrap text-sm">
                  {submission.message}
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Date Received
                </div>
                <div>{format(new Date(submission.created_at), "PPpp")}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Admin Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reply">Admin Reply</Label>
                  <Textarea
                    id="reply"
                    placeholder="Type your reply here..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={6}
                    className="mt-2"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={saveReply}
                    disabled={isUpdating || !replyText.trim()}
                  >
                    Save Reply
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={sendEmailReply}
                    disabled={!replyText.trim()}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Send Email
                  </Button>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="text-sm font-medium mb-2">Quick Actions</div>
                <div className="flex flex-wrap gap-2">
                  {submission.status === "unread" ? (
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatus("read")} 
                      disabled={isUpdating}
                    >
                      Mark as Read
                    </Button>
                  ) : (
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatus("unread")} 
                      disabled={isUpdating}
                    >
                      Mark as Unread
                    </Button>
                  )}
                  
                  {submission.status !== "replied" && (
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatus("replied")}
                      disabled={isUpdating}
                    >
                      Mark as Replied
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ContactView;
