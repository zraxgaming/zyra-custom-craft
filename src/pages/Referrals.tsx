
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useReferrals } from "@/hooks/use-referrals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Share2, Gift, Users, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";

const Referrals = () => {
  const { user } = useAuth();
  const { referrals, stats, isLoading } = useReferrals();
  const { toast } = useToast();

  if (!user) {
    return <div>Please sign in to view your referrals.</div>;
  }

  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}?ref=${stats.referralCode}`;
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    });
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background py-12">
          <Container>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </Container>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background py-12">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Referral Program</h1>
              <p className="text-muted-foreground">
                Invite friends and earn rewards for every successful referral!
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">{stats.totalReferrals}</p>
                      <p className="text-sm text-muted-foreground">Total Referrals</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">{stats.activeReferrals}</p>
                      <p className="text-sm text-muted-foreground">Active</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="text-2xl font-bold">{stats.pendingReferrals}</p>
                      <p className="text-sm text-muted-foreground">Pending</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-2xl font-bold">${stats.totalRewards}</p>
                      <p className="text-sm text-muted-foreground">Total Earned</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Referral Link */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Your Referral Link</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    value={`${window.location.origin}?ref=${stats.referralCode}`}
                    readOnly
                    className="flex-1"
                  />
                  <Button onClick={copyReferralLink} variant="outline">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Share this link with friends to earn $10 for each successful referral!
                </p>
              </CardContent>
            </Card>

            {/* Referral History */}
            <Card>
              <CardHeader>
                <CardTitle>Referral History</CardTitle>
              </CardHeader>
              <CardContent>
                {referrals.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">
                    No referrals yet. Start sharing your link to earn rewards!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {referrals.map((referral) => (
                      <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Referral #{referral.id.slice(-6)}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(referral.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge 
                            variant={referral.status === 'active' ? 'default' : 'secondary'}
                          >
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
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Referrals;
