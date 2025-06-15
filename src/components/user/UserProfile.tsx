import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Crown } from "lucide-react";

const UserProfile = () => {
  const { user } = useAuth();

  if (!user) {
    return <p>Loading...</p>;
  }

  const displayName =
    user.user_metadata?.name ||
    user.user_metadata?.full_name ||
    user.email ||
    "User";

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">User Profile</CardTitle>
        <Button asChild className="ml-auto">
          <Link to="/">Back to Home</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium">{displayName}</span>
            {user.role === "admin" && (<Crown className="h-5 w-5 text-yellow-500" />)}
          </div>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
