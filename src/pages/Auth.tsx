
import React from 'react';
import AuthPage from '@/components/auth/AuthPage';
import SEOHead from '@/components/seo/SEOHead';

const Auth = () => {
  return (
    <>
      <SEOHead 
        title="Sign In - Zyra Custom Craft"
        description="Sign in to your Zyra account to access your orders, wishlist, and custom products."
        keywords="sign in, login, account, authentication"
      />
      <AuthPage />
    </>
  );
};

export default Auth;
