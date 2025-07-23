
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
    const { amount, currency = 'INR' } = await req.json();
    
    console.log('Received request:', { amount, currency });
    
    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    
    console.log('Environment check:', {
      hasKeyId: !!razorpayKeyId,
      hasKeySecret: !!razorpayKeySecret,
      keyIdPrefix: razorpayKeyId ? razorpayKeyId.substring(0, 8) + '...' : 'not found'
    });
    
    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error('Razorpay credentials not configured');
      console.error('RAZORPAY_KEY_ID:', razorpayKeyId ? 'present' : 'missing');
      console.error('RAZORPAY_KEY_SECRET:', razorpayKeySecret ? 'present' : 'missing');
      throw new Error("Razorpay credentials not configured");
    }

    console.log('Razorpay credentials found');

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

    // Validate amount
    if (!amount || amount <= 0) {
      throw new Error("Invalid amount provided");
    }

    // Convert amount to smallest currency unit
    // For INR and most currencies: multiply by 100 (paise, cents, etc.)
    // For JPY and KRW: no multiplication needed as they don't have smaller units
    const zeroDecimalCurrencies = ['JPY', 'KRW', 'VND', 'CLP'];
    const multiplier = zeroDecimalCurrencies.includes(currency.toUpperCase()) ? 1 : 100;
    
    // Ensure we're working with the correct amount format
    let processedAmount = amount;
    if (currency === 'INR' && amount < 100) {
      // If amount is less than 100 INR, assume it's in dollars and convert
      processedAmount = amount * 83; // Approximate USD to INR conversion
    }
    
    const razorpayAmount = Math.round(processedAmount * multiplier);

    console.log('Amount calculation:', { originalAmount: amount, multiplier, razorpayAmount });

    // Create Razorpay order
    const orderData = {
      amount: razorpayAmount,
      currency: currency.toUpperCase(),
      receipt: `receipt_${Date.now()}_${userData.user.id.slice(-8)}`,
      notes: {
        user_id: userData.user.id,
        email: userData.user.email
      }
    };

    console.log('Creating Razorpay order:', orderData);

    const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    const order = await response.json();
    console.log('Razorpay API response:', { status: response.status, order });

    if (!response.ok) {
      console.error('Razorpay API error:', order);
      throw new Error(order.error?.description || `Razorpay API error: ${response.status}`);
    }

    console.log('Order created successfully:', order.id);

    // Store subscription record
    const subscriptionData = {
      user_id: userData.user.id,
      razorpay_order_id: order.id,
      amount: razorpayAmount, // Store in smallest currency unit (cents/paise)
      currency: currency.toUpperCase(),
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
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: razorpayKeyId,
    };

    console.log('Sending response:', responseData);

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in create-razorpay-order:", error);
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
