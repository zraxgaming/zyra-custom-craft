
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
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
          sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
          sessionStorage.setItem('session_id', sessionId);
        }

        await supabase
          .from('page_views')
          .insert({
            path: location.pathname,
            user_id: user?.id || null,
            session_id: sessionId,
            user_agent: navigator.userAgent,
            referrer: document.referrer || null
          });
      } catch (error) {
        // Silently fail - don't interrupt user experience
        console.error('Error tracking page view:', error);
      }
    };

    trackPageView();
  }, [location.pathname, user?.id]);
};
