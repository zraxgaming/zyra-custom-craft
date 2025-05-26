
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PushNotificationManager: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    checkPushSupport();
    if (user) {
      registerServiceWorker();
    }
  }, [user]);

  const checkPushSupport = () => {
    const supported = 'serviceWorker' in navigator && 'PushManager' in window;
    setIsSupported(supported);
  };

  const registerServiceWorker = async () => {
    if (!isSupported) return;

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);

      // Check for existing subscription
      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        setSubscription(existingSubscription);
      }
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  };

  const subscribeToPush = async () => {
    if (!isSupported || !user) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          // This would be your VAPID public key in a real app
          'BEl62iUYgUivxIkv69yViEuiBIa40HI6Gat3VhLryfuuQJ4U-Byt6QwPgQ4VvG0_LsQGHfHaQjc4LwLg_CJhP5Y'
        )
      });

      setSubscription(subscription);
      
      // In a real app, you'd send this subscription to your server
      console.log('Push subscription:', subscription);
      
      toast({
        title: "Push notifications enabled!",
        description: "You'll receive notifications about your orders and updates.",
      });
    } catch (error) {
      console.error('Push subscription failed:', error);
      toast({
        title: "Subscription failed",
        description: "Could not enable push notifications",
        variant: "destructive"
      });
    }
  };

  const unsubscribeFromPush = async () => {
    if (!subscription) return;

    try {
      await subscription.unsubscribe();
      setSubscription(null);
      
      toast({
        title: "Push notifications disabled",
        description: "You won't receive push notifications anymore",
      });
    } catch (error) {
      console.error('Push unsubscription failed:', error);
    }
  };

  // Helper function to convert VAPID key
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

  // This component manages push notifications in the background
  // It doesn't render any UI
  return null;
};

export default PushNotificationManager;
