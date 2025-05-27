
import React, { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const MaintenanceBanner = () => {
  const [maintenanceData, setMaintenanceData] = useState<{
    isActive: boolean;
    message: string;
  } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchMaintenanceStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('maintenance_mode')
          .select('is_active, message')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching maintenance status:', error);
          return;
        }

        if (data && data.is_active) {
          setMaintenanceData({
            isActive: data.is_active,
            message: data.message || 'We are currently performing maintenance. Some features may be temporarily unavailable.'
          });
          setIsVisible(true);
        }
      } catch (error) {
        console.error('Error in fetchMaintenanceStatus:', error);
      }
    };

    fetchMaintenanceStatus();

    // Set up real-time subscription for maintenance status changes
    const subscription = supabase
      .channel('maintenance_mode_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'maintenance_mode' 
        }, 
        (payload) => {
          console.log('Maintenance mode changed:', payload);
          if (payload.new && typeof payload.new === 'object') {
            const newData = payload.new as any;
            if (newData.is_active) {
              setMaintenanceData({
                isActive: newData.is_active,
                message: newData.message || 'We are currently performing maintenance. Some features may be temporarily unavailable.'
              });
              setIsVisible(true);
            } else {
              setIsVisible(false);
              setMaintenanceData(null);
            }
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (!isVisible || !maintenanceData?.isActive) {
    return null;
  }

  return (
    <div className="relative z-50 animate-slide-down">
      <Alert className="rounded-none border-l-0 border-r-0 border-t-0 bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-600 animate-pulse-gentle">
        <AlertTriangle className="h-5 w-5 text-white animate-wiggle" />
        <AlertDescription className="flex items-center justify-between w-full">
          <span className="font-medium text-white">
            {maintenanceData.message}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="text-white hover:bg-white/20 h-auto p-1 animate-scale-in"
            style={{animationDelay: '0.5s'}}
          >
            <X className="h-4 w-4" />
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default MaintenanceBanner;
