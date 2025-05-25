
import React, { useEffect } from 'react';
import { useCart } from '@/components/cart/CartProvider';
import { useAuth } from '@/hooks/use-auth';
import { useSiteConfig } from '@/hooks/use-site-config';
import { supabase } from '@/integrations/supabase/client';

interface EmailNotificationServiceProps {
  enableAbandonedCart?: boolean;
  abandonedCartDelay?: number;
}

const EmailNotificationService: React.FC<EmailNotificationServiceProps> = ({
  enableAbandonedCart = true,
  abandonedCartDelay = 30
}) => {
  const { items } = useCart();
  const { user } = useAuth();
  const { config } = useSiteConfig();

  useEffect(() => {
    if (!enableAbandonedCart || !user || items.length === 0 || !config.abandoned_cart_enabled) {
      return;
    }

    const timer = setTimeout(() => {
      sendAbandonedCartEmail();
    }, abandonedCartDelay * 60 * 1000);

    return () => clearTimeout(timer);
  }, [items, user, enableAbandonedCart, abandonedCartDelay, config]);

  const sendAbandonedCartEmail = async () => {
    if (!user?.email || !config.brevo_api_key) return;

    try {
      await supabase.functions.invoke('send-brevo-email', {
        body: {
          to: user.email,
          subject: 'Don\'t forget your items in cart!',
          content: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Hi there!</h2>
              <p>You have ${items.length} item(s) waiting in your cart at Zyra.</p>
              <p>Don't miss out on these great products!</p>
              <a href="${window.location.origin}/cart" style="background-color: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
                Complete Your Purchase
              </a>
              <p>Thanks for shopping with us!</p>
            </div>
          `,
          type: 'abandoned-cart'
        }
      });
    } catch (error) {
      console.error('Failed to send abandoned cart email:', error);
    }
  };

  const sendOrderConfirmation = async (orderData: any) => {
    if (!user?.email || !config.brevo_api_key) return;

    try {
      await supabase.functions.invoke('send-brevo-email', {
        body: {
          to: user.email,
          subject: 'Order Confirmation - Thank You!',
          content: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Order Confirmed!</h2>
              <p>Thank you for your order. We're preparing it for shipment.</p>
              <p><strong>Order ID:</strong> ${orderData.id}</p>
              <p><strong>Total:</strong> $${orderData.total_amount}</p>
              <p>You'll receive a tracking number once your order ships.</p>
            </div>
          `,
          type: 'order-confirmation'
        }
      });
    } catch (error) {
      console.error('Failed to send order confirmation:', error);
    }
  };

  return null;
};

export default EmailNotificationService;
