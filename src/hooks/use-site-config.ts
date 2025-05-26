
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SiteConfig {
  site_name: string;
  site_description: string;
  contact_email: string;
  support_phone: string;
  address: string;
  social_media: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  business_hours: string;
  newsletter_enabled: boolean;
  abandoned_cart_enabled: boolean;
  brevo_api_key?: string;
}

const defaultConfig: SiteConfig = {
  site_name: "Zyra",
  site_description: "Premium custom products and personalization services",
  contact_email: "hello@zyra.com",
  support_phone: "+1 (555) 123-4567",
  address: "123 Business Street, City, State 12345",
  social_media: {},
  business_hours: "Monday - Friday: 9:00 AM - 6:00 PM",
  newsletter_enabled: true,
  abandoned_cart_enabled: true,
};

export const useSiteConfig = () => {
  return useQuery({
    queryKey: ["siteConfig"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_config")
        .select("*");

      if (error) throw error;

      // Convert array of key-value pairs to object
      const config = data.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {} as any);

      return { ...defaultConfig, ...config } as SiteConfig;
    },
  });
};

export const useUpdateSiteConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<SiteConfig>) => {
      const promises = Object.entries(updates).map(([key, value]) =>
        supabase
          .from("site_config")
          .upsert({ key, value }, { onConflict: "key" })
      );

      const results = await Promise.all(promises);
      const errors = results.filter(result => result.error);
      
      if (errors.length > 0) {
        throw new Error("Failed to update site configuration");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["siteConfig"] });
    },
  });
};
