import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, polar-webhook-signature",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Polar webhook received');
    
    const body = await req.text();
    const signature = req.headers.get("polar-webhook-signature");
    
    console.log('Webhook data:', { 
      hasSignature: !!signature,
      bodyLength: body.length 
    });

    const webhookSecret = Deno.env.get("POLAR_WEBHOOK_SECRET");
    if (!webhookSecret) {
      console.error('Polar webhook secret not configured');
      throw new Error("Polar webhook secret not configured");
    }

    // Verify webhook signature
    if (signature) {
      const expectedSignature = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(webhookSecret + body)
      );
      const expectedHex = Array.from(new Uint8Array(expectedSignature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      
      if (signature !== expectedHex) {
        console.error('Invalid webhook signature');
        throw new Error("Invalid webhook signature");
      }
    }

    const event = JSON.parse(body);
    console.log('Webhook event:', event.type, event.data?.id);

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Handle different webhook events
    switch (event.type) {
      case 'subscription.created':
      case 'subscription.updated':
        await handleSubscriptionEvent(supabaseClient, event.data);
        break;
      case 'subscription.cancelled':
        await handleSubscriptionCancellation(supabaseClient, event.data);
        break;
      case 'checkout.completed':
        await handleCheckoutCompleted(supabaseClient, event.data);
        break;
      default:
        console.log('Unhandled webhook event type:', event.type);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error in polar-webhook:", error);
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

async function handleSubscriptionEvent(supabaseClient: any, subscription: any) {
  console.log('Handling subscription event:', subscription.id);
  
  const userId = subscription.metadata?.user_id;
  if (!userId) {
    console.error('No user_id in subscription metadata');
    return;
  }

  // Update subscription record
  const { error: subscriptionError } = await supabaseClient
    .from("subscriptions")
    .upsert({
      user_id: userId,
      polar_subscription_id: subscription.id,
      amount: subscription.price?.amount || 0,
      currency: subscription.price?.currency || 'USD',
      status: subscription.status,
      expires_at: subscription.current_period_end ? new Date(subscription.current_period_end).toISOString() : null,
    });

  if (subscriptionError) {
    console.error('Subscription update error:', subscriptionError);
    throw new Error(`Failed to update subscription: ${subscriptionError.message}`);
  }

  // Update user profile
  const isPremium = subscription.status === 'active';
  const expiresAt = subscription.current_period_end ? new Date(subscription.current_period_end) : null;

  const { error: profileError } = await supabaseClient
    .from("profiles")
    .update({
      is_premium: isPremium,
      premium_expires_at: expiresAt?.toISOString() || null
    })
    .eq("user_id", userId);

  if (profileError) {
    console.error('Profile update error:', profileError);
    throw new Error(`Failed to update profile: ${profileError.message}`);
  }

  console.log('Subscription and profile updated successfully');
}

async function handleSubscriptionCancellation(supabaseClient: any, subscription: any) {
  console.log('Handling subscription cancellation:', subscription.id);
  
  const userId = subscription.metadata?.user_id;
  if (!userId) {
    console.error('No user_id in subscription metadata');
    return;
  }

  // Update subscription status
  const { error: subscriptionError } = await supabaseClient
    .from("subscriptions")
    .update({
      status: 'cancelled'
    })
    .eq("polar_subscription_id", subscription.id);

  if (subscriptionError) {
    console.error('Subscription cancellation error:', subscriptionError);
    throw new Error(`Failed to cancel subscription: ${subscriptionError.message}`);
  }

  // Update user profile to remove premium access
  const { error: profileError } = await supabaseClient
    .from("profiles")
    .update({
      is_premium: false,
      premium_expires_at: null
    })
    .eq("user_id", userId);

  if (profileError) {
    console.error('Profile update error:', profileError);
    throw new Error(`Failed to update profile: ${profileError.message}`);
  }

  console.log('Subscription cancelled and premium access removed');
}

async function handleCheckoutCompleted(supabaseClient: any, checkout: any) {
  console.log('Handling checkout completion:', checkout.id);
  
  const userId = checkout.metadata?.user_id;
  if (!userId) {
    console.error('No user_id in checkout metadata');
    return;
  }

  // Update subscription record with checkout completion
  const { error: subscriptionError } = await supabaseClient
    .from("subscriptions")
    .update({
      status: 'completed'
    })
    .eq("polar_checkout_id", checkout.id);

  if (subscriptionError) {
    console.error('Subscription update error:', subscriptionError);
    throw new Error(`Failed to update subscription: ${subscriptionError.message}`);
  }

  console.log('Checkout completion processed successfully');
}