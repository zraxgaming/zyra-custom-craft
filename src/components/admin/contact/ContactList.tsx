
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Mail, User, Calendar, Reply } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface ContactListProps {
  submissions?: any[];
  updateStatus?: (id: string, status: string) => void;
  sendReply?: (id: string, reply: string) => void;
  navigate?: (path: string) => void;
}

const ContactList: React.FC<ContactListProps> = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error: any) {
      console.error("Error fetching contact submissions:", error);
      toast({
        title: "Error",
        description: "Failed to fetch contact submissions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === id ? { ...sub, status } : sub
        )
      );

      toast({
        title: "Success",
        description: "Status updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const sendReply = async (id: string, reply: string) => {
    if (!reply.trim()) return;

    try {
      setIsReplying(true);
      const { error } = await supabase
        .from("contact_submissions")
        .update({ 
          admin_reply: reply, 
          status: "replied", 
          updated_at: new Date().toISOString() 
        })
        .eq("id", id);

      if (error) throw error;

      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === id ? { ...sub, admin_reply: reply, status: "replied" } : sub
        )
      );

      setReplyText("");
      setSelectedSubmission(null);

      toast({
        title: "Success",
        description: "Reply sent successfully",
      });
    } catch (error: any) {
      console.error("Error sending reply:", error);
      toast({
        title: "Error",
        description: "Failed to send reply",
        variant: "destructive",
      });
    } finally {
      setIsReplying(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "replied":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "closed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <MessageSquare className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Contact Submissions</h1>
      </div>

      {submissions.length === 0 ? (
        <Card className="animate-scale-in">
          <CardContent className="p-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-medium mb-2">No contact submissions</h3>
            <p className="text-muted-foreground">
              Contact submissions will appear here when customers reach out.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {submissions.map((submission, index) => (
            <Card key={submission.id} className="animate-fade-in hover:shadow-lg transition-all duration-300" style={{ animationDelay: `${index * 50}ms` }}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{submission.name}</span>
                      <Mail className="h-4 w-4 text-muted-foreground ml-2" />
                      <span className="text-sm text-muted-foreground">{submission.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {new Date(submission.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Badge className={getStatusColor(submission.status)}>
                    {submission.status}
                  </Badge>
                </div>
                {submission.subject && (
                  <CardTitle className="text-lg">{submission.subject}</CardTitle>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {submission.message}
                </p>
                
                {submission.admin_reply && (
                  <div className="bg-muted p-4 rounded-lg mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Reply className="h-4 w-4 text-primary" />
                      <span className="font-medium text-primary">Admin Reply</span>
                    </div>
                    <p className="text-sm">{submission.admin_reply}</p>
                  </div>
                )}

                <div className="flex gap-2 flex-wrap">
                  {submission.status === "open" && (
                    <>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            onClick={() => {
                              setSelectedSubmission(submission);
                              setReplyText("");
                            }}
                            className="hover:scale-105 transition-transform"
                          >
                            <Reply className="h-4 w-4 mr-2" />
                            Reply
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reply to {submission.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="bg-muted p-4 rounded-lg">
                              <p className="text-sm"><strong>Original Message:</strong></p>
                              <p className="text-sm mt-2">{submission.message}</p>
                            </div>
                            <Textarea
                              placeholder="Type your reply..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              rows={6}
                            />
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => sendReply(submission.id, replyText)}
                                disabled={isReplying || !replyText.trim()}
                                className="hover:scale-105 transition-transform"
                              >
                                {isReplying ? "Sending..." : "Send Reply"}
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={() => setSelectedSubmission(null)}
                                className="hover:scale-105 transition-transform"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => updateStatus(submission.id, "closed")}
                        className="hover:scale-105 transition-transform"
                      >
                        Mark as Closed
                      </Button>
                    </>
                  )}
                  
                  {submission.status === "replied" && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => updateStatus(submission.id, "closed")}
                      className="hover:scale-105 transition-transform"
                    >
                      Mark as Closed
                    </Button>
                  )}
                  
                  {submission.status === "closed" && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => updateStatus(submission.id, "open")}
                      className="hover:scale-105 transition-transform"
                    >
                      Reopen
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactList;
