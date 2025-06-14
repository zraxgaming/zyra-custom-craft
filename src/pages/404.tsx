import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
      <h1 className="text-6xl font-bold text-purple-700 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Sorry, the page you are looking for does not exist.</p>
      <Button onClick={() => navigate('/')} className="text-lg">Go Home</Button>
    </div>
  );
};

export default NotFound;
