
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id?: string;
  referral_code: string;
  status: string;
  reward_earned: boolean;
  created_at: string;
  updated_at: string;
}

export const useReferrals = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["referrals", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("referrals")
        .select("*")
        .eq("referrer_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Referral[];
    },
    enabled: !!user,
  });
};

export const useCreateReferralCode = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("User not authenticated");

      // Check if user already has a referral code
      const { data: existing } = await supabase
        .from("referrals")
        .select("referral_code")
        .eq("referrer_id", user.id)
        .eq("status", "active")
        .single();

      if (existing) {
        return existing.referral_code;
      }

      // Generate unique referral code
      const code = `REF${user.id.slice(0, 8).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      const { data, error } = await supabase
        .from("referrals")
        .insert({
          referrer_id: user.id,
          referral_code: code,
          status: "active"
        })
        .select("referral_code")
        .single();

      if (error) throw error;
      return data.referral_code;
    },
    onSuccess: (code) => {
      toast({
        title: "Referral code created!",
        description: `Your referral code: ${code}`,
      });
      queryClient.invalidateQueries({ queryKey: ["referrals"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating referral code",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useApplyReferralCode = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (code: string) => {
      if (!user) throw new Error("User not authenticated");

      // Find the referral code
      const { data: referral, error: findError } = await supabase
        .from("referrals")
        .select("*")
        .eq("referral_code", code)
        .eq("status", "active")
        .single();

      if (findError || !referral) {
        throw new Error("Invalid referral code");
      }

      if (referral.referrer_id === user.id) {
        throw new Error("You cannot use your own referral code");
      }

      if (referral.referred_id) {
        throw new Error("This referral code has already been used");
      }

      // Update the referral with the new user
      const { error: updateError } = await supabase
        .from("referrals")
        .update({
          referred_id: user.id,
          status: "completed"
        })
        .eq("id", referral.id);

      if (updateError) throw updateError;

      return referral;
    },
    onSuccess: () => {
      toast({
        title: "Referral code applied!",
        description: "You've successfully used a referral code.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error applying referral code",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
