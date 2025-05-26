
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  referral_code: string;
  status: string;
  reward_earned: boolean;
  created_at: string;
  updated_at: string;
}

interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  pendingReferrals: number;
  totalRewards: number;
  referralCode: string;
}

export const useReferrals = () => {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 0,
    activeReferrals: 0,
    pendingReferrals: 0,
    totalRewards: 0,
    referralCode: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchReferrals();
    }
  }, [user]);

  const fetchReferrals = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      // Fetch user's referrals
      const { data: referralData, error: referralError } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false });

      if (referralError) throw referralError;

      // Get user profile for referral code
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, id')
        .eq('id', user.id)
        .single();

      const referralCode = profile?.username || `USER${user.id.slice(-6).toUpperCase()}`;

      const referrals = referralData || [];
      const totalReferrals = referrals.length;
      const activeReferrals = referrals.filter(r => r.status === 'active').length;
      const pendingReferrals = referrals.filter(r => r.status === 'pending').length;
      const totalRewards = referrals.filter(r => r.reward_earned).length * 10; // $10 per referral

      setReferrals(referrals);
      setStats({
        totalReferrals,
        activeReferrals,
        pendingReferrals,
        totalRewards,
        referralCode
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createReferral = async (referredUserId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('referrals')
        .insert({
          referrer_id: user.id,
          referred_id: referredUserId,
          referral_code: stats.referralCode,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      await fetchReferrals();
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    referrals,
    stats,
    isLoading,
    error,
    refetch: fetchReferrals,
    createReferral
  };
};
