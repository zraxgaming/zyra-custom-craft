
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, Save } from 'lucide-react';

const MaintenanceToggle = () => {
  const [isActive, setIsActive] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMaintenanceStatus();
  }, []);

  const fetchMaintenanceStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('maintenance_mode')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching maintenance status:', error);
        // Set defaults if table doesn't exist yet
        setIsActive(false);
        setMessage('We are currently performing maintenance. Some features may be temporarily unavailable.');
      } else if (data) {
        setIsActive(data.is_active || false);
        setMessage(data.message || 'We are currently performing maintenance. Some features may be temporarily unavailable.');
      }
    } catch (error) {
      console.error('Error fetching maintenance status:', error);
      // Set defaults if there's an error
      setIsActive(false);
      setMessage('We are currently performing maintenance. Some features may be temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const updateMaintenanceStatus = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('maintenance_mode')
        .upsert({
          id: '00000000-0000-0000-0000-000000000001',
          is_active: isActive,
          message: message || 'We are currently performing maintenance. Some features may be temporarily unavailable.',
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (error) throw error;

      toast({
        title: "Maintenance Status Updated",
        description: `Maintenance mode is now ${isActive ? 'enabled' : 'disabled'}`,
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-scale-in bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Maintenance Mode
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <Label htmlFor="maintenance-toggle" className="text-foreground font-medium">
            Enable Maintenance Mode
          </Label>
          <Switch
            id="maintenance-toggle"
            checked={isActive}
            onCheckedChange={setIsActive}
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
        </div>

        <Button
          onClick={updateMaintenanceStatus}
          disabled={saving}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Update Maintenance Status
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MaintenanceToggle;
