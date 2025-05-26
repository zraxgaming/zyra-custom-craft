
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, BellOff, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PWANotifications: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    checkNotificationSupport();
    checkPermissionStatus();
  }, []);

  const checkNotificationSupport = () => {
    const supported = 'Notification' in window && 'serviceWorker' in navigator;
    setIsSupported(supported);
  };

  const checkPermissionStatus = () => {
    if ('Notification' in window) {
      const currentPermission = Notification.permission;
      setPermission(currentPermission);
      setIsEnabled(currentPermission === 'granted');
    }
  };

  const requestNotificationPermission = async () => {
    if (!isSupported) {
      toast({
        title: "Not supported",
        description: "Notifications are not supported in this browser",
        variant: "destructive"
      });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      setIsEnabled(permission === 'granted');

      if (permission === 'granted') {
        toast({
          title: "Notifications enabled!",
          description: "You'll now receive push notifications from Zyra",
        });
        
        // Send a test notification
        new Notification('Welcome to Zyra!', {
          body: 'You will now receive notifications about your orders and promotions.',
          icon: '/icon-192.png',
          badge: '/icon-192.png'
        });
      } else {
        toast({
          title: "Notifications blocked",
          description: "Please enable notifications in your browser settings",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast({
        title: "Error",
        description: "Failed to request notification permission",
        variant: "destructive"
      });
    }
  };

  const disableNotifications = () => {
    setIsEnabled(false);
    toast({
      title: "Notifications disabled",
      description: "You won't receive push notifications anymore",
    });
  };

  const sendTestNotification = () => {
    if (permission === 'granted') {
      new Notification('Test Notification', {
        body: 'This is a test notification from Zyra!',
        icon: '/icon-192.png',
        badge: '/icon-192.png'
      });
    }
  };

  if (!isSupported) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            Notifications Not Supported
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Your browser doesn't support push notifications.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Push Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Notification Status</h4>
            <p className="text-sm text-muted-foreground">
              {permission === 'granted' ? 'Enabled' : 
               permission === 'denied' ? 'Blocked' : 'Not requested'}
            </p>
          </div>
          <div className={`w-3 h-3 rounded-full ${
            permission === 'granted' ? 'bg-green-500' :
            permission === 'denied' ? 'bg-red-500' : 'bg-yellow-500'
          }`} />
        </div>

        <div className="space-y-2">
          {permission !== 'granted' && (
            <Button
              onClick={requestNotificationPermission}
              className="w-full hover:scale-105 transition-transform duration-200"
            >
              <Bell className="h-4 w-4 mr-2" />
              Enable Notifications
            </Button>
          )}

          {permission === 'granted' && isEnabled && (
            <>
              <Button
                onClick={sendTestNotification}
                variant="outline"
                className="w-full hover:scale-105 transition-transform duration-200"
              >
                Send Test Notification
              </Button>
              
              <Button
                onClick={disableNotifications}
                variant="outline"
                className="w-full hover:scale-105 transition-transform duration-200"
              >
                <BellOff className="h-4 w-4 mr-2" />
                Disable Notifications
              </Button>
            </>
          )}
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Get notified about order updates</p>
          <p>• Receive exclusive offers and promotions</p>
          <p>• Stay updated on new product launches</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PWANotifications;
