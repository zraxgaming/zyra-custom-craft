
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Users, Gift, TrendingUp, Search, CheckCircle, XCircle } from "lucide-react";

const ReferralManager = () => {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalReferrals: 0,
    activeReferrals: 0,
    completedReferrals: 0,
    totalRewards: 0
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchReferrals();
    fetchStats();
  }, []);

  const fetchReferrals = async () => {
    try {
      const { data, error } = await supabase
        .from('referrals')
        .select(`
          *,
          profiles!referrals_referrer_id_fkey (display_name, email),
          referred_profiles:profiles!referrals_referred_id_fkey (display_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReferrals(data || []);
    } catch (error: any) {
      console.error('Error fetching referrals:', error);
      toast({
        title: "Error",
        description: "Failed to fetch referrals",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('referrals')
        .select('*');

      if (error) throw error;

      const stats = data?.reduce((acc, referral) => {
        acc.totalReferrals++;
        if (referral.status === 'active') acc.activeReferrals++;
        if (referral.status === 'completed') {
          acc.completedReferrals++;
          if (referral.reward_earned) acc.totalRewards += 10;
        }
        return acc;
      }, {
        totalReferrals: 0,
        activeReferrals: 0,
        completedReferrals: 0,
        totalRewards: 0
      }) || { totalReferrals: 0, activeReferrals: 0, completedReferrals: 0, totalRewards: 0 };

      setStats(stats);
    } catch (error: any) {
      console.error('Error fetching stats:', error);
    }
  };

  const updateReferralStatus = async (referralId: string, status: string, rewardEarned?: boolean) => {
    try {
      const { error } = await supabase
        .from('referrals')
        .update({ 
          status, 
          reward_earned: rewardEarned,
          updated_at: new Date().toISOString()
        })
        .eq('id', referralId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Referral status updated successfully",
      });

      fetchReferrals();
      fetchStats();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update referral status",
        variant: "destructive",
      });
    }
  };

  const filteredReferrals = referrals.filter(referral =>
    referral.referral_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    referral.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    referral.referred_profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h2 className="text-2xl font-bold text-foreground mb-2">Referral Management</h2>
        <p className="text-muted-foreground">Manage and track all referral activities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-scale-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Referrals</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalReferrals}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-scale-in" style={{ animationDelay: '100ms' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.activeReferrals}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-scale-in" style={{ animationDelay: '200ms' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedReferrals}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-scale-in" style={{ animationDelay: '300ms' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Rewards</p>
                <p className="text-2xl font-bold text-primary">${stats.totalRewards}</p>
              </div>
              <Gift className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-scale-in" style={{ animationDelay: '400ms' }}>
        <CardHeader>
          <CardTitle>Referral List</CardTitle>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by code, referrer, or referred email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReferrals.map((referral) => (
              <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg bg-background/50">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{referral.referral_code}</span>
                    <Badge variant={
                      referral.status === 'completed' ? 'default' :
                      referral.status === 'active' ? 'secondary' : 'destructive'
                    }>
                      {referral.status}
                    </Badge>
                    {referral.reward_earned && <Badge variant="outline">Reward Earned</Badge>}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Referrer: {referral.profiles?.email || 'Unknown'}</p>
                    {referral.referred_profiles && (
                      <p>Referred: {referral.referred_profiles.email}</p>
                    )}
                    <p>Created: {new Date(referral.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {referral.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateReferralStatus(referral.id, 'completed', true)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Complete
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateReferralStatus(referral.id, 'rejected')}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                  {referral.status === 'active' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateReferralStatus(referral.id, 'completed', true)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark Complete
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {filteredReferrals.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No referrals found matching your search.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralManager;
