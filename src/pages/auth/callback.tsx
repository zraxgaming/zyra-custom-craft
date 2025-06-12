
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import SEOHead from '@/components/seo/SEOHead';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = React.useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = React.useState('Processing authentication...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Auth callback started');
        
        // Check for error in URL params
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        
        if (error) {
          console.error('OAuth error:', error, errorDescription);
          setStatus('error');
          setMessage(errorDescription || 'Authentication failed');
          setTimeout(() => navigate('/auth?error=oauth_failed'), 3000);
          return;
        }

        // Handle the auth callback from OAuth providers
        const { data, error: callbackError } = await supabase.auth.getSession();
        
        if (callbackError) {
          console.error('Session error:', callbackError);
          setStatus('error');
          setMessage('Failed to get session');
          setTimeout(() => navigate('/auth?error=session_failed'), 3000);
          return;
        }

        if (data?.session) {
          console.log('Session found, redirecting...');
          setStatus('success');
          setMessage('Authentication successful!');
          
          // Get redirect URL from state or default to home
          const redirectTo = searchParams.get('redirect_to') || '/';
          setTimeout(() => navigate(redirectTo), 1000);
        } else {
          console.log('No session found');
          setStatus('error');
          setMessage('No session found');
          setTimeout(() => navigate('/auth'), 2000);
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setMessage('Authentication error occurred');
        setTimeout(() => navigate('/auth?error=callback_failed'), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams]);

  return (
    <>
      <SEOHead 
        title="Authentication - Zyra Custom Craft"
        description="Completing your authentication process. Please wait while we redirect you."
        url="https://shopzyra.vercel.app/auth/callback"
      />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-purple-950 dark:via-blue-950 dark:to-pink-950">
        <Card className="w-full max-w-md mx-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-2xl">
          <CardContent className="p-8 text-center space-y-6">
            {status === 'loading' && (
              <>
                <div className="relative">
                  <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
                  <div className="absolute inset-0 h-16 w-16 rounded-full bg-primary/20 animate-pulse mx-auto"></div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Completing sign in...
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {message}
                  </p>
                </div>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="relative">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                  <div className="absolute inset-0 h-16 w-16 rounded-full bg-green-500/20 animate-pulse mx-auto"></div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">
                    Success!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {message}
                  </p>
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="relative">
                  <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
                  <div className="absolute inset-0 h-16 w-16 rounded-full bg-red-500/20 animate-pulse mx-auto"></div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
                    Authentication Failed
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {message}
                  </p>
                </div>
              </>
            )}

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-purple-600 rounded-full transition-all duration-2000 w-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AuthCallback;
