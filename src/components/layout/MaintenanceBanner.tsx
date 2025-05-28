
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const MaintenanceBanner = () => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');
  const [isDismissed, setIsDismissed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaintenanceStatus();
  }, []);

  const fetchMaintenanceStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .eq('key', 'maintenance_mode')
        .single();

      if (error) {
        console.log('No maintenance mode config found');
        setIsMaintenanceMode(false);
        return;
      }

      const isActive = data?.value === true || data?.value === 'true';
      setIsMaintenanceMode(isActive);

      if (isActive) {
        const { data: messageData } = await supabase
          .from('site_config')
          .select('value')
          .eq('key', 'maintenance_message')
          .single();

        const message = typeof messageData?.value === 'string' 
          ? messageData.value 
          : 'We are currently performing maintenance. Some features may be temporarily unavailable.';
        
        setMaintenanceMessage(message);
      }
    } catch (error) {
      console.error('Error fetching maintenance status:', error);
      setIsMaintenanceMode(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !isMaintenanceMode || isDismissed) {
    return null;
  }

  return (
    <Alert className="rounded-none border-x-0 border-t-0 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 py-4 animate-slide-in-down shadow-lg">
      <AlertTriangle className="h-5 w-5 text-amber-600 animate-pulse" />
      <AlertDescription className="flex items-center justify-between w-full">
        <span className="text-base font-semibold text-amber-800 dark:text-amber-200 flex items-center">
          🚧 {maintenanceMessage}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsDismissed(true)}
          className="h-8 w-8 p-0 hover:bg-amber-100 dark:hover:bg-amber-900/20 rounded-full transition-all duration-300 hover-3d-lift"
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default MaintenanceBanner;
