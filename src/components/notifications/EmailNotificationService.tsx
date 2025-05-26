
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
  const siteConfigResult = useSiteConfig();

  useEffect(() => {
    if (!enableAbandonedCart || !user || items.length === 0 || !siteConfigResult.data?.abandoned_cart_enabled || !siteConfigResult.data?.brevo_api_key) {
      return;
    }

    const timer = setTimeout(() => {
      sendAbandonedCartEmail();
    }, abandonedCartDelay * 60 * 1000);

    return () => clearTimeout(timer);
  }, [items, user, enableAbandonedCart, abandonedCartDelay, siteConfigResult.data]);

  const sendAbandonedCartEmail = async () => {
    if (!user?.email || !siteConfigResult.data?.brevo_api_key) return;

    try {
      console.log('Sending abandoned cart email to:', user.email);
      
      const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Don't forget your items!</h2>
            <p style="color: #666; line-height: 1.6;">Hi there!</p>
            <p style="color: #666; line-height: 1.6;">
              You have ${items.length} item(s) waiting in your cart at ${siteConfigResult.data?.site_name || 'Zyra'}. 
              Don't miss out on these great products!
            </p>
            <div style="margin: 30px 0;">
              ${items.map(item => `
                <div style="border-bottom: 1px solid #eee; padding: 15px 0;">
                  <strong>${item.name || 'Product'}</strong><br>
                  <span style="color: #666;">Quantity: ${item.quantity}</span><br>
                  <span style="color: #8B5CF6; font-weight: bold;">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              `).join('')}
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${window.location.origin}/cart" 
                 style="background-color: #8B5CF6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Complete Your Purchase
              </a>
            </div>
            <p style="color: #666; line-height: 1.6;">Thanks for shopping with us!</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">
              This email was sent because you have items in your cart. 
              If you no longer wish to receive these emails, you can unsubscribe in your account settings.
            </p>
          </div>
        </div>
      `;

      await supabase.functions.invoke('send-brevo-email', {
        body: {
          to: user.email,
          subject: `Don't forget your ${items.length} item(s) in cart! - ${siteConfigResult.data?.site_name || 'Zyra'}`,
          content: emailContent,
          type: 'abandoned-cart',
          api_key: siteConfigResult.data?.brevo_api_key
        }
      });
      
      console.log('Abandoned cart email sent successfully');
    } catch (error) {
      console.error('Failed to send abandoned cart email:', error);
    }
  };

  const sendOrderConfirmation = async (orderData: any) => {
    if (!user?.email || !siteConfigResult.data?.brevo_api_key) return;

    try {
      console.log('Sending order confirmation email to:', user.email);
      
      const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #28a745; margin-bottom: 20px;">Order Confirmed! 🎉</h2>
            <p style="color: #666; line-height: 1.6;">Thank you for your order! We're preparing it for shipment.</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #333;"><strong>Order ID:</strong> #${orderData.id?.slice(0, 8)}</p>
              <p style="margin: 10px 0 0 0; color: #333;"><strong>Total Amount:</strong> $${orderData.total_amount}</p>
              <p style="margin: 10px 0 0 0; color: #333;"><strong>Payment Status:</strong> ${orderData.payment_status}</p>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              You'll receive a tracking number once your order ships. 
              We'll keep you updated on your order status.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${window.location.origin}/account" 
                 style="background-color: #8B5CF6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                View Order Details
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              Thank you for choosing ${siteConfigResult.data?.site_name || 'Zyra'}!
            </p>
          </div>
        </div>
      `;

      await supabase.functions.invoke('send-brevo-email', {
        body: {
          to: user.email,
          subject: `Order Confirmation #${orderData.id?.slice(0, 8)} - ${siteConfigResult.data?.site_name || 'Zyra'}`,
          content: emailContent,
          type: 'order-confirmation',
          api_key: siteConfigResult.data?.brevo_api_key
        }
      });
      
      console.log('Order confirmation email sent successfully');
    } catch (error) {
      console.error('Failed to send order confirmation:', error);
    }
  };

  const sendNewsletterWelcome = async (email: string, name?: string) => {
    if (!siteConfigResult.data?.brevo_api_key || !siteConfigResult.data?.newsletter_enabled) return;

    try {
      console.log('Sending newsletter welcome email to:', email);
      
      const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #8B5CF6; margin-bottom: 20px;">Welcome to ${siteConfigResult.data?.site_name || 'Zyra'}! 🎉</h2>
            <p style="color: #666; line-height: 1.6;">
              ${name ? `Hi ${name}` : 'Hello'}! Thank you for subscribing to our newsletter.
            </p>
            <p style="color: #666; line-height: 1.6;">
              You'll be the first to know about new products, exclusive offers, and exciting updates from our store.
            </p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center;">
              <h3 style="color: #333; margin-top: 0;">What to expect:</h3>
              <ul style="list-style: none; padding: 0; color: #666;">
                <li>✨ New product launches</li>
                <li>🎯 Exclusive member discounts</li>
                <li>📦 Special offers and promotions</li>
                <li>🛍️ Personalized recommendations</li>
              </ul>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${window.location.origin}/shop" 
                 style="background-color: #8B5CF6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Start Shopping
              </a>
            </div>
            <p style="color: #666; line-height: 1.6; text-align: center;">
              Welcome to the ${siteConfigResult.data?.site_name || 'Zyra'} family!
            </p>
          </div>
        </div>
      `;

      await supabase.functions.invoke('send-brevo-email', {
        body: {
          to: email,
          subject: `Welcome to ${siteConfigResult.data?.site_name || 'Zyra'} Newsletter! 🎉`,
          content: emailContent,
          type: 'newsletter-welcome',
          api_key: siteConfigResult.data?.brevo_api_key
        }
      });
      
      console.log('Newsletter welcome email sent successfully');
    } catch (error) {
      console.error('Failed to send newsletter welcome email:', error);
    }
  };

  // Expose functions for use in other components
  React.useEffect(() => {
    (window as any).sendOrderConfirmation = sendOrderConfirmation;
    (window as any).sendNewsletterWelcome = sendNewsletterWelcome;
  }, [user, siteConfigResult.data]);

  return null;
};

export default EmailNotificationService;
