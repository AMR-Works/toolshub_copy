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
    const { priceId, successUrl, cancelUrl, customerEmail } = await req.json();
    
    console.log('Received checkout request:', { priceId, successUrl, cancelUrl, customerEmail });
    
    const polarAccessToken = Deno.env.get("POLAR_ACCESS_TOKEN");
    
    if (!polarAccessToken) {
      console.error('Polar access token not configured');
      throw new Error("Polar access token not configured");
    }

    console.log('Polar credentials found');

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization")!;
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

    // Create Polar checkout session
    const checkoutData = {
      price_id: priceId,
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      metadata: {
        user_id: userData.user.id,
        email: userData.user.email
      }
    };

    console.log('Creating Polar checkout session:', checkoutData);

    const response = await fetch("https://api.polar.sh/v1/checkouts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${polarAccessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(checkoutData),
    });

    const checkout = await response.json();
    console.log('Polar API response:', { status: response.status, checkout });

    if (!response.ok) {
      console.error('Polar API error:', checkout);
      throw new Error(checkout.error?.message || `Polar API error: ${response.status}`);
    }

    console.log('Checkout session created successfully:', checkout.id);

    // Store subscription record
    const subscriptionData = {
      user_id: userData.user.id,
      polar_checkout_id: checkout.id,
      amount: 0, // Will be updated when webhook is received
      currency: 'USD', // Default, will be updated from webhook
      status: "pending",
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    };

    console.log('Storing subscription:', subscriptionData);

    const { error: insertError } = await supabaseClient
      .from("subscriptions")
      .insert(subscriptionData);

    if (insertError) {
      console.error('Subscription insert error:', insertError);
      throw new Error(`Failed to store subscription: ${insertError.message}`);
    }

    console.log('Subscription stored successfully');

    const responseData = {
      checkoutUrl: checkout.url,
      checkoutId: checkout.id,
    };

    console.log('Sending response:', responseData);

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in create-polar-checkout:", error);
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