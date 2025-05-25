
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Contact = () => {
  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Contact Messages</h1>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Contact Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No contact messages found.</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Contact;
