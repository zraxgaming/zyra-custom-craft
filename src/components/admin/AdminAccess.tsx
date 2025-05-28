
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Lock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminAccess = () => {
  const { user, isAdmin } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto p-4 bg-red-100 dark:bg-red-900/30 rounded-full">
              <Lock className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Authentication Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              You need to be logged in to access the admin panel.
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" />Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto p-4 bg-amber-100 dark:bg-amber-900/30 rounded-full">
              <Shield className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              You don't have administrator privileges to access this section.
            </p>
            <div className="space-y-3">
              <Button variant="outline" asChild className="w-full">
                <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" />Back to Home</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link to="/contact">Contact Support</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default AdminAccess;
