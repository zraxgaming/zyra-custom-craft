
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Container } from '@/components/ui/container';
import ReferralSystem from '@/components/referral/ReferralSystem';
import SEOHead from '@/components/seo/SEOHead';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const ReferralPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth?redirect=/referrals');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <>
      <SEOHead 
        title="Referral Program - Zyra"
        description="Refer friends to Zyra and earn rewards! Get $10 for every successful referral."
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <Container className="py-12">
          <ReferralSystem />
        </Container>
        <Footer />
      </div>
    </>
  );
};

export default ReferralPage;
