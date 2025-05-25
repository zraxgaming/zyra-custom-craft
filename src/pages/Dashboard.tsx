
import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Container } from "@/components/ui/container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ReferralDashboard from "@/components/referrals/ReferralDashboard";
import UserAnalytics from "@/components/analytics/UserAnalytics";
import { User, BarChart3, Users } from "lucide-react";

const Dashboard = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 py-12">
        <Container>
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Welcome back, {user.user_metadata?.first_name || 'User'}!
            </h1>
            <p className="text-muted-foreground">Manage your account, track your activity, and grow with referrals.</p>
          </div>

          <Tabs defaultValue="analytics" className="w-full animate-scale-in">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="referrals" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Referrals
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="analytics" className="space-y-6">
              <UserAnalytics />
            </TabsContent>
            
            <TabsContent value="referrals" className="space-y-6">
              <ReferralDashboard />
            </TabsContent>
            
            <TabsContent value="profile" className="space-y-6">
              <div className="text-center py-12">
                <User className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Profile Settings</h3>
                <p className="text-muted-foreground">Profile management coming soon!</p>
              </div>
            </TabsContent>
          </Tabs>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
