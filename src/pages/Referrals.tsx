
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Users, Gift, Share, DollarSign } from "lucide-react";

const Referrals = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState('');
  const [referrals, setReferrals] = useState([]);
  const [stats, setStats] = useState({
    total_referrals: 0,
    successful_referrals: 0,
    total_rewards: 0
  });

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
      return;
    }
    
    if (user) {
      fetchReferralData();
    }
  }, [user, isLoading, navigate]);

  const fetchReferralData = async () => {
    if (!user) return;

    try {
      // Get or create referral code
      let { data: referralData, error: referralError } = await supabase
        .from('referrals')
        .select('referral_code')
        .eq('referrer_id', user.id)
        .single();

      if (referralError && referralError.code === 'PGRST116') {
        // Create new referral code
        const code = `REF${user.id.slice(0, 8).toUpperCase()}`;
        const { error: insertError } = await supabase
          .from('referrals')
          .insert({
            referrer_id: user.id,
            referral_code: code,
            status: 'active'
          });

        if (!insertError) {
          setReferralCode(code);
        }
      } else if (referralData) {
        setReferralCode(referralData.referral_code);
      }

      // Get referral statistics
      const { data: referralsData, error: referralsError } = await supabase
        .from('referrals')
        .select(`
          *,
          referred_profiles:profiles!referrals_referred_id_fkey (
            display_name,
            email
          )
        `)
        .eq('referrer_id', user.id);

      if (!referralsError && referralsData) {
        setReferrals(referralsData);
        
        const totalReferrals = referralsData.length;
        const successfulReferrals = referralsData.filter(r => r.status === 'completed').length;
        const totalRewards = referralsData.filter(r => r.reward_earned).length * 10; // $10 per referral

        setStats({
          total_referrals: totalReferrals,
          successful_referrals: successfulReferrals,
          total_rewards: totalRewards
        });
      }
    } catch (error: any) {
      console.error('Error fetching referral data:', error);
    }
  };

  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}/shop?ref=${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    });
  };

  const shareReferral = async () => {
    const referralLink = `${window.location.origin}/shop?ref=${referralCode}`;
    const shareData = {
      title: 'Check out Zyra Custom Craft!',
      text: 'Get amazing custom products with my referral code and save on your first order!',
      url: referralLink,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        copyReferralLink();
      }
    } else {
      copyReferralLink();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <Container className="py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-6">
              <Users className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Referral Program</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Invite friends and earn rewards! Both you and your friends get benefits when they make their first purchase.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_referrals}</div>
                <p className="text-xs text-muted-foreground">Friends invited</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Successful Referrals</CardTitle>
                <Gift className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.successful_referrals}</div>
                <p className="text-xs text-muted-foreground">Friends who purchased</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Rewards</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.total_rewards}</div>
                <p className="text-xs text-muted-foreground">Earned in rewards</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Share Your Code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share className="h-5 w-5" />
                  Share Your Referral Code
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Your Referral Code</Label>
                  <div className="flex space-x-2 mt-1">
                    <Input value={referralCode} readOnly className="font-mono" />
                    <Button onClick={copyReferralLink}>Copy Link</Button>
                  </div>
                </div>

                <div>
                  <Label>Referral Link</Label>
                  <div className="p-3 bg-muted rounded-md text-sm break-all">
                    {window.location.origin}/shop?ref={referralCode}
                  </div>
                </div>

                <div className="space-y-3">
                  <Button onClick={shareReferral} className="w-full">
                    <Share className="h-4 w-4 mr-2" />
                    Share Referral Link
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        const text = `Check out Zyra Custom Craft! Use my referral code ${referralCode} and get a discount on your first order: ${window.location.origin}/shop?ref=${referralCode}`;
                        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
                      }}
                    >
                      Share on Twitter
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        const text = `Check out Zyra Custom Craft! Use my referral code ${referralCode} and get a discount on your first order: ${window.location.origin}/shop?ref=${referralCode}`;
                        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(text)}`, '_blank');
                      }}
                    >
                      Share on Facebook
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Share Your Code</h4>
                      <p className="text-sm text-muted-foreground">
                        Send your unique referral code to friends and family
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Friend Gets Discount</h4>
                      <p className="text-sm text-muted-foreground">
                        They get 10% off their first order when using your code
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">You Earn Rewards</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive $10 credit for each successful referral
                      </p>
                    </div>
                  </div>

                  <div className="bg-primary/10 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Bonus Rewards</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Refer 5 friends: Get additional $25 bonus</li>
                      <li>• Refer 10 friends: Get additional $75 bonus</li>
                      <li>• No limit on earnings!</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Referral History */}
          {referrals.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Referral History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {referrals.map((referral: any) => (
                    <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">
                          {referral.referred_profiles?.display_name || referral.referred_profiles?.email || 'Anonymous User'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Referred on {new Date(referral.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          referral.status === 'completed' ? 'bg-green-100 text-green-800' :
                          referral.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {referral.status}
                        </span>
                        {referral.reward_earned && (
                          <p className="text-sm text-green-600 mt-1">+$10 earned</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </Container>
      
      <Footer />
    </div>
  );
};

export default Referrals;
