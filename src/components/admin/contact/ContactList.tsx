
// If file exists, implement/fix. If not, create basic admin contact submissions viewer.
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw } from "lucide-react";

const ContactList: React.FC = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
      if (!error && data) setContacts(data);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-10"><RefreshCw className="animate-spin h-6 w-6" /></div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {contacts.length === 0 && <div className="text-center text-sm text-muted-foreground py-10">No contacts found.</div>}
          {contacts.map((c) => (
            <div key={c.id} className="border rounded-lg p-3 mb-2">
              <div className="flex items-center gap-2">
                <b>{c.name}</b>
                <Badge>{c.status}</Badge>
                <span className="text-xs text-muted-foreground ml-auto">{new Date(c.created_at).toLocaleString()}</span>
              </div>
              <div><span className="font-medium">Email:</span> {c.email}</div>
              <div><span className="font-medium">Subject:</span> {c.subject}</div>
              <div>{c.message}</div>
              {c.admin_reply && (
                <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-muted-foreground">
                  <b>Admin Reply:</b> {c.admin_reply}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
export default ContactList;
