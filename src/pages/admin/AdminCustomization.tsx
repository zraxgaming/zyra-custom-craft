
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Palette, Code, Layout } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminCustomization = () => {
  const { toast } = useToast();
  const [customization, setCustomization] = useState({
    customCSS: "",
    customJS: "",
    headerCode: "",
    footerCode: "",
    enableCustomization: true,
    maintenanceMode: false,
    maintenanceMessage: "We are currently performing maintenance."
  });

  const handleSave = () => {
    toast({
      title: "Customization Updated",
      description: "Your customization settings have been saved successfully.",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Site Customization</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="h-5 w-5" />
                  General Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Customization</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow custom CSS and JavaScript
                    </p>
                  </div>
                  <Switch
                    checked={customization.enableCustomization}
                    onCheckedChange={(checked) => 
                      setCustomization(prev => ({ ...prev, enableCustomization: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable site maintenance mode
                    </p>
                  </div>
                  <Switch
                    checked={customization.maintenanceMode}
                    onCheckedChange={(checked) => 
                      setCustomization(prev => ({ ...prev, maintenanceMode: checked }))
                    }
                  />
                </div>
                
                {customization.maintenanceMode && (
                  <div>
                    <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                    <Textarea
                      id="maintenanceMessage"
                      value={customization.maintenanceMessage}
                      onChange={(e) => setCustomization(prev => ({ ...prev, maintenanceMessage: e.target.value }))}
                      placeholder="Enter maintenance message..."
                    />
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Custom CSS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="customCSS">Custom Styles</Label>
                  <Textarea
                    id="customCSS"
                    value={customization.customCSS}
                    onChange={(e) => setCustomization(prev => ({ ...prev, customCSS: e.target.value }))}
                    placeholder="/* Enter your custom CSS here */"
                    className="font-mono h-40 mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Custom JavaScript
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="customJS">Custom Scripts</Label>
                  <Textarea
                    id="customJS"
                    value={customization.customJS}
                    onChange={(e) => setCustomization(prev => ({ ...prev, customJS: e.target.value }))}
                    placeholder="// Enter your custom JavaScript here"
                    className="font-mono h-40 mt-2"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Header & Footer Code</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="headerCode">Header Code</Label>
                  <Textarea
                    id="headerCode"
                    value={customization.headerCode}
                    onChange={(e) => setCustomization(prev => ({ ...prev, headerCode: e.target.value }))}
                    placeholder="<!-- Analytics, meta tags, etc. -->"
                    className="font-mono h-24 mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="footerCode">Footer Code</Label>
                  <Textarea
                    id="footerCode"
                    value={customization.footerCode}
                    onChange={(e) => setCustomization(prev => ({ ...prev, footerCode: e.target.value }))}
                    placeholder="<!-- Tracking scripts, etc. -->"
                    className="font-mono h-24 mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleSave} className="px-8">
            Save Customization Settings
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCustomization;
