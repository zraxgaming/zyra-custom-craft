
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SEOHead from '@/components/seo/SEOHead';

const Success: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const orderId = params.get('id');
  const successUrl = "https://shopzyra.vercel.app/success";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
      <SEOHead
        title="Order Successful - Zyra Custom Craft"
        description="Thank you for your order! Your order has been placed successfully at Zyra Custom Craft."
        url={successUrl}
      />
      <h1 className="text-4xl font-bold text-green-700 mb-4">Thank you for your order!</h1>
      <p className="text-lg text-gray-700 mb-2">Your order has been placed successfully.</p>
      {orderId && (
        <p className="text-md text-gray-600 mb-6">Order ID: <span className="font-mono text-blue-700">{orderId}</span></p>
      )}
      <Button onClick={() => navigate('/shop')} className="text-lg">Continue Shopping</Button>
    </div>
  );
};

export default Success;
