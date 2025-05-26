
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SiteConfig {
  site_name?: string;
  site_description?: string;
  site_logo?: string;
  contact_email?: string;
  contact_phone?: string;
  social_facebook?: string;
  social_twitter?: string;
  social_instagram?: string;
  vapid_public_key?: string;
  maintenance_mode?: boolean;
  analytics_enabled?: boolean;
}

export const useSiteConfig = () => {
  return useQuery({
    queryKey: ["site-config"],
    queryFn: async (): Promise<SiteConfig> => {
      const { data, error } = await supabase
        .from("site_config")
        .select("*");

      if (error) {
        console.error("Error fetching site config:", error);
        return {};
      }

      const config: SiteConfig = {};
      data?.forEach(item => {
        config[item.key as keyof SiteConfig] = item.value as any;
      });

      return config;
    },
  });
};
