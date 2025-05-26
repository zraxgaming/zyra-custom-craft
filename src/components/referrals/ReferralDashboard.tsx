
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Copy, Users, Gift, DollarSign } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  totalRewards: number;
  referralCode: string;
}

const ReferralDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 0,
    activeReferrals: 0,
    totalRewards: 0,
    referralCode: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchReferralStats();
    }
  }, [user]);

  const fetchReferralStats = async () => {
    if (!user) return;

    try {
      // Get user's referral code
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Get referral stats
      const { data: referrals } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user.id);

      const totalReferrals = referrals?.length || 0;
      const activeReferrals = referrals?.filter(r => r.status === 'active').length || 0;
      const totalRewards = referrals?.filter(r => r.reward_earned).length * 10 || 0; // $10 per referral

      setStats({
        totalReferrals,
        activeReferrals,
        totalRewards,
        referralCode: profile?.username || `USER${user.id.slice(-6).toUpperCase()}`
      });
    } catch (error) {
      console.error('Error fetching referral stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyReferralCode = () => {
    const referralUrl = `${window.location.origin}?ref=${stats.referralCode}`;
    navigator.clipboard.writeText(referralUrl);
    
    toast({
      title: "Referral link copied!",
      description: "Share this link with friends to earn rewards",
    });
  };

  const copyReferralCodeOnly = () => {
    navigator.clipboard.writeText(stats.referralCode);
    
    toast({
      title: "Referral code copied!",
      description: "Share this code with friends",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Referral Program
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg hover:scale-105 transition-transform duration-200">
              <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{stats.totalReferrals}</div>
              <div className="text-sm text-muted-foreground">Total Referrals</div>
            </div>
            
            <div className="text-center p-4 bg-muted/50 rounded-lg hover:scale-105 transition-transform duration-200">
              <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">{stats.activeReferrals}</div>
              <div className="text-sm text-muted-foreground">Active Referrals</div>
            </div>
            
            <div className="text-center p-4 bg-muted/50 rounded-lg hover:scale-105 transition-transform duration-200">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">${stats.totalRewards}</div>
              <div className="text-sm text-muted-foreground">Total Rewards</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Your Referral Code</label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={stats.referralCode}
                  readOnly
                  className="font-mono"
                />
                <Button
                  onClick={copyReferralCodeOnly}
                  variant="outline"
                  size="icon"
                  className="hover:scale-110 transition-transform duration-200"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Your Referral Link</label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={`${window.location.origin}?ref=${stats.referralCode}`}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  onClick={copyReferralCode}
                  variant="outline"
                  size="icon"
                  className="hover:scale-110 transition-transform duration-200"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-4 bg-primary/10 rounded-lg">
              <h4 className="font-semibold mb-2">How it works:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Share your referral code with friends</li>
                <li>• They get 10% off their first order</li>
                <li>• You earn $10 for each successful referral</li>
                <li>• No limit on how much you can earn!</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralDashboard;
