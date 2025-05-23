
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  admin_reply?: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
}
