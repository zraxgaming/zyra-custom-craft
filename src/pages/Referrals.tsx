
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Users, Gift, Share2, Trophy, Star } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import { useReferrals, useCreateReferralCode, useApplyReferralCode } from "@/hooks/use-referrals";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

const Referrals = () => {
  const [referralInput, setReferralInput] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: referrals = [] } = useReferrals();
  const createReferralCode = useCreateReferralCode();
  const applyReferralCode = useApplyReferralCode();

  const userReferralCode = referrals.find(r => r.status === "active")?.referral_code;
  const completedReferrals = referrals.filter(r => r.status === "completed");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard",
    });
  };

  const shareReferral = () => {
    if (!userReferralCode) return;
    
    const shareData = {
      title: 'Join Zyra with my referral code!',
      text: `Use my referral code ${userReferralCode} to get started on Zyra`,
      url: `${window.location.origin}?ref=${userReferralCode}`
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      copyToClipboard(`${shareData.text} - ${shareData.url}`);
    }
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <Container className="py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please sign in to access referrals</h1>
            <Button onClick={() => window.location.href = '/auth'}>
              Sign In
            </Button>
          </div>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEOHead 
        title="Referral Program - Zyra"
        description="Earn rewards by referring friends to Zyra. Share your referral code and get benefits for every successful referral."
        url="https://zyra.lovable.app/referrals"
      />
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-purple-500/10 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-primary to-purple-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-40 right-10 w-80 h-80 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full blur-3xl animate-pulse"></div>
        </div>

        {/* Hero Section */}
        <section className="relative py-16 overflow-hidden">
          <Container className="relative z-10">
            <div className="text-center mb-12 animate-fade-in">
              <Badge className="mb-6 bg-gradient-to-r from-primary to-purple-600 hover:scale-110 transition-transform duration-300 text-lg px-6 py-3" variant="outline">
                <Users className="h-5 w-5 mr-3" />
                Referral Program
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-scale-in">
                Earn Rewards
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-slide-in-right">
                Share Zyra with your friends and earn amazing rewards for every successful referral!
              </p>
            </div>
          </Container>
        </section>

        <Container className="py-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Your Referral Code */}
            <Card className="bg-card/60 backdrop-blur-sm border-border/50 animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Your Referral Code
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userReferralCode ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Input 
                        value={userReferralCode} 
                        readOnly 
                        className="font-mono text-lg"
                      />
                      <Button 
                        onClick={() => copyToClipboard(userReferralCode)}
                        size="icon"
                        variant="outline"
                        className="hover:scale-110 transition-transform"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={shareReferral}
                        className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Code
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-muted-foreground">You don't have a referral code yet.</p>
                    <Button 
                      onClick={() => createReferralCode.mutate()}
                      disabled={createReferralCode.isPending}
                      className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                    >
                      {createReferralCode.isPending ? "Creating..." : "Create Referral Code"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Apply Referral Code */}
            <Card className="bg-card/60 backdrop-blur-sm border-border/50 animate-scale-in" style={{ animationDelay: '200ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Have a Referral Code?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Enter referral code"
                  value={referralInput}
                  onChange={(e) => setReferralInput(e.target.value)}
                  className="font-mono"
                />
                <Button 
                  onClick={() => applyReferralCode.mutate(referralInput)}
                  disabled={!referralInput.trim() || applyReferralCode.isPending}
                  className="w-full"
                >
                  {applyReferralCode.isPending ? "Applying..." : "Apply Code"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Referral Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="bg-card/60 backdrop-blur-sm border-border/50 animate-scale-in" style={{ animationDelay: '300ms' }}>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{completedReferrals.length}</div>
                <div className="text-muted-foreground">Successful Referrals</div>
              </CardContent>
            </Card>

            <Card className="bg-card/60 backdrop-blur-sm border-border/50 animate-scale-in" style={{ animationDelay: '400ms' }}>
              <CardContent className="p-6 text-center">
                <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">
                  {referrals.filter(r => r.reward_earned).length}
                </div>
                <div className="text-muted-foreground">Rewards Earned</div>
              </CardContent>
            </Card>

            <Card className="bg-card/60 backdrop-blur-sm border-border/50 animate-scale-in" style={{ animationDelay: '500ms' }}>
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">
                  ${(completedReferrals.length * 10).toFixed(2)}
                </div>
                <div className="text-muted-foreground">Total Earnings</div>
              </CardContent>
            </Card>
          </div>

          {/* How It Works */}
          <Card className="bg-card/60 backdrop-blur-sm border-border/50 mt-8 animate-fade-in">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Share Your Code</h3>
                  <p className="text-sm text-muted-foreground">
                    Share your unique referral code with friends and family
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">They Sign Up</h3>
                  <p className="text-sm text-muted-foreground">
                    Your friends create an account using your referral code
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Earn Rewards</h3>
                  <p className="text-sm text-muted-foreground">
                    Get $10 credit for each successful referral
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Referrals */}
          {referrals.length > 0 && (
            <Card className="bg-card/60 backdrop-blur-sm border-border/50 mt-8 animate-fade-in">
              <CardHeader>
                <CardTitle>Your Referrals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {referrals.map((referral) => (
                    <div 
                      key={referral.id}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div>
                        <div className="font-medium">Code: {referral.referral_code}</div>
                        <div className="text-sm text-muted-foreground">
                          Created: {new Date(referral.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={referral.status === "completed" ? "default" : "outline"}
                          className={referral.status === "completed" ? "bg-green-500 hover:bg-green-600" : ""}
                        >
                          {referral.status}
                        </Badge>
                        {referral.reward_earned && (
                          <Badge className="bg-yellow-500 hover:bg-yellow-600">
                            Reward Earned
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Referrals;
