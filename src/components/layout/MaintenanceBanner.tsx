
import React, { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const MaintenanceBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    fetchMaintenanceStatus();
  }, []);

  const fetchMaintenanceStatus = async () => {
    try {
      // Use direct query since maintenance_mode might not be in types yet
      const { data, error } = await supabase
        .from('maintenance_mode' as any)
        .select('is_active, message')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching maintenance status:', error);
        return;
      }

      if (data?.is_active && !isDismissed) {
        setIsVisible(true);
        setMessage(data.message || 'We are currently performing maintenance. Some features may be temporarily unavailable.');
      }
    } catch (error) {
      console.error('Error fetching maintenance status:', error);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 text-white animate-fade-in z-50">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
      <div className="relative flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3 flex-1">
          <AlertTriangle className="h-5 w-5 animate-pulse" />
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={handleDismiss}
          className="p-1 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Dismiss maintenance notice"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default MaintenanceBanner;
