
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAuth } from "@/hooks/use-auth";
import { Search, Eye, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { ContactSubmission } from "@/types/contact";

const ContactSubmissions = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
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

  // Fetch submissions
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const { data, error } = await supabase
          .from("contact_submissions")
          .select("*")
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        
        // Map the data to ensure proper typing
        const mappedSubmissions: ContactSubmission[] = (data || []).map(submission => ({
          ...submission,
          status: submission.status as 'unread' | 'read' | 'replied'
        }));
        
        setSubmissions(mappedSubmissions);
        setFilteredSubmissions(mappedSubmissions);
      } catch (error: any) {
        toast({
          title: "Error fetching contact submissions",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSubmissions();
  }, [toast]);

  // Filter submissions based on search and status
  useEffect(() => {
    let filtered = submissions;
    
    if (searchTerm) {
      filtered = filtered.filter(submission =>
        submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterStatus !== "all") {
      filtered = filtered.filter(submission => submission.status === filterStatus);
    }
    
    setFilteredSubmissions(filtered);
  }, [submissions, searchTerm, filterStatus]);

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

  const getStatusCount = (status: string) => {
    if (status === "all") return submissions.length;
    return submissions.filter(s => s.status === status).length;
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

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Contact Submissions</h1>
        </div>
        
        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card 
            className={`cursor-pointer transition-colors ${filterStatus === 'all' ? 'ring-2 ring-zyra-purple' : ''} bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700`}
            onClick={() => setFilterStatus('all')}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{getStatusCount('all')}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">All Submissions</div>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer transition-colors ${filterStatus === 'unread' ? 'ring-2 ring-zyra-purple' : ''} bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700`}
            onClick={() => setFilterStatus('unread')}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{getStatusCount('unread')}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Unread</div>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer transition-colors ${filterStatus === 'read' ? 'ring-2 ring-zyra-purple' : ''} bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700`}
            onClick={() => setFilterStatus('read')}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">{getStatusCount('read')}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Read</div>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer transition-colors ${filterStatus === 'replied' ? 'ring-2 ring-zyra-purple' : ''} bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700`}
            onClick={() => setFilterStatus('replied')}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{getStatusCount('replied')}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Replied</div>
            </CardContent>
          </Card>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search submissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zyra-purple"></div>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="mb-4 mx-auto bg-muted w-16 h-16 rounded-full flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-gray-100">
                {searchTerm || filterStatus !== 'all' ? 'No matching submissions' : 'No contact submissions found'}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'Contact submissions will appear here when customers reach out.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 dark:border-gray-700">
                  <TableHead className="text-gray-900 dark:text-gray-100">Name</TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">Email</TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">Subject</TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">Status</TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">Date</TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((submission) => (
                  <TableRow key={submission.id} className="border-gray-200 dark:border-gray-700">
                    <TableCell className="font-medium text-gray-900 dark:text-gray-100">{submission.name}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">{submission.email}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {submission.subject ? (
                        <span className="max-w-xs truncate block">{submission.subject}</span>
                      ) : (
                        <span className="text-gray-400 italic">No subject</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(submission.status)}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {format(new Date(submission.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/admin/contact/${submission.id}`)}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ContactSubmissions;
