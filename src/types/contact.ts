
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactSubmission extends ContactFormData {
  id: string;
  status: 'unread' | 'read' | 'replied';
  admin_reply?: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
}
