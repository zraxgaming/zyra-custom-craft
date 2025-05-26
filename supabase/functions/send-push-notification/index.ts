
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PushNotificationRequest {
  subscription: PushSubscription;
  notification: {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    tag?: string;
    data?: any;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { subscription, notification }: PushNotificationRequest = await req.json();

    // In a real implementation, you would use a service like FCM or your own push service
    // For now, we'll simulate the push notification
    console.log("Sending push notification:", {
      endpoint: subscription.endpoint,
      notification
    });

    // Here you would typically:
    // 1. Use Web Push library to send notification
    // 2. Handle different push services (FCM, Mozilla, etc.)
    // 3. Store notification history in database

    return new Response(
      JSON.stringify({ success: true, message: "Push notification sent" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error sending push notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
