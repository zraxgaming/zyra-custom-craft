import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle } from "lucide-react";
import { format } from "date-fns";

interface ContactListProps {
  submissions: Array<{
    id: string;
    created_at: string;
    name: string;
    email: string;
    subject: string;
    status: "unread" | "read" | "replied";
  }>;
  updateStatus: (id: string, status: "unread" | "read" | "replied") => Promise<void>;
  sendReply: (submission: { id: string; email: string; subject: string }) => Promise<void>;
  navigate: (path: string) => void;
}

const ContactList: React.FC<ContactListProps> = ({ submissions, updateStatus, sendReply, navigate }) => {
  if (!submissions || submissions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No contact submissions found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-auto">
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
          {submissions.map((submission) => (
            <TableRow
              key={submission.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => navigate(`/admin/contact/${submission.id}`)}
            >
              <TableCell>{format(new Date(submission.created_at), "MMM d, yyyy")}</TableCell>
              <TableCell>{submission.name}</TableCell>
              <TableCell>
                <a
                  href={`mailto:${submission.email}`}
                  className="text-zyra-purple hover:underline truncate"
                  onClick={(e) => e.stopPropagation()}
                >
                  {submission.email}
                </a>
              </TableCell>
              <TableCell className="truncate">{submission.subject}</TableCell>
              <TableCell>
                <Badge
                  className={
                    submission.status === "unread"
                      ? "bg-red-100 text-red-800"
                      : submission.status === "read"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
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
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(submission.id, "read");
                      }}
                      title="Mark as Read"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      sendReply(submission);
                    }}
                    title="Reply"
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
  );
};

export default ContactList;
