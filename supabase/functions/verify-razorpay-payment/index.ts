import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple HMAC-SHA256 implementation for Razorpay signature verification
async function hmacSha256(key: string, data: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyBuffer = encoder.encode(key);
  const dataBuffer = encoder.encode(data);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, dataBuffer);
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function verifySignature(orderId: string, paymentId: string, signature: string, secret: string): Promise<boolean> {
  const body = orderId + "|" + paymentId;
  return hmacSha256(secret, body).then(expectedSignature => {
    console.log('Signature verification:', {
      expected: expectedSignature,
      received: signature,
      matches: expectedSignature === signature
    });
    return expectedSignature === signature;
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Payment verification request received');
    
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
    
    console.log('Payment data:', {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signaturePresent: !!razorpay_signature
    });

    const razorpaySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!razorpaySecret) {
      console.error('Razorpay secret not configured');
      throw new Error("Razorpay secret not configured");
    }

    // Verify signature
    const isValidSignature = await verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      razorpaySecret
    );

    if (!isValidSignature) {
      console.error('Invalid payment signature');
      throw new Error("Invalid payment signature");
    }

    console.log('Payment signature verified successfully');

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
        razorpay_payment_id: razorpay_payment_id,
        status: "completed"
      })
      .eq("razorpay_order_id", razorpay_order_id)
      .eq("user_id", userData.user.id);

    if (subscriptionError) {
      console.error('Subscription update error:', subscriptionError);
      throw new Error(`Failed to update subscription: ${subscriptionError.message}`);
    }

    console.log('Subscription updated successfully');

    // Calculate premium expiry date (30 days from now)
    const premiumExpiresAt = new Date();
    premiumExpiresAt.setDate(premiumExpiresAt.getDate() + 30);

    // Update user profile to grant premium access
    const { error: profileError } = await supabaseClient
      .from("profiles")
      .update({
        is_premium: true,
        premium_expires_at: premiumExpiresAt.toISOString()
      })
      .eq("user_id", userData.user.id);

    if (profileError) {
      console.error('Profile update error:', profileError);
      throw new Error(`Failed to update profile: ${profileError.message}`);
    }

    console.log('Premium access granted successfully', {
      userId: userData.user.id,
      expiresAt: premiumExpiresAt.toISOString()
    });

    // Verify the update was successful
    const { data: updatedProfile, error: fetchError } = await supabaseClient
      .from("profiles")
      .select("is_premium, premium_expires_at")
      .eq("user_id", userData.user.id)
      .single();

    if (fetchError) {
      console.error('Failed to fetch updated profile:', fetchError);
    } else {
      console.log('Updated profile verification:', updatedProfile);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Payment verified and premium access granted",
      premium_expires_at: premiumExpiresAt.toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error in verify-razorpay-payment:", error);
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