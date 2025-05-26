
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const usePageTracking = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        // Generate a session ID if not exists
        let sessionId = sessionStorage.getItem('session_id');
        if (!sessionId) {
          sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          sessionStorage.setItem('session_id', sessionId);
        }

        // Track the page view
        const { error } = await supabase
          .from('page_views')
          .insert({
            path: location.pathname,
            user_id: user?.id || null,
            session_id: sessionId,
            user_agent: navigator.userAgent,
            referrer: document.referrer || null
          });

        if (error) {
          console.error('Error tracking page view:', error);
        }
      } catch (error) {
        console.error('Error in page tracking:', error);
      }
    };

    // Track page view on route change
    trackPageView();
  }, [location.pathname, user]);

  return null;
};
