import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { User, Mail, Save } from "lucide-react";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  display_name: string;
  phone?: string;
  avatar_url: string;
  preferred_currency: string;
  preferred_language: string;
  role: string;
  created_at: string;
  updated_at: string;
}

const ProfileSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    display_name: "",
    phone: "",
    preferred_currency: "USD",
    preferred_language: "en"
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      const profileData = data as Profile;
      setProfile(profileData);
      setFormData({
        first_name: profileData.first_name || "",
        last_name: profileData.last_name || "",
        username: profileData.username || "",
        display_name: profileData.display_name || "",
        phone: "", // Note: phone field doesn't exist in current schema
        preferred_currency: profileData.preferred_currency || "USD",
        preferred_language: profileData.preferred_language || "en"
      });
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile information",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          username: formData.username,
          display_name: formData.display_name,
          preferred_currency: formData.preferred_currency,
          preferred_language: formData.preferred_language,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile information has been saved successfully."
      });

      // Refresh profile data
      fetchProfile();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile information",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <Container className="py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">Please sign in</h1>
            <p className="text-gray-600 dark:text-gray-400">You need to be signed in to access your profile settings.</p>
          </div>
        </Container>
        <Footer />
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <Container className="py-12">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zyra-purple"></div>
          </div>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container className="py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">Profile Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your account information and preferences
            </p>
          </div>

          <div className="space-y-6">
            {/* Basic Information */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <User className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name" className="text-gray-900 dark:text-gray-100">First Name</Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name" className="text-gray-900 dark:text-gray-100">Last Name</Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="username" className="text-gray-900 dark:text-gray-100">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                  />
                </div>

                <div>
                  <Label htmlFor="display_name" className="text-gray-900 dark:text-gray-100">Display Name</Label>
                  <Input
                    id="display_name"
                    name="display_name"
                    value={formData.display_name}
                    onChange={handleInputChange}
                    className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Mail className="h-5 w-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-900 dark:text-gray-100">Email</Label>
                  <Input
                    value={user.email || ""}
                    disabled
                    className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Email cannot be changed from this page
                  </p>
                </div>

                <div>
                  <Label className="text-gray-900 dark:text-gray-100">Role</Label>
                  <Input
                    value={profile?.role || "user"}
                    disabled
                    className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="preferred_currency" className="text-gray-900 dark:text-gray-100">Preferred Currency</Label>
                    <select
                      id="preferred_currency"
                      name="preferred_currency"
                      value={formData.preferred_currency}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-white dark:bg-gray-800 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-gray-900 dark:text-gray-100"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="AED">AED - UAE Dirham</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="preferred_language" className="text-gray-900 dark:text-gray-100">Preferred Language</Label>
                    <select
                      id="preferred_language"
                      name="preferred_language"
                      value={formData.preferred_language}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-white dark:bg-gray-800 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-gray-900 dark:text-gray-100"
                    >
                      <option value="en">English</option>
                      <option value="ar">Arabic</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-zyra-purple hover:bg-zyra-dark-purple text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default ProfileSettings;
