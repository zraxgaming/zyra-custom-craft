
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useSiteConfig, useUpdateSiteConfig } from '@/hooks/use-site-config';
import { AlertTriangle, Save, Loader2 } from 'lucide-react';

const MaintenanceToggle = () => {
  const { data: siteConfig, isLoading } = useSiteConfig();
  const updateSiteConfig = useUpdateSiteConfig();
  const [isActive, setIsActive] = useState(false);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (siteConfig) {
      setIsActive(siteConfig.maintenance_mode === "true");
      setMessage(siteConfig.maintenance_message || 'We are currently performing maintenance. Some features may be temporarily unavailable.');
    }
  }, [siteConfig]);

  const updateMaintenanceStatus = async () => {
    setSaving(true);
    try {
      await updateSiteConfig.mutateAsync({
        maintenance_mode: isActive.toString(),
        maintenance_message: message || 'We are currently performing maintenance. Some features may be temporarily unavailable.'
      });

      toast({
        title: "Maintenance Status Updated",
        description: `Maintenance mode is now ${isActive ? 'enabled' : 'disabled'}`,
      });
    } catch (error: any) {
      console.error('Error updating maintenance status:', error);
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardContent className="p-6 text-center">
          <Loader2 className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-sm text-muted-foreground mt-2">Loading maintenance settings...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-scale-in bg-card/80 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          Maintenance Mode Control
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
          <Label htmlFor="maintenance-toggle" className="text-foreground font-medium flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
            Enable Maintenance Mode
          </Label>
          <Switch
            id="maintenance-toggle"
            checked={isActive}
            onCheckedChange={setIsActive}
            className="data-[state=checked]:bg-red-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maintenance-message" className="text-foreground font-medium">
            Maintenance Message
          </Label>
          <Input
            id="maintenance-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter maintenance message..."
            className="bg-background/50 border-border/50 focus:border-primary transition-colors"
          />
          <p className="text-xs text-muted-foreground">
            This message will be displayed to users when maintenance mode is active.
          </p>
        </div>

        <div className="bg-muted/30 rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-2">Preview:</h4>
          <div className={`text-sm p-3 rounded-md ${isActive ? 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300' : 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300'}`}>
            {isActive ? `🚧 ${message}` : '✅ Website is operating normally'}
          </div>
        </div>

        <Button
          onClick={updateMaintenanceStatus}
          disabled={saving}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-[1.02]"
        >
          {saving ? (
            <>
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              Updating...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Update Maintenance Status
            </>
          )}
        </Button>

        {isActive && (
          <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 animate-fade-in">
            <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Warning</span>
            </div>
            <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
              Maintenance mode is currently active. Visitors will see the maintenance banner.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MaintenanceToggle;
