
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Share2, Copy, Gift, Users, Award } from 'lucide-react';

const ReferralSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState('');
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      generateOrFetchReferralCode();
      fetchReferrals();
    }
  }, [user]);

  const generateOrFetchReferralCode = async () => {
    if (!user) return;

    try {
      // Check if user already has a referral code
      const { data: existingCode } = await supabase
        .from('referrals')
        .select('referral_code')
        .eq('referrer_id', user.id)
        .single();

      if (existingCode) {
        setReferralCode(existingCode.referral_code);
      } else {
        // Generate new referral code
        const code = `REF${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const { error } = await supabase
          .from('referrals')
          .insert({
            referrer_id: user.id,
            referral_code: code,
            status: 'active'
          });

        if (!error) {
          setReferralCode(code);
        }
      }
    } catch (error) {
      console.error('Error with referral code:', error);
    }
  };

  const fetchReferrals = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user.id);

      setReferrals(data || []);
    } catch (error) {
      console.error('Error fetching referrals:', error);
    }
  };

  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}?ref=${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    });
  };

  const shareReferral = () => {
    const referralLink = `${window.location.origin}?ref=${referralCode}`;
    const text = `Check out Zyra Custom Craft! Use my referral link to get started: ${referralLink}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Zyra Custom Craft Referral',
        text: text,
        url: referralLink,
      });
    } else {
      copyReferralLink();
    }
  };

  const activeReferrals = referrals.filter(r => r.status === 'completed').length;
  const pendingReferrals = referrals.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Referral Program
        </h2>
        <p className="text-muted-foreground">
          Share Zyra with friends and earn rewards for every successful referral!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card border-gradient hover-3d-lift animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Active Referrals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{activeReferrals}</div>
            <p className="text-sm text-muted-foreground">Completed referrals</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-gradient hover-3d-lift animate-scale-in" style={{animationDelay: '100ms'}}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-green-500" />
              Pending Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{pendingReferrals}</div>
            <p className="text-sm text-muted-foreground">Pending completion</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-gradient hover-3d-lift animate-scale-in" style={{animationDelay: '200ms'}}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-500" />
              Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">${(activeReferrals * 10).toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">$10 per referral</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-gradient animate-slide-in-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Your Referral Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input 
              value={`${window.location.origin}?ref=${referralCode}`}
              readOnly
              className="hover-magnetic"
            />
            <Button onClick={copyReferralLink} variant="outline" className="hover-3d-lift">
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button onClick={shareReferral} className="flex-1 btn-premium">
              <Share2 className="h-4 w-4 mr-2" />
              Share Referral
            </Button>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-4 rounded-xl">
            <h4 className="font-semibold mb-2">How it works:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Share your referral link with friends</li>
              <li>• They sign up and make their first purchase</li>
              <li>• You earn $10 for each successful referral</li>
              <li>• Your friend gets 10% off their first order</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {referrals.length > 0 && (
        <Card className="glass-card border-gradient animate-fade-in">
          <CardHeader>
            <CardTitle>Referral History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {referrals.map((referral, index) => (
                <div key={referral.id} className="flex items-center justify-between p-3 border rounded-lg animate-slide-in-up" style={{animationDelay: `${index * 50}ms`}}>
                  <div>
                    <p className="font-medium">Referral #{referral.referral_code}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(referral.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={referral.status === 'completed' ? 'default' : 'secondary'}>
                    {referral.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReferralSystem;
