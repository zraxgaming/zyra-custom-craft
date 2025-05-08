
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, User, Calendar, Tag } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const ContactView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submission, setSubmission] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const { data, error } = await supabase
          .from("contact_submissions")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          throw error;
        }

        setSubmission(data);
      } catch (error) {
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

    if (id) {
      fetchSubmission();
    }
  }, [id, navigate, toast]);

  const updateStatus = async (status: string) => {
    if (!submission) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ status })
        .eq("id", submission.id);

      if (error) {
        throw error;
      }

      setSubmission({ ...submission, status });
      toast({
        title: "Status updated",
        description: `Marked as ${status}`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
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
      <div className="p-6">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/contact")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to submissions
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Contact Submission Details</CardTitle>
              <Badge variant={submission.status === "read" ? "outline" : "default"}>
                {submission.status === "read" ? "Read" : "Unread"}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-500 flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      Name
                    </div>
                    <div className="text-lg">{submission.name}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-500 flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </div>
                    <div className="text-lg">
                      <a href={`mailto:${submission.email}`} className="text-blue-600 hover:underline">
                        {submission.email}
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-500 flex items-center">
                    <Tag className="h-4 w-4 mr-1" />
                    Subject
                  </div>
                  <div className="text-lg font-medium">{submission.subject}</div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-500">Message</div>
                  <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap">{submission.message}</div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-500 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Date Received
                  </div>
                  <div>{format(new Date(submission.created_at), "PPpp")}</div>
                </div>
              </div>
              
              <div className="mt-6 flex flex-wrap gap-2">
                {submission.status === "unread" ? (
                  <Button 
                    onClick={() => updateStatus("read")} 
                    disabled={isUpdating}
                  >
                    Mark as Read
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={() => updateStatus("unread")} 
                    disabled={isUpdating}
                  >
                    Mark as Unread
                  </Button>
                )}
                <Button 
                  variant="secondary"
                  onClick={() => window.location.href = `mailto:${submission.email}?subject=Re: ${submission.subject}`}
                >
                  Reply via Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ContactView;
