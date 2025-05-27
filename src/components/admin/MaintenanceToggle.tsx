
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

      if (error) throw error;

      if (data) {
        setIsActive(data.is_active);
        setMessage(data.message || '');
      }
    } catch (error) {
      console.error('Error fetching maintenance status:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateMaintenanceStatus = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('maintenance_mode')
        .update({
          is_active: isActive,
          message: message || 'We are currently performing maintenance. Some features may be temporarily unavailable.',
          updated_at: new Date().toISOString()
        })
        .eq('id', (await supabase.from('maintenance_mode').select('id').single()).data?.id);

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
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Maintenance Mode
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="maintenance-toggle">Enable Maintenance Mode</Label>
          <Switch
            id="maintenance-toggle"
            checked={isActive}
            onCheckedChange={setIsActive}
          />
        </div>

        <div>
          <Label htmlFor="maintenance-message">Maintenance Message</Label>
          <Input
            id="maintenance-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter maintenance message..."
            className="mt-1"
          />
        </div>

        <Button
          onClick={updateMaintenanceStatus}
          disabled={saving}
          className="w-full"
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
