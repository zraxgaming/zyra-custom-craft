
import emailjs from '@emailjs/browser';

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const orderTemplateId = import.meta.env.VITE_EMAILJS_ORDER_TEMPLATE_ID;
const newsletterTemplateId = import.meta.env.VITE_EMAILJS_NEWSLETTER_TEMPLATE_ID;

// Initialize EmailJS
emailjs.init(publicKey);

export const sendOrderEmail = async (orderData: {
  customerName: string;
  orderId: string;
  status: string;
  customerEmail: string;
}) => {
  try {
    const templateParams = {
      customer_name: orderData.customerName,
      order_id: orderData.orderId,
      status: orderData.status,
      customer_email: orderData.customerEmail,
      to_email: orderData.customerEmail
    };

    const response = await emailjs.send(
      serviceId,
      orderTemplateId,
      templateParams
    );

    console.log('Order email sent successfully:', response);
    return { success: true, response };
  } catch (error) {
    console.error('Error sending order email:', error);
    return { success: false, error };
  }
};

export const sendNewsletterEmail = async (emailData: {
  email: string;
  content: string;
  unsubscribeLink?: string;
}) => {
  try {
    const templateParams = {
      to_email: emailData.email,
      content: emailData.content,
      unsubscribe_link: emailData.unsubscribeLink || `${window.location.origin}/newsletter/unsubscribe?email=${emailData.email}`
    };

    const response = await emailjs.send(
      serviceId,
      newsletterTemplateId,
      templateParams
    );

    console.log('Newsletter email sent successfully:', response);
    return { success: true, response };
  } catch (error) {
    console.error('Error sending newsletter email:', error);
    return { success: false, error };
  }
};
