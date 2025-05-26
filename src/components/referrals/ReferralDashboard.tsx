
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Copy, Users, Gift, DollarSign } from "lucide-react";
import { Referral } from "@/types/order";

const ReferralDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState("");
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [stats, setStats] = useState({
    totalReferrals: 0,
    pendingRewards: 0,
    earnedRewards: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchReferralData();
    }
  }, [user]);

  const fetchReferralData = async () => {
    if (!user) return;

    try {
      // Get or create referral code for current user
      let { data: existingReferral, error: referralError } = await supabase
        .from('referrals')
        .select('referral_code')
        .eq('referrer_id', user.id)
        .limit(1)
        .maybeSingle();

      if (referralError && referralError.code !== 'PGRST116') {
        throw referralError;
      }

      if (!existingReferral) {
        // Create new referral code
        const newCode = `REF${user.id.slice(0, 8).toUpperCase()}`;
        const { data: newReferral, error: createError } = await supabase
          .from('referrals')
          .insert({
            referrer_id: user.id,
            referral_code: newCode,
            status: 'active'
          })
          .select('referral_code')
          .single();

        if (createError) throw createError;
        setReferralCode(newReferral.referral_code);
      } else {
        setReferralCode(existingReferral.referral_code);
      }

      // Fetch user's referrals with basic data
      const { data: userReferrals, error: fetchError } = await supabase
        .from('referrals')
        .select(`
          *
        `)
        .eq('referrer_id', user.id);

      if (fetchError) throw fetchError;

      // Transform data to match our interface
      const transformedReferrals: Referral[] = (userReferrals || []).map(ref => ({
        ...ref,
        referred_profiles: {
          display_name: `User ${ref.referred_id?.slice(0, 8)}`,
          email: 'user@example.com'
        }
      }));

      setReferrals(transformedReferrals);

      // Calculate stats
      const totalReferrals = transformedReferrals.length;
      const earnedRewards = transformedReferrals.filter(r => r.reward_earned).length * 10;
      const pendingRewards = transformedReferrals.filter(r => !r.reward_earned && r.status === 'completed').length * 10;

      setStats({
        totalReferrals,
        pendingRewards,
        earnedRewards
      });

    } catch (error: any) {
      console.error('Error fetching referral data:', error);
      toast({
        title: "Error",
        description: "Failed to load referral data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

  if (!user) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Sign in to access referrals</h2>
        <p className="text-muted-foreground">Please sign in to view your referral dashboard</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 animate-bounce-in">Referral Dashboard</h1>
        <p className="text-muted-foreground animate-fade-in">Earn rewards by referring friends!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="animate-slide-in-left">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Referrals</p>
                <p className="text-2xl font-bold">{stats.totalReferrals}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slide-in-up">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Gift className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Pending Rewards</p>
                <p className="text-2xl font-bold">${stats.pendingRewards}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slide-in-right">
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Earned Rewards</p>
                <p className="text-2xl font-bold">${stats.earnedRewards}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link */}
      <Card className="animate-scale-in">
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input 
              value={`${window.location.origin}?ref=${referralCode}`} 
              readOnly 
              className="flex-1"
            />
            <Button onClick={copyReferralLink} className="hover:scale-105 transition-transform">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Share this link with friends to earn $10 for each successful referral!
          </p>
        </CardContent>
      </Card>

      {/* Referrals List */}
      <Card className="animate-slide-in-up">
        <CardHeader>
          <CardTitle>Your Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No referrals yet. Share your link to get started!
            </p>
          ) : (
            <div className="space-y-4">
              {referrals.map((referral) => (
                <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium">{referral.referred_profiles?.display_name || 'Anonymous User'}</p>
                    <p className="text-sm text-muted-foreground">
                      Referred on {new Date(referral.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={referral.status === 'completed' ? 'default' : 'secondary'}>
                      {referral.status}
                    </Badge>
                    {referral.reward_earned && (
                      <Badge variant="default" className="bg-green-500">
                        $10 Earned
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralDashboard;
