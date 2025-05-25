
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SiteConfig {
  brevo_api_key?: string;
  site_name?: string;
  contact_email?: string;
  notifications_enabled?: boolean;
  abandoned_cart_enabled?: boolean;
  newsletter_enabled?: boolean;
  ziina_api_key?: string;
  paypal_client_id?: string;
}

export const useSiteConfig = () => {
  const [config, setConfig] = useState<SiteConfig>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchConfig = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("site_config")
        .select("*");

      if (error) throw error;

      const configObj: SiteConfig = {};
      if (data) {
        data.forEach((item: { key: string; value: any }) => {
          const key = item.key as keyof SiteConfig;
          if (typeof item.value === 'string' || typeof item.value === 'boolean' || typeof item.value === 'number') {
            (configObj as any)[key] = item.value;
          } else if (item.value && typeof item.value === 'object') {
            (configObj as any)[key] = item.value;
          }
        });
      }

      setConfig(configObj);
    } catch (error: any) {
      console.error("Error fetching site config:", error);
      toast({
        title: "Config Error",
        description: "Failed to load site configuration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateConfig = async (key: string, value: any) => {
    try {
      const { error } = await supabase
        .from("site_config")
        .upsert({ key, value });

      if (error) throw error;

      setConfig(prev => ({ ...prev, [key]: value }));
      toast({
        title: "Config Updated",
        description: "Site configuration has been updated",
      });
    } catch (error: any) {
      console.error("Error updating config:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update configuration",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return {
    config,
    isLoading,
    updateConfig,
    refetch: fetchConfig
  };
};
