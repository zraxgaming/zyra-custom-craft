
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAuth } from "@/hooks/use-auth";
import { Save, Store, Palette, Mail, Globe } from "lucide-react";

interface SiteSettings {
  site_name: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  social_facebook: string;
  social_twitter: string;
  social_instagram: string;
  meta_title: string;
  meta_description: string;
}

interface BrandSettings {
  logo_url: string;
  favicon_url: string;
  primary_color: string;
  secondary_color: string;
  font_primary: string;
  font_secondary: string;
}

const Settings = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    site_name: "Zyra Store",
    site_description: "Your one-stop shop for premium products",
    contact_email: "contact@zyrastore.com",
    contact_phone: "+1 (555) 123-4567",
    address: "123 Commerce St, City, State 12345",
    social_facebook: "https://facebook.com/zyrastore",
    social_twitter: "https://twitter.com/zyrastore",
    social_instagram: "https://instagram.com/zyrastore",
    meta_title: "Zyra Store | Premium Products",
    meta_description: "Discover quality products at Zyra Store, your trusted online retailer for all your needs."
  });
  
  const [brandSettings, setBrandSettings] = useState<BrandSettings>({
    logo_url: "",
    favicon_url: "",
    primary_color: "#6a0dad",
    secondary_color: "#f8f9fa",
    font_primary: "Inter",
    font_secondary: "Roboto"
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if not admin
  useEffect(() => {
    if (user && !isAdmin) {
      navigate("/");
      toast({
        title: "Access denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
    }
  }, [isAdmin, user, navigate, toast]);

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Fetch site configuration
        const { data: siteConfigData, error: siteConfigError } = await supabase
          .from("site_config")
          .select("*");
          
        if (siteConfigError) throw siteConfigError;
        
        if (siteConfigData && siteConfigData.length > 0) {
          const configMap: {[key: string]: string} = {};
          siteConfigData.forEach((item: any) => {
            configMap[item.key] = item.value;
          });
          
          setSiteSettings(prevSettings => ({
            ...prevSettings,
            site_name: configMap.site_name || prevSettings.site_name,
            site_description: configMap.site_description || prevSettings.site_description,
            contact_email: configMap.contact_email || prevSettings.contact_email,
            contact_phone: configMap.contact_phone || prevSettings.contact_phone,
            address: configMap.address || prevSettings.address,
            social_facebook: configMap.social_facebook || prevSettings.social_facebook,
            social_twitter: configMap.social_twitter || prevSettings.social_twitter,
            social_instagram: configMap.social_instagram || prevSettings.social_instagram,
            meta_title: configMap.meta_title || prevSettings.meta_title,
            meta_description: configMap.meta_description || prevSettings.meta_description
          }));
        }
        
        // Fetch brand settings
        const { data: brandData, error: brandError } = await supabase
          .from("brand_settings")
          .select("*")
          .limit(1)
          .single();
          
        if (brandError && brandError.code !== 'PGRST116') {
          // PGRST116 is the error code for "no rows returned"
          throw brandError;
        }
        
        if (brandData) {
          setBrandSettings({
            logo_url: brandData.logo_url || "",
            favicon_url: brandData.favicon_url || "",
            primary_color: brandData.primary_color || "#6a0dad",
            secondary_color: brandData.secondary_color || "#f8f9fa",
            font_primary: brandData.font_primary || "Inter",
            font_secondary: brandData.font_secondary || "Roboto"
          });
        }
        
      } catch (error: any) {
        console.error("Error fetching settings:", error);
        toast({
          title: "Error fetching settings",
          description: error.message,
          variant: "destructive",
        });
      }
    };
    
    fetchSettings();
  }, [toast]);

  // Save settings
  const saveSettings = async () => {
    if (!user || !isAdmin) return;
    
    try {
      setIsSaving(true);
      
      // Save site configuration
      const siteConfigEntries = Object.entries(siteSettings).map(([key, value]) => ({
        key,
        value: value || "",
        type: "text",
        description: `Store ${key.replace(/_/g, ' ')}`
      }));
      
      for (const entry of siteConfigEntries) {
        // Check if config exists
        const { data: existingConfig } = await supabase
          .from("site_config")
          .select("*")
          .eq("key", entry.key)
          .limit(1);
          
        if (existingConfig && existingConfig.length > 0) {
          // Update existing config
          await supabase
            .from("site_config")
            .update({ value: entry.value })
            .eq("key", entry.key);
        } else {
          // Insert new config
          await supabase
            .from("site_config")
            .insert(entry);
        }
      }
      
      // Save brand settings
      const { data: existingBrand } = await supabase
        .from("brand_settings")
        .select("id")
        .limit(1);
        
      if (existingBrand && existingBrand.length > 0) {
        // Update existing brand settings
        await supabase
          .from("brand_settings")
          .update(brandSettings)
          .eq("id", existingBrand[0].id);
      } else {
        // Insert new brand settings
        await supabase
          .from("brand_settings")
          .insert(brandSettings);
      }
      
      toast({
        title: "Settings saved",
        description: "Your changes have been saved successfully.",
      });
      
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle site settings change
  const handleSiteSettingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSiteSettings(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle brand settings change
  const handleBrandSettingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBrandSettings(prev => ({ ...prev, [name]: value }));
  };
  
  if (!user) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zyra-purple"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Store Settings</h1>
          <Button 
            onClick={saveSettings} 
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="branding" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Branding
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Contact
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              SEO
            </TabsTrigger>
          </TabsList>
          
          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>
                  Basic information about your store
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="site_name">Store Name</Label>
                  <Input 
                    id="site_name"
                    name="site_name"
                    value={siteSettings.site_name}
                    onChange={handleSiteSettingChange}
                  />
                </div>
                <div>
                  <Label htmlFor="site_description">Store Description</Label>
                  <Textarea
                    id="site_description"
                    name="site_description"
                    value={siteSettings.site_description}
                    onChange={handleSiteSettingChange}
                    rows={4}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveSettings} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Branding Settings */}
          <TabsContent value="branding">
            <Card>
              <CardHeader>
                <CardTitle>Branding</CardTitle>
                <CardDescription>
                  Customize the look and feel of your store
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="logo_url">Logo URL</Label>
                    <Input 
                      id="logo_url"
                      name="logo_url"
                      value={brandSettings.logo_url}
                      onChange={handleBrandSettingChange}
                      placeholder="https://example.com/logo.png"
                    />
                    {brandSettings.logo_url && (
                      <div className="mt-2 p-2 border rounded">
                        <img 
                          src={brandSettings.logo_url} 
                          alt="Logo preview" 
                          className="h-16 object-contain" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="favicon_url">Favicon URL</Label>
                    <Input 
                      id="favicon_url"
                      name="favicon_url"
                      value={brandSettings.favicon_url}
                      onChange={handleBrandSettingChange}
                      placeholder="https://example.com/favicon.ico"
                    />
                    {brandSettings.favicon_url && (
                      <div className="mt-2 p-2 border rounded">
                        <img 
                          src={brandSettings.favicon_url} 
                          alt="Favicon preview" 
                          className="h-8 object-contain" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="primary_color">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="primary_color"
                        name="primary_color"
                        value={brandSettings.primary_color}
                        onChange={handleBrandSettingChange}
                        className="flex-1"
                      />
                      <input 
                        type="color" 
                        value={brandSettings.primary_color}
                        onChange={(e) => {
                          setBrandSettings(prev => ({
                            ...prev,
                            primary_color: e.target.value
                          }));
                        }}
                        className="w-12 h-10 p-1 rounded border"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="secondary_color">Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="secondary_color"
                        name="secondary_color"
                        value={brandSettings.secondary_color}
                        onChange={handleBrandSettingChange}
                        className="flex-1"
                      />
                      <input 
                        type="color" 
                        value={brandSettings.secondary_color}
                        onChange={(e) => {
                          setBrandSettings(prev => ({
                            ...prev,
                            secondary_color: e.target.value
                          }));
                        }}
                        className="w-12 h-10 p-1 rounded border"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="font_primary">Primary Font</Label>
                    <select
                      id="font_primary"
                      name="font_primary"
                      value={brandSettings.font_primary}
                      onChange={handleBrandSettingChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="Inter">Inter</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Open Sans">Open Sans</option>
                      <option value="Montserrat">Montserrat</option>
                      <option value="Lato">Lato</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="font_secondary">Secondary Font</Label>
                    <select
                      id="font_secondary"
                      name="font_secondary"
                      value={brandSettings.font_secondary}
                      onChange={handleBrandSettingChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="Roboto">Roboto</option>
                      <option value="Inter">Inter</option>
                      <option value="Open Sans">Open Sans</option>
                      <option value="Montserrat">Montserrat</option>
                      <option value="Lato">Lato</option>
                    </select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveSettings} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Contact Settings */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Contact details for your store
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="contact_email">Email Address</Label>
                    <Input 
                      id="contact_email"
                      name="contact_email"
                      value={siteSettings.contact_email}
                      onChange={handleSiteSettingChange}
                      type="email"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contact_phone">Phone Number</Label>
                    <Input 
                      id="contact_phone"
                      name="contact_phone"
                      value={siteSettings.contact_phone}
                      onChange={handleSiteSettingChange}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={siteSettings.address}
                    onChange={handleSiteSettingChange}
                    rows={3}
                  />
                </div>
                
                <div className="pt-4 space-y-4">
                  <h3 className="text-lg font-medium">Social Media</h3>
                  
                  <div>
                    <Label htmlFor="social_facebook">Facebook URL</Label>
                    <Input 
                      id="social_facebook"
                      name="social_facebook"
                      value={siteSettings.social_facebook}
                      onChange={handleSiteSettingChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="social_twitter">Twitter URL</Label>
                    <Input 
                      id="social_twitter"
                      name="social_twitter"
                      value={siteSettings.social_twitter}
                      onChange={handleSiteSettingChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="social_instagram">Instagram URL</Label>
                    <Input 
                      id="social_instagram"
                      name="social_instagram"
                      value={siteSettings.social_instagram}
                      onChange={handleSiteSettingChange}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveSettings} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* SEO Settings */}
          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>
                  Configure search engine optimization settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input 
                    id="meta_title"
                    name="meta_title"
                    value={siteSettings.meta_title}
                    onChange={handleSiteSettingChange}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Recommended: 50-60 characters
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    name="meta_description"
                    value={siteSettings.meta_description}
                    onChange={handleSiteSettingChange}
                    rows={4}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Recommended: 150-160 characters
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveSettings} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Settings;
