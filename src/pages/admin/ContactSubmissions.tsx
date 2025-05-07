
import React, { useState, useEffect } from "react";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import AdminLayout from "@/components/admin/AdminLayout";
import { Search, Mail, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'read' | 'unread' | 'replied';
  created_at: string;
}

const ContactSubmissions = () => {
  const { isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [isSubmissionsLoading, setIsSubmissionsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
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

  // Fetch submissions
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
        setSubmissions(data || []);
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

  const updateSubmissionStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ status })
        .eq("id", id);
        
      if (error) throw error;
      
      // Update the local state
      setSubmissions(
        submissions.map((submission) => 
          submission.id === id ? { ...submission, status: status as 'read' | 'unread' | 'replied' } : submission
        )
      );
      
      toast({
        title: "Submission updated",
        description: `Submission status changed to ${status}`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating submission",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleViewSubmission = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    // Mark as read if currently unread
    if (submission.status === 'unread') {
      updateSubmissionStatus(submission.id, 'read');
    }
  };

  const filteredSubmissions = submissions.filter((submission) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      submission.name.toLowerCase().includes(searchLower) ||
      submission.email.toLowerCase().includes(searchLower) ||
      submission.subject.toLowerCase().includes(searchLower) ||
      submission.message.toLowerCase().includes(searchLower)
    );
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'unread':
        return <Badge variant="default" className="bg-blue-500">Unread</Badge>;
      case 'read':
        return <Badge variant="outline" className="text-gray-500">Read</Badge>;
      case 'replied':
        return <Badge variant="default" className="bg-green-500">Replied</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

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
              <SelectItem value="">All statuses</SelectItem>
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
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((submission) => (
                  <TableRow key={submission.id} className={submission.status === 'unread' ? "bg-blue-50" : ""}>
                    <TableCell>{format(new Date(submission.created_at), "MMM d, yyyy")}</TableCell>
                    <TableCell className="font-medium">{submission.name}</TableCell>
                    <TableCell>{submission.email}</TableCell>
                    <TableCell>{submission.subject}</TableCell>
                    <TableCell>{getStatusBadge(submission.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewSubmission(submission)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            updateSubmissionStatus(submission.id, 'replied');
                            window.location.href = `mailto:${submission.email}?subject=Re: ${submission.subject}`;
                          }}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Dialog open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Message from {selectedSubmission?.name}</DialogTitle>
            <DialogDescription>
              Received on {selectedSubmission && format(new Date(selectedSubmission.created_at), "PPpp")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <p className="text-sm font-medium text-gray-500">From</p>
              <p>{selectedSubmission?.name} ({selectedSubmission?.email})</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Subject</p>
              <p className="font-medium">{selectedSubmission?.subject}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Message</p>
              <Textarea 
                value={selectedSubmission?.message} 
                readOnly 
                className="min-h-[150px] mt-2"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setSelectedSubmission(null)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  if (selectedSubmission) {
                    updateSubmissionStatus(selectedSubmission.id, 'replied');
                    window.location.href = `mailto:${selectedSubmission.email}?subject=Re: ${selectedSubmission.subject}`;
                  }
                }}
              >
                <Mail className="h-4 w-4 mr-2" />
                Reply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ContactSubmissions;
