
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Copy, Users, Gift, DollarSign, Share2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  totalRewards: number;
  referralCode: string;
}

interface Referral {
  id: string;
  referral_code: string;
  status: string;
  reward_earned: boolean;
  created_at: string;
  referred_profiles?: {
    display_name?: string;
    email?: string;
  };
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
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchReferralData();
    }
  }, [user]);

  const fetchReferralData = async () => {
    if (!user) return;

    try {
      // Get user's profile for referral code
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, display_name')
        .eq('id', user.id)
        .single();

      // Get referral stats
      const { data: referralData } = await supabase
        .from('referrals')
        .select(`
          *,
          referred_profiles:profiles!referrals_referred_id_fkey (display_name, email)
        `)
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false });

      const referrals = referralData || [];
      const totalReferrals = referrals.length;
      const activeReferrals = referrals.filter(r => r.status === 'active').length;
      const totalRewards = referrals.filter(r => r.reward_earned).length * 10; // $10 per referral
      const referralCode = profile?.username || profile?.display_name || `USER${user.id.slice(-6).toUpperCase()}`;

      setStats({
        totalReferrals,
        activeReferrals,
        totalRewards,
        referralCode
      });

      setReferrals(referrals);
    } catch (error) {
      console.error('Error fetching referral data:', error);
      toast({
        title: "Error",
        description: "Failed to load referral data",
        variant: "destructive",
      });
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

  const shareOnSocial = (platform: string) => {
    const referralUrl = `${window.location.origin}?ref=${stats.referralCode}`;
    const message = `Check out this amazing custom products store! Use my referral code ${stats.referralCode} and get 10% off your first order!`;
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(referralUrl)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(message + ' ' + referralUrl)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
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
      <Card className="hover:shadow-xl transition-all duration-500 hover:scale-[1.02] animate-scale-in bg-gradient-to-br from-primary/5 to-purple-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 animate-bounce-in">
            <Gift className="h-5 w-5 text-primary" />
            Referral Program
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-lg hover:scale-110 transition-all duration-300 animate-slide-in-up border border-blue-500/20">
              <Users className="h-10 w-10 mx-auto mb-3 text-blue-500 animate-float" />
              <div className="text-3xl font-bold text-blue-600 animate-pulse-glow">{stats.totalReferrals}</div>
              <div className="text-sm text-muted-foreground">Total Referrals</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-lg hover:scale-110 transition-all duration-300 animate-slide-in-up border border-green-500/20" style={{ animationDelay: '0.1s' }}>
              <Users className="h-10 w-10 mx-auto mb-3 text-green-500 animate-float" style={{ animationDelay: '0.5s' }} />
              <div className="text-3xl font-bold text-green-600 animate-pulse-glow">{stats.activeReferrals}</div>
              <div className="text-sm text-muted-foreground">Active Referrals</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-lg hover:scale-110 transition-all duration-300 animate-slide-in-up border border-purple-500/20" style={{ animationDelay: '0.2s' }}>
              <DollarSign className="h-10 w-10 mx-auto mb-3 text-purple-500 animate-float" style={{ animationDelay: '1s' }} />
              <div className="text-3xl font-bold text-purple-600 animate-pulse-glow">${stats.totalRewards}</div>
              <div className="text-sm text-muted-foreground">Total Rewards</div>
            </div>
          </div>

          <div className="space-y-4 animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
            <div>
              <label className="text-sm font-medium">Your Referral Code</label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={stats.referralCode}
                  readOnly
                  className="font-mono text-lg bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20 hover:border-primary/40 transition-all duration-300"
                />
                <Button
                  onClick={copyReferralCodeOnly}
                  variant="outline"
                  size="icon"
                  className="hover:scale-110 hover:rotate-12 transition-all duration-300 border-primary/20 hover:border-primary"
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
                  className="font-mono text-sm bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20 hover:border-primary/40 transition-all duration-300"
                />
                <Button
                  onClick={copyReferralCode}
                  variant="outline"
                  size="icon"
                  className="hover:scale-110 hover:rotate-12 transition-all duration-300 border-primary/20 hover:border-primary"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <Button 
                onClick={() => shareOnSocial('twitter')} 
                variant="outline" 
                className="flex-1 hover:scale-105 transition-all duration-300 hover:bg-blue-500/10 border-blue-500/20"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Twitter
              </Button>
              <Button 
                onClick={() => shareOnSocial('facebook')} 
                variant="outline" 
                className="flex-1 hover:scale-105 transition-all duration-300 hover:bg-blue-600/10 border-blue-600/20"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Facebook
              </Button>
              <Button 
                onClick={() => shareOnSocial('whatsapp')} 
                variant="outline" 
                className="flex-1 hover:scale-105 transition-all duration-300 hover:bg-green-500/10 border-green-500/20"
              >
                <Share2 className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
            </div>

            <div className="p-6 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 rounded-lg border border-primary/20 animate-gradient-flow">
              <h4 className="font-semibold mb-3 text-center">How it works:</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  Share your referral code with friends
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  They get 10% off their first order
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  You earn $10 for each successful referral
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                  No limit on how much you can earn!
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral History */}
      <Card className="animate-slide-in-up hover:shadow-xl transition-all duration-500" style={{ animationDelay: '0.4s' }}>
        <CardHeader>
          <CardTitle>Referral History</CardTitle>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <div className="text-center py-8 animate-bounce-in">
              <Gift className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">No referrals yet. Start sharing your link to earn rewards!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {referrals.map((referral, index) => (
                <div 
                  key={referral.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all duration-300 hover:scale-[1.02] animate-fade-in bg-gradient-to-r from-card/50 to-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div>
                    <p className="font-medium">Referral #{referral.id.slice(-6)}</p>
                    <p className="text-sm text-muted-foreground">
                      {referral.referred_profiles?.email || 'Email not available'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(referral.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge 
                      variant={referral.status === 'active' ? 'default' : 'secondary'}
                      className="animate-pulse"
                    >
                      {referral.status}
                    </Badge>
                    {referral.reward_earned && (
                      <Badge variant="default" className="bg-green-500 animate-pulse-glow">
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
