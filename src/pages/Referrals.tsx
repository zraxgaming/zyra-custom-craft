
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Users, Gift, Share2, DollarSign, Trophy, Star } from "lucide-react";

interface Referral {
  id: string;
  referral_code: string;
  referred_id: string | null;
  status: string;
  reward_earned: boolean;
  created_at: string;
  updated_at: string;
}

const Referrals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [userReferralCode, setUserReferralCode] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    if (user) {
      fetchReferralData();
    }
  }, [user]);

  const fetchReferralData = async () => {
    try {
      // Get user's referral code
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      // Generate referral code if doesn't exist
      let referralCode = profileData?.username || user?.id?.slice(0, 8) || 'USER';
      setUserReferralCode(referralCode);

      // Get user's referrals
      const { data: referralData, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReferrals(referralData || []);

      // Calculate total earnings (assuming $10 per successful referral)
      const earnings = (referralData || []).filter(r => r.reward_earned).length * 10;
      setTotalEarnings(earnings);
    } catch (error) {
      console.error('Error fetching referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}?ref=${userReferralCode}`;
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Link Copied!",
      description: "Your referral link has been copied to clipboard",
    });
  };

  const shareReferralLink = async () => {
    const referralLink = `${window.location.origin}?ref=${userReferralCode}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Zyra Store',
          text: 'Check out this amazing store and get exclusive deals!',
          url: referralLink
        });
      } catch (error) {
        copyReferralLink();
      }
    } else {
      copyReferralLink();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
        <Navbar />
        <div className="py-20">
          <Container>
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Sign In Required</h1>
              <p className="text-muted-foreground mb-8">Please sign in to access the referral program</p>
              <Button onClick={() => window.location.href = '/auth'}>Sign In</Button>
            </div>
          </Container>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
      <Navbar />
      
      <div className="py-12">
        <Container>
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-full mb-8 animate-bounce shadow-2xl">
              <Users className="h-12 w-12 text-white animate-pulse" />
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent mb-6">
              Referral Program
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Earn rewards by inviting friends to join our amazing store!
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800 shadow-xl animate-slide-in-left">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">${totalEarnings}</h3>
                <p className="text-green-600 dark:text-green-500">Total Earnings</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200 dark:border-blue-800 shadow-xl animate-scale-in">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-2">{referrals.length}</h3>
                <p className="text-blue-600 dark:text-blue-500">Total Referrals</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800 shadow-xl animate-slide-in-right">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-400 mb-2">
                  {referrals.filter(r => r.reward_earned).length}
                </h3>
                <p className="text-purple-600 dark:text-purple-500">Successful Referrals</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Share Your Code */}
            <Card className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 border-purple-200 dark:border-purple-800 shadow-2xl animate-slide-in-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl text-purple-700 dark:text-purple-300">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Share2 className="h-5 w-5 text-white" />
                  </div>
                  Share Your Referral Code
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center p-6 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-xl border border-purple-200 dark:border-purple-700">
                  <p className="text-sm text-muted-foreground mb-2">Your Referral Code</p>
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-300 font-mono tracking-wider">
                    {userReferralCode}
                  </p>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={copyReferralLink}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Share2 className="h-5 w-5 mr-2" />
                    Copy Referral Link
                  </Button>

                  <Button 
                    onClick={shareReferralLink}
                    variant="outline"
                    className="w-full border-purple-200 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30"
                  >
                    <Users className="h-5 w-5 mr-2" />
                    Share with Friends
                  </Button>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-400">How it works</h4>
                  </div>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-500 space-y-1">
                    <li>• Share your referral code with friends</li>
                    <li>• They sign up and make their first purchase</li>
                    <li>• You earn $10 for each successful referral</li>
                    <li>• Your friend gets 10% off their first order</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Referral History */}
            <Card className="bg-gradient-to-br from-white to-pink-50 dark:from-gray-900 dark:to-pink-950 border-pink-200 dark:border-pink-800 shadow-2xl animate-slide-in-right">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl text-pink-700 dark:text-pink-300">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Gift className="h-5 w-5 text-white" />
                  </div>
                  Referral History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
                  </div>
                ) : referrals.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-muted-foreground">No referrals yet</p>
                    <p className="text-sm text-muted-foreground mt-2">Start sharing your code to earn rewards!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {referrals.map((referral, index) => (
                      <div
                        key={referral.id}
                        className="p-4 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-lg border border-pink-200 dark:border-pink-700 animate-slide-in-up"
                        style={{animationDelay: `${index * 100}ms`}}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">Referral #{referral.id.slice(-8)}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(referral.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge 
                              variant={referral.status === 'completed' ? 'default' : 'secondary'}
                              className="capitalize"
                            >
                              {referral.status}
                            </Badge>
                            {referral.reward_earned && (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                                +$10 Earned
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </Container>
      </div>
      
      <Footer />
    </div>
  );
};

export default Referrals;
