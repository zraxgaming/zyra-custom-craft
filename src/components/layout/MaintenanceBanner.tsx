
import React, { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, X, Wrench, Settings } from "lucide-react";
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
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 shadow-2xl border-b-4 border-orange-300 dark:border-orange-700">
        <div className="container mx-auto px-4 py-4">
          <Alert className="border-0 bg-transparent shadow-none">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <AlertTriangle className="h-7 w-7 text-white animate-bounce" />
                  <div className="absolute -top-1 -right-1">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="flex items-center gap-3 animate-fade-in">
                  <Wrench className="h-5 w-5 text-white animate-spin-slow" />
                  <Settings className="h-4 w-4 text-white animate-pulse" />
                </div>
              </div>
              
              <div className="flex-1 mx-6">
                <AlertDescription className="text-center">
                  <div className="text-white font-bold text-lg mb-1 animate-text-shimmer">
                    🚧 MAINTENANCE IN PROGRESS 🚧
                  </div>
                  <div className="text-orange-100 font-medium animate-fade-in">
                    {maintenanceData.message}
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-2 text-orange-200 text-sm animate-slide-in-up">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>System Status: Under Maintenance</span>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  </div>
                </AlertDescription>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 rounded-xl p-2 animate-scale-in border border-white/30"
                style={{animationDelay: '0.5s'}}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </Alert>
        </div>
        
        {/* Animated border bottom */}
        <div className="h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 animate-pulse"></div>
      </div>
    </div>
  );
};

export default MaintenanceBanner;
