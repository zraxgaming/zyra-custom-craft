
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/components/cart/CartProvider';
import { useSiteConfig } from '@/hooks/use-site-config';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PushNotificationManagerProps {
  enableAbandonedCart?: boolean;
  enableOrderUpdates?: boolean;
  enableStockAlerts?: boolean;
  enablePromotions?: boolean;
}

const PushNotificationManager: React.FC<PushNotificationManagerProps> = ({
  enableAbandonedCart = true,
  enableOrderUpdates = true,
  enableStockAlerts = true,
  enablePromotions = true
}) => {
  const { user } = useAuth();
  const { items } = useCart();
  const { config } = useSiteConfig();
  const { toast } = useToast();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    checkPushSupport();
  }, []);

  useEffect(() => {
    if (user && isSubscribed) {
      setupOrderUpdatesListener();
      setupStockAlertsListener();
    }
  }, [user, isSubscribed]);

  useEffect(() => {
    if (enableAbandonedCart && user && items.length > 0) {
      scheduleAbandonedCartNotification();
    }
  }, [items, user, enableAbandonedCart]);

  const checkPushSupport = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const existingSubscription = await registration.pushManager.getSubscription();
        
        if (existingSubscription) {
          setSubscription(existingSubscription);
          setIsSubscribed(true);
        }
      } catch (error) {
        console.error('Error checking push subscription:', error);
      }
    }
  };

  const subscribeToPush = async () => {
    try {
      const permission = await Notification.requestPermission();
      
      if (permission !== 'granted') {
        toast({
          title: "Notifications blocked",
          description: "Please enable notifications in your browser settings.",
          variant: "destructive"
        });
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(config?.vapid_public_key || '')
      });

      setSubscription(newSubscription);
      setIsSubscribed(true);

      // Save subscription to database
      if (user) {
        await supabase
          .from('push_subscriptions')
          .upsert({
            user_id: user.id,
            subscription: newSubscription.toJSON(),
            enabled: true
          });
      }

      toast({
        title: "Notifications enabled",
        description: "You'll receive updates about your orders and special offers.",
      });
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      toast({
        title: "Error enabling notifications",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  const scheduleAbandonedCartNotification = () => {
    // Clear any existing timeouts
    if (window.abandonedCartTimeout) {
      clearTimeout(window.abandonedCartTimeout);
    }

    // Schedule notification for 30 minutes
    window.abandonedCartTimeout = setTimeout(async () => {
      if (items.length > 0 && user) {
        await sendPushNotification({
          title: "Don't forget your cart! 🛍️",
          body: `You have ${items.length} item(s) waiting for you`,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          tag: 'abandoned-cart',
          data: {
            type: 'abandoned-cart',
            url: '/cart'
          }
        });
      }
    }, 30 * 60 * 1000); // 30 minutes
  };

  const setupOrderUpdatesListener = () => {
    if (!user) return;

    const channel = supabase
      .channel('order-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${user.id}`
        },
        async (payload) => {
          const order = payload.new;
          const oldOrder = payload.old;

          if (order.status !== oldOrder.status) {
            let title = "Order Update";
            let body = "";

            switch (order.status) {
              case 'processing':
                title = "Order Confirmed! ✅";
                body = `Your order #${order.id.slice(0, 8)} is being processed`;
                break;
              case 'shipped':
                title = "Order Shipped! 📦";
                body = `Your order #${order.id.slice(0, 8)} is on its way`;
                break;
              case 'delivered':
                title = "Order Delivered! 🎉";
                body = `Your order #${order.id.slice(0, 8)} has been delivered`;
                break;
            }

            await sendPushNotification({
              title,
              body,
              icon: '/icon-192.png',
              tag: 'order-update',
              data: {
                type: 'order-update',
                orderId: order.id,
                url: `/order/${order.id}`
              }
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const setupStockAlertsListener = () => {
    const channel = supabase
      .channel('stock-alerts')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'products'
        },
        async (payload) => {
          const product = payload.new;
          const oldProduct = payload.old;

          // Low stock alert
          if (product.stock_quantity <= 5 && oldProduct.stock_quantity > 5) {
            await sendPushNotification({
              title: "Low Stock Alert! ⚠️",
              body: `${product.name} is running low (${product.stock_quantity} left)`,
              icon: '/icon-192.png',
              tag: 'stock-alert',
              data: {
                type: 'stock-alert',
                productId: product.id,
                url: `/product/${product.id}`
              }
            });
          }

          // Back in stock
          if (!oldProduct.in_stock && product.in_stock) {
            await sendPushNotification({
              title: "Back in Stock! 🎉",
              body: `${product.name} is available again`,
              icon: '/icon-192.png',
              tag: 'back-in-stock',
              data: {
                type: 'back-in-stock',
                productId: product.id,
                url: `/product/${product.id}`
              }
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendPushNotification = async (notificationData: {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    tag?: string;
    data?: any;
  }) => {
    if (!isSubscribed || !subscription) return;

    try {
      await supabase.functions.invoke('send-push-notification', {
        body: {
          subscription: subscription.toJSON(),
          notification: notificationData
        }
      });
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  };

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  // Auto-subscribe if user is logged in and hasn't been asked
  useEffect(() => {
    if (user && !isSubscribed && !localStorage.getItem('push-permission-asked')) {
      const timer = setTimeout(() => {
        subscribeToPush();
        localStorage.setItem('push-permission-asked', 'true');
      }, 5000); // Ask after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [user, isSubscribed]);

  return null; // This component doesn't render anything
};

export default PushNotificationManager;
