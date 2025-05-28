
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
      setIsMaintenanceMode(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !isMaintenanceMode || isDismissed) {
    return null;
  }

  return (
    <Alert className="rounded-none border-x-0 border-t-0 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 py-3 animate-slide-in-down">
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="flex items-center justify-between w-full">
        <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
          🚧 {maintenanceMessage}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsDismissed(true)}
          className="h-6 w-6 p-0 hover:bg-amber-100 dark:hover:bg-amber-900/20"
        >
          <X className="h-3 w-3" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default MaintenanceBanner;
