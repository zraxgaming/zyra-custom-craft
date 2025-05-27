
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
      // Use raw SQL query since maintenance_mode table might not be in types yet
      const { data, error } = await supabase
        .rpc('get_maintenance_status');

      if (error) {
        // Fallback to direct query if RPC doesn't exist
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('maintenance_mode' as any)
          .select('*')
          .single();
        
        if (fallbackError) throw fallbackError;
        
        if (fallbackData) {
          setIsActive(fallbackData.is_active);
          setMessage(fallbackData.message || '');
        }
      } else if (data && data.length > 0) {
        setIsActive(data[0].is_active);
        setMessage(data[0].message || '');
      }
    } catch (error) {
      console.error('Error fetching maintenance status:', error);
      // Set defaults if table doesn't exist yet
      setIsActive(false);
      setMessage('We are currently performing maintenance. Some features may be temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const updateMaintenanceStatus = async () => {
    setSaving(true);
    try {
      // Try to update existing record or insert new one
      const { error } = await supabase
        .from('maintenance_mode' as any)
        .upsert({
          id: '00000000-0000-0000-0000-000000000001', // Fixed UUID
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
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-scale-in">
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
