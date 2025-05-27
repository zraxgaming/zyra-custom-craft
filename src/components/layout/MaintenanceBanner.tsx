
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const MaintenanceBanner = () => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    fetchMaintenanceStatus();
  }, []);

  const fetchMaintenanceStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .in('key', ['maintenance_mode', 'maintenance_message']);

      if (error) throw error;

      const config = data?.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {} as any) || {};

      const isActive = config.maintenance_mode === true || config.maintenance_mode === 'true';
      setIsMaintenanceMode(isActive);
      setMaintenanceMessage(config.maintenance_message || 'We are currently performing maintenance. Some features may be temporarily unavailable.');
    } catch (error) {
      console.error('Error fetching maintenance status:', error);
    }
  };

  if (!isMaintenanceMode || isDismissed) {
    return null;
  }

  return (
    <Alert className="rounded-none border-x-0 border-t-0 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800 py-2">
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="flex items-center justify-between w-full">
        <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
          🚧 {maintenanceMessage}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsDismissed(true)}
          className="h-6 w-6 p-0 hover:bg-yellow-100 dark:hover:bg-yellow-900/20"
        >
          <X className="h-3 w-3" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default MaintenanceBanner;
