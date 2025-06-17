
import { supabase } from '@/integrations/supabase/client';

export const sendOrderEmail = async (orderData: {
  customerName: string;
  orderId: string;
  status: string;
  customerEmail: string;
  items?: any[];
  totalAmount?: number;
}) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-order-email', {
      body: {
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        orderId: orderData.orderId,
        status: orderData.status,
        totalAmount: orderData.totalAmount,
        items: orderData.items
      }
    });

    if (error) throw error;
    
    console.log('Order email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending order email:', error);
    return { success: false, error };
  }
};

export const sendNewsletterBatch = async (emailData: {
  emails: string[];
  subject: string;
  content: string;
  unsubscribeLink?: string;
}) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-newsletter-batch', {
      body: {
        emails: emailData.emails,
        subject: emailData.subject,
        content: emailData.content,
        unsubscribeLink: emailData.unsubscribeLink || `${window.location.origin}/newsletter/unsubscribe`
      }
    });

    if (error) throw error;
    
    console.log('Newsletter batch sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending newsletter batch:', error);
    return { success: false, error };
  }
};

// Legacy function for individual newsletter emails
export const sendNewsletterEmail = async (emailData: {
  email: string;
  content: string;
  subject?: string;
  unsubscribeLink?: string;
}) => {
  return sendNewsletterBatch({
    emails: [emailData.email],
    subject: emailData.subject || 'Newsletter Update',
    content: emailData.content,
    unsubscribeLink: emailData.unsubscribeLink
  });
};
