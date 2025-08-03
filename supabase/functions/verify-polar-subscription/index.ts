import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Subscription verification request received');
    
    const { subscriptionId } = await req.json();
    
    console.log('Subscription data:', { subscriptionId });

    const polarAccessToken = Deno.env.get("POLAR_ACCESS_TOKEN");
    if (!polarAccessToken) {
      console.error('Polar access token not configured');
      throw new Error("Polar access token not configured");
    }

    // Verify subscription with Polar
    const response = await fetch(`https://api.polar.sh/v1/subscriptions/${subscriptionId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${polarAccessToken}`,
        "Content-Type": "application/json",
      },
    });

    const subscription = await response.json();
    console.log('Polar subscription response:', { status: response.status, subscription });

    if (!response.ok) {
      console.error('Polar API error:', subscription);
      throw new Error(subscription.error?.message || `Polar API error: ${response.status}`);
    }

    console.log('Subscription verified successfully');

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      console.error('User authentication failed:', userError);
      throw new Error("User not authenticated");
    }

    console.log('User authenticated:', userData.user.id);

    // Update subscription status
    const { error: subscriptionError } = await supabaseClient
      .from("subscriptions")
      .update({
        polar_subscription_id: subscriptionId,
        status: subscription.status,
        amount: subscription.price?.amount || 0,
        currency: subscription.price?.currency || 'USD'
      })
      .eq("user_id", userData.user.id);

    if (subscriptionError) {
      console.error('Subscription update error:', subscriptionError);
      throw new Error(`Failed to update subscription: ${subscriptionError.message}`);
    }

    console.log('Subscription updated successfully');

    // Calculate premium expiry date based on subscription
    let premiumExpiresAt = new Date();
    if (subscription.status === 'active') {
      premiumExpiresAt = new Date(subscription.current_period_end);
    } else {
      premiumExpiresAt.setDate(premiumExpiresAt.getDate() + 30); // Default 30 days
    }

    // Update user profile to grant premium access
    const { error: profileError } = await supabaseClient
      .from("profiles")
      .update({
        is_premium: subscription.status === 'active',
        premium_expires_at: premiumExpiresAt.toISOString()
      })
      .eq("user_id", userData.user.id);

    if (profileError) {
      console.error('Profile update error:', profileError);
      throw new Error(`Failed to update profile: ${profileError.message}`);
    }

    console.log('Premium access updated successfully', {
      userId: userData.user.id,
      isPremium: subscription.status === 'active',
      expiresAt: premiumExpiresAt.toISOString()
    });

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Subscription verified and premium access updated",
      subscription: subscription,
      premium_expires_at: premiumExpiresAt.toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error in verify-polar-subscription:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: "Check function logs for more information"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});