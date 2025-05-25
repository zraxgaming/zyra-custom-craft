
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Copy, Users, Gift, Share } from "lucide-react";

const ReferralDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState("");
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    successfulReferrals: 0,
    pendingReferrals: 0,
    totalRewards: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      generateReferralCode();
      fetchReferralStats();
    }
  }, [user]);

  const generateReferralCode = async () => {
    if (!user) return;

    try {
      // Check if user already has a referral code
      const { data: existingReferral } = await supabase
        .from('referrals')
        .select('referral_code')
        .eq('referrer_id', user.id)
        .single();

      if (existingReferral) {
        setReferralCode(existingReferral.referral_code);
      } else {
        // Generate new referral code
        const code = `${user.email?.split('@')[0]}_${Math.random().toString(36).substring(2, 8)}`.toUpperCase();
        
        const { error } = await supabase
          .from('referrals')
          .insert({
            referrer_id: user.id,
            referral_code: code,
            status: 'active'
          });

        if (error) throw error;
        setReferralCode(code);
      }
    } catch (error: any) {
      console.error('Error generating referral code:', error);
      toast({
        title: "Error",
        description: "Failed to generate referral code",
        variant: "destructive",
      });
    }
  };

  const fetchReferralStats = async () => {
    if (!user) return;

    try {
      const { data: referrals, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user.id);

      if (error) throw error;

      const stats = referrals?.reduce((acc, referral) => {
        acc.totalReferrals++;
        if (referral.status === 'completed') {
          acc.successfulReferrals++;
          if (referral.reward_earned) {
            acc.totalRewards += 10; // $10 per successful referral
          }
        } else if (referral.status === 'pending') {
          acc.pendingReferrals++;
        }
        return acc;
      }, {
        totalReferrals: 0,
        successfulReferrals: 0,
        pendingReferrals: 0,
        totalRewards: 0
      }) || { totalReferrals: 0, successfulReferrals: 0, pendingReferrals: 0, totalRewards: 0 };

      setReferralStats(stats);
    } catch (error: any) {
      console.error('Error fetching referral stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}/auth?ref=${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    });
  };

  const shareReferral = () => {
    const referralLink = `${window.location.origin}/auth?ref=${referralCode}`;
    const shareText = `Join me on this amazing platform and get special bonuses! Use my referral link: ${referralLink}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join me!',
        text: shareText,
        url: referralLink
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied!",
        description: "Referral message copied to clipboard",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Referral Program</h2>
        <p className="text-muted-foreground">Invite friends and earn rewards for every successful referral!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-scale-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Referrals</p>
                <p className="text-2xl font-bold text-foreground">{referralStats.totalReferrals}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-scale-in" style={{ animationDelay: '100ms' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Successful</p>
                <p className="text-2xl font-bold text-green-600">{referralStats.successfulReferrals}</p>
              </div>
              <Gift className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-scale-in" style={{ animationDelay: '200ms' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{referralStats.pendingReferrals}</p>
              </div>
              <Users className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-scale-in" style={{ animationDelay: '300ms' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Earned</p>
                <p className="text-2xl font-bold text-primary">${referralStats.totalRewards}</p>
              </div>
              <Gift className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-scale-in" style={{ animationDelay: '400ms' }}>
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={`${window.location.origin}/auth?ref=${referralCode}`}
              readOnly
              className="bg-muted"
            />
            <Button onClick={copyReferralLink} variant="outline">
              <Copy className="h-4 w-4" />
            </Button>
            <Button onClick={shareReferral} variant="outline">
              <Share className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">How it works:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Share your unique referral link with friends</li>
              <li>• When they sign up and make their first purchase, you both get rewards</li>
              <li>• You earn $10 for each successful referral</li>
              <li>• Your friend gets a 10% discount on their first order</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralDashboard;
