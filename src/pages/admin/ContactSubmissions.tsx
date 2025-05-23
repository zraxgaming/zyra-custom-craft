
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import AdminLayout from "@/components/admin/AdminLayout";
import { Search, Mail, CheckCircle, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
        let query = supabase
          .from("contact_submissions")
          .select("*")
          .order("created_at", { ascending: false });
          
        if (statusFilter) {
          query = query.eq("status", statusFilter);
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

  const updateSubmissionStatus = async (id: string, status: "unread" | "read" | "replied") => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ status })
        .eq("id", id);
        
      if (error) throw error;
      
      setSubmissions(submissions.map(submission => 
        submission.id === id ? { ...submission, status } : submission
      ));
      
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

  const sendReply = async (submission: ContactSubmission) => {
    try {
      // Mark as replied
      await updateSubmissionStatus(submission.id, "replied");
      
      // Open email client
      const subject = `Re: ${submission.subject}`;
      const mailtoLink = `mailto:${submission.email}?subject=${encodeURIComponent(subject)}`;
      window.open(mailtoLink);
      
      toast({
        title: "Email client opened",
        description: `Opening email to reply to ${submission.name}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredSubmissions = submissions.filter((submission) => {
    if (!searchTerm) return true;
    return (
      submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Contact Submissions</h1>
          <div className="text-sm text-muted-foreground">
            {submissions.length} total submissions
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Filter & Search</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or subject..."
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
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Submissions List</CardTitle>
          </CardHeader>
          <CardContent>
            {isSubmissionsLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zyra-purple"></div>
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  {searchTerm || statusFilter ? "No submissions found matching your criteria." : "No contact submissions yet."}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
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
                      <TableRow
                        key={submission.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => navigate(`/admin/contact/${submission.id}`)}
                      >
                        <TableCell>
                          {format(new Date(submission.created_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="font-medium">{submission.name}</TableCell>
                        <TableCell>
                          <a
                            href={`mailto:${submission.email}`}
                            className="text-zyra-purple hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {submission.email}
                          </a>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {submission.subject}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              submission.status === "unread" ? "destructive" :
                              submission.status === "read" ? "secondary" :
                              "default"
                            }
                          >
                            {submission.status}
                          </Badge>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <div className="flex space-x-2">
                            {submission.status === "unread" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateSubmissionStatus(submission.id, "read")}
                                title="Mark as Read"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => sendReply(submission)}
                              title="Reply via Email"
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/admin/contact/${submission.id}`)}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ContactSubmissions;
