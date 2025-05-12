
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import AdminLayout from "@/components/admin/AdminLayout";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ContactSubmission } from "@/types/contact";
import ContactList from "@/components/admin/contact/ContactList";

const ContactSubmissions: React.FC = () => {
  const { isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isSubmissionsLoading, setIsSubmissionsLoading] = useState(true);
  const { toast } = useToast();

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate("/");
      toast({
        title: "Access denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
    }
  }, [isAdmin, isLoading, navigate, toast]);

  // Fetch contact submissions
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const query = supabase
          .from("contact_submissions")
          .select("*")
          .order("created_at", { ascending: false });
          
        if (statusFilter) {
          query.eq("status", statusFilter);
        }
        
        const { data, error } = await query;
          
        if (error) throw error;
        
        // Ensure we cast the data correctly
        if (data) {
          const typedSubmissions: ContactSubmission[] = data.map(item => ({
            ...item,
            status: item.status as "unread" | "read" | "replied"
          }));
          setSubmissions(typedSubmissions);
        }
      } catch (error: any) {
        toast({
          title: "Error fetching submissions",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsSubmissionsLoading(false);
      }
    };
    
    fetchSubmissions();
  }, [toast, statusFilter]);

  const updateSubmissionStatus = async (id: string, status: "unread" | "read" | "replied") => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ status })
        .eq("id", id);
        
      if (error) throw error;
      
      // Update the local state
      setSubmissions(
        submissions.map(submission => 
          submission.id === id ? { ...submission, status } : submission
        )
      );
      
      toast({
        title: "Status updated",
        description: `Submission marked as ${status}`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Send a reply email to the contact submission
  const sendReply = async (submission: ContactSubmission) => {
    try {
      // In a real application, this would send an email via an API
      // For now, we'll just mark it as replied
      await updateSubmissionStatus(submission.id, "replied");
      
      toast({
        title: "Reply sent",
        description: `Your reply to ${submission.name} has been sent.`,
      });
    } catch (error: any) {
      toast({
        title: "Error sending reply",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredSubmissions = submissions.filter((submission) => {
    if (!searchTerm) return true;
    
    // Search by name
    if (submission.name.toLowerCase().includes(searchTerm.toLowerCase())) return true;
    
    // Search by email
    if (submission.email.toLowerCase().includes(searchTerm.toLowerCase())) return true;
    
    // Search by subject
    if (submission.subject.toLowerCase().includes(searchTerm.toLowerCase())) return true;
    
    return false;
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zyra-purple"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Contact Submissions</h1>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search submissions..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="replied">Replied</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {isSubmissionsLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zyra-purple"></div>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="bg-muted rounded-lg p-12 text-center">
            <h3 className="text-xl font-medium mb-2">No submissions found</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter ? "Try changing your search or filter." : "No contact form submissions yet."}
            </p>
          </div>
        ) : (
          <ContactList 
            submissions={filteredSubmissions} 
            updateStatus={updateSubmissionStatus}
            sendReply={sendReply}
            navigate={navigate}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default ContactSubmissions;
