
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Share2, Users, Gift, Trophy, Star, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import SEOHead from "@/components/seo/SEOHead";

const Referrals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [referralCode, setReferralCode] = useState("");
  const [referrals, setReferrals] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalReferrals: 0,
    completedReferrals: 0,
    totalEarnings: 0,
    pendingEarnings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      initializeReferrals();
    }
  }, [user]);

  const generateReferralCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const initializeReferrals = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Check if user already has a referral code
      const { data: existingReferrals, error: fetchError } = await supabase
        .from('referrals')
        .select('referral_code')
        .eq('referrer_id', user.id)
        .limit(1);

      if (fetchError) throw fetchError;

      let userReferralCode = "";
      
      if (existingReferrals && existingReferrals.length > 0) {
        userReferralCode = existingReferrals[0].referral_code;
      } else {
        // Generate new referral code
        userReferralCode = generateReferralCode();
        
        // Create initial referral record
        const { error: insertError } = await supabase
          .from('referrals')
          .insert({
            referrer_id: user.id,
            referral_code: userReferralCode,
            status: 'active'
          });

        if (insertError) throw insertError;
      }

      setReferralCode(userReferralCode);
      await fetchReferralData(userReferralCode);
      
    } catch (error) {
      console.error('Error initializing referrals:', error);
      toast({
        title: "Error",
        description: "Failed to load referral data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReferralData = async (code: string) => {
    try {
      // Fetch all referrals for this user
      const { data: referralData, error: referralError } = await supabase
        .from('referrals')
        .select(`
          *,
          referred_profiles:profiles!referrals_referred_id_fkey (
            email,
            display_name,
            first_name,
            last_name
          )
        `)
        .eq('referral_code', code)
        .neq('referred_id', null)
        .order('created_at', { ascending: false });

      if (referralError) throw referralError;

      const referralList = referralData || [];
      setReferrals(referralList);

      // Calculate stats
      const completed = referralList.filter(r => r.status === 'completed').length;
      const earnings = completed * 10; // $10 per successful referral
      const pending = referralList.filter(r => r.status === 'pending').length * 10;

      setStats({
        totalReferrals: referralList.length,
        completedReferrals: completed,
        totalEarnings: earnings,
        pendingEarnings: pending
      });

    } catch (error) {
      console.error('Error fetching referral data:', error);
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

  const shareReferral = async () => {
    const referralLink = `${window.location.origin}?ref=${referralCode}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Zyra Store',
          text: 'Check out this amazing store! Use my referral link to get started.',
          url: referralLink,
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
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
              <p className="text-muted-foreground">You need to be signed in to access the referral program.</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </>
    );
  }

  const referralLink = `${window.location.origin}?ref=${referralCode}`;

  return (
    <>
      <SEOHead 
        title="Referral Program - Zyra Store"
        description="Earn rewards by referring friends to Zyra Store. Get $10 for every successful referral!"
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
        <Navbar />
        
        <div className="py-12">
          <Container>
            {/* Header */}
            <div className="text-center mb-16 animate-fade-in">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-800 rounded-full mb-8 animate-bounce-in shadow-2xl">
                <Users className="h-12 w-12 text-white animate-pulse" />
              </div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent mb-6 animate-text-shimmer">
                Referral Program
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 animate-slide-in-up max-w-2xl mx-auto" style={{animationDelay: '200ms'}}>
                Earn $10 for every friend you refer who makes their first purchase. Share the love and get rewarded!
              </p>
              <div className="flex items-center justify-center gap-4 mt-6 animate-fade-in" style={{animationDelay: '400ms'}}>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <DollarSign className="h-3 w-3 mr-1" />
                  $10 Per Referral
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  <Star className="h-3 w-3 mr-1" />
                  Unlimited Earnings
                </Badge>
                <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                  <Trophy className="h-3 w-3 mr-1" />
                  Instant Rewards
                </Badge>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Stats Cards */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="animate-slide-in-left card-premium border-gradient">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-600" />
                      Your Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
                      <p className="text-3xl font-bold text-green-600">${stats.totalEarnings}</p>
                      <p className="text-sm text-muted-foreground">Total Earnings</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{stats.totalReferrals}</p>
                        <p className="text-xs text-muted-foreground">Total Referrals</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">{stats.completedReferrals}</p>
                        <p className="text-xs text-muted-foreground">Completed</p>
                      </div>
                    </div>

                    {stats.pendingEarnings > 0 && (
                      <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <p className="text-lg font-bold text-yellow-600">${stats.pendingEarnings}</p>
                        <p className="text-xs text-muted-foreground">Pending Earnings</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="animate-slide-in-left card-premium border-gradient" style={{animationDelay: '200ms'}}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="h-5 w-5 text-pink-600" />
                      How It Works
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 font-bold text-xs">1</div>
                        <p>Share your unique referral link with friends</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 font-bold text-xs">2</div>
                        <p>They sign up and make their first purchase</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 font-bold text-xs">3</div>
                        <p>You earn $10 for each successful referral!</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Share Section */}
                <Card className="animate-slide-in-right card-premium border-gradient">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Share2 className="h-6 w-6 text-purple-600" />
                      Share Your Referral Link
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Your Referral Code</label>
                        <div className="flex items-center gap-2">
                          <Input
                            value={referralCode}
                            readOnly
                            className="font-mono text-lg font-bold text-center bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
                          />
                          <Button
                            onClick={copyReferralLink}
                            variant="outline"
                            size="icon"
                            className="hover-3d-lift"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Your Referral Link</label>
                        <div className="flex items-center gap-2">
                          <Input
                            value={referralLink}
                            readOnly
                            className="bg-muted"
                          />
                          <Button
                            onClick={copyReferralLink}
                            variant="outline"
                            className="hover-3d-lift"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        onClick={shareReferral}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover-3d-lift"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Link
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => {
                          const subject = "Join Zyra Store - Amazing Products Await!";
                          const body = `Hi there!\n\nI wanted to share this amazing store with you - Zyra Store has incredible products and great deals.\n\nUse my referral link to get started: ${referralLink}\n\nHope you find something you love!\n\nBest regards`;
                          window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
                        }}
                        className="hover-3d-lift"
                      >
                        Email Invite
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Referral History */}
                <Card className="animate-slide-in-up card-premium border-gradient">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Users className="h-6 w-6 text-blue-600" />
                      Your Referrals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {referrals.length === 0 ? (
                      <div className="text-center py-12">
                        <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Referrals Yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Start sharing your referral link to earn rewards!
                        </p>
                        <Button onClick={shareReferral} className="btn-premium">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share Now
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {referrals.map((referral, index) => (
                          <div
                            key={referral.id}
                            className="flex items-center justify-between p-4 border rounded-xl hover:shadow-lg transition-all duration-300 animate-fade-in hover-3d-lift"
                            style={{animationDelay: `${index * 100}ms`}}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                                {(referral.referred_profiles?.first_name || referral.referred_profiles?.display_name || referral.referred_profiles?.email || 'U')[0].toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium">
                                  {referral.referred_profiles?.first_name && referral.referred_profiles?.last_name
                                    ? `${referral.referred_profiles.first_name} ${referral.referred_profiles.last_name}`
                                    : referral.referred_profiles?.display_name || referral.referred_profiles?.email || 'Unknown User'
                                  }
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Joined {new Date(referral.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge
                                variant={referral.status === 'completed' ? 'default' : referral.status === 'pending' ? 'secondary' : 'destructive'}
                                className="mb-1"
                              >
                                {referral.status}
                              </Badge>
                              <p className="text-sm font-medium">
                                {referral.status === 'completed' ? '+$10' : referral.status === 'pending' ? 'Pending' : '$0'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </Container>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default Referrals;
