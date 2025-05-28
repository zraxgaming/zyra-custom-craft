
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
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('maintenance-banner')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'site_config',
        filter: 'key=eq.maintenance_mode'
      }, () => {
        fetchMaintenanceStatus();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchMaintenanceStatus = async () => {
    try {
      // Fetch maintenance mode status
      const { data: modeData, error: modeError } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'maintenance_mode')
        .single();

      if (modeError && modeError.code !== 'PGRST116') {
        console.error('Error fetching maintenance mode:', modeError);
        setIsMaintenanceMode(false);
        setLoading(false);
        return;
      }

      // Check if maintenance mode is enabled
      const isEnabled = modeData?.value === true || 
                       modeData?.value === 'true' || 
                       modeData?.value === '1' ||
                       (typeof modeData?.value === 'string' && modeData.value.toLowerCase() === 'true');
      
      setIsMaintenanceMode(isEnabled);

      if (isEnabled) {
        // Fetch maintenance message
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
      console.error('Error in fetchMaintenanceStatus:', error);
      setIsMaintenanceMode(false);
    } finally {
      setLoading(false);
    }
  };

  // Don't render if loading, not in maintenance mode, or dismissed
  if (loading || !isMaintenanceMode || isDismissed) {
    return null;
  }

  return (
    <Alert className="rounded-none border-x-0 border-t-0 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-yellow-950/30 border-amber-200 dark:border-amber-800 py-4 animate-slide-in-down">
      <AlertTriangle className="h-5 w-5 text-amber-600 animate-pulse" />
      <AlertDescription className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-amber-800 dark:text-amber-200 animate-fade-in">
            🚧 Maintenance Notice
          </span>
          <span className="text-sm text-amber-700 dark:text-amber-300">
            {maintenanceMessage}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsDismissed(true)}
          className="h-8 w-8 p-0 hover:bg-amber-100 dark:hover:bg-amber-900/20 transition-colors"
          aria-label="Dismiss maintenance notice"
        >
          <X className="h-4 w-4 text-amber-700 dark:text-amber-300" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default MaintenanceBanner;
