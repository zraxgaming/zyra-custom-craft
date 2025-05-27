
import React, { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const MaintenanceBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('maintenance-dismissed');
    if (dismissed) {
      setIsDismissed(true);
    }
    fetchMaintenanceStatus();
  }, []);

  const fetchMaintenanceStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('maintenance_mode')
        .select('is_active, message')
        .eq('id', '00000000-0000-0000-0000-000000000001')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching maintenance status:', error);
        return;
      }

      if (data?.is_active && !isDismissed) {
        setIsVisible(true);
        setMessage(data.message || 'We are currently performing maintenance. Some features may be temporarily unavailable.');
      } else {
        setIsVisible(false);
      }
    } catch (error) {
      console.error('Error fetching maintenance status:', error);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    localStorage.setItem('maintenance-dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 text-white animate-slide-down z-50">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm animate-pulse"></div>
      <div className="relative flex items-center justify-between px-4 py-3 animate-fade-in">
        <div className="flex items-center gap-3 flex-1">
          <AlertTriangle className="h-5 w-5 animate-bounce" />
          <p className="text-sm font-medium animate-slide-in-left">{message}</p>
        </div>
        <button
          onClick={handleDismiss}
          className="p-1 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110 animate-scale-in"
          aria-label="Dismiss maintenance notice"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default MaintenanceBanner;
