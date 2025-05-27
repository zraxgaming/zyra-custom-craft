
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Palette, Upload, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminBranding = () => {
  const { toast } = useToast();
  const [branding, setBranding] = useState({
    siteName: "Zyra Custom Craft",
    tagline: "Personalized Crafts & Gifts",
    primaryColor: "#8B5CF6",
    secondaryColor: "#EC4899",
    logo: "",
    favicon: ""
  });

  const handleSave = () => {
    toast({
      title: "Branding Updated",
      description: "Your branding settings have been saved successfully.",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Branding & Appearance</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Brand Identity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={branding.siteName}
                    onChange={(e) => setBranding(prev => ({ ...prev, siteName: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={branding.tagline}
                    onChange={(e) => setBranding(prev => ({ ...prev, tagline: e.target.value }))}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={branding.primaryColor}
                        onChange={(e) => setBranding(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={branding.primaryColor}
                        onChange={(e) => setBranding(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={branding.secondaryColor}
                        onChange={(e) => setBranding(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={branding.secondaryColor}
                        onChange={(e) => setBranding(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Logo & Assets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Logo Upload</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Click to upload logo</p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                  </div>
                </div>
                
                <div>
                  <Label>Favicon Upload</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Click to upload favicon</p>
                    <p className="text-xs text-gray-500">ICO, PNG 32x32px</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div 
                  className="p-6 rounded-lg text-white text-center"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  <h2 className="text-2xl font-bold">{branding.siteName}</h2>
                  <p className="text-sm opacity-90">{branding.tagline}</p>
                </div>
                
                <div className="flex gap-2">
                  <div 
                    className="flex-1 h-16 rounded"
                    style={{ backgroundColor: branding.primaryColor }}
                  ></div>
                  <div 
                    className="flex-1 h-16 rounded"
                    style={{ backgroundColor: branding.secondaryColor }}
                  ></div>
                </div>
                
                <p className="text-sm text-gray-600">
                  This is how your brand colors will appear across the site.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleSave} className="px-8">
            Save Branding Settings
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBranding;
