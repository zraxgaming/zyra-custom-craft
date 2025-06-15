
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Callback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Handling auth callback...');
        
        // Handle the auth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          navigate('/auth?error=callback_failed');
          return;
        }

        console.log('Session data:', data);

        if (data?.session) {
          console.log('Session found, redirecting...');
          // Get redirect URL from state or default to dashboard
          const redirectTo = searchParams.get('redirect_to') || '/dashboard';
          navigate(redirectTo, { replace: true });
        } else {
          console.log('No session found, redirecting to auth...');
          // No session found, redirect to auth
          navigate('/auth', { replace: true });
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/auth?error=callback_failed', { replace: true });
      }
    };

    // Only handle callback if user is not already authenticated
    if (!user) {
      handleAuthCallback();
    } else {
      // User is already authenticated, redirect to dashboard
      console.log('User already authenticated, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [navigate, searchParams, user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Completing sign in...
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please wait while we redirect you.
        </p>
      </div>
    </div>
  );
};

export default Callback;
