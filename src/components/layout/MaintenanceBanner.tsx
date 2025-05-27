
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
      const { data, error } = await supabase
        .from('maintenance_mode')
        .select('is_active, message')
        .single();

      if (error) throw error;

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
    <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-purple-600 to-pink-500 text-white animate-fade-in">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
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
