import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const usePolar = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const createCheckoutSession = async (priceId: string, successUrl?: string, cancelUrl?: string) => {
    if (!user) {
      throw new Error('User must be logged in');
    }

    const { data, error } = await supabase.functions.invoke('create-polar-checkout', {
      body: { 
        priceId,
        successUrl: successUrl || `${window.location.origin}/profile?success=true`,
        cancelUrl: cancelUrl || `${window.location.origin}/pricing?canceled=true`,
        customerEmail: user.email
      }
    });

    if (error) {
      throw error;
    }

    return data;
  };

  const openCheckout = async (
    priceId: string, 
    onSuccess?: () => void, 
    onFailure?: (error: string) => void,
    successUrl?: string,
    cancelUrl?: string
  ) => {
    try {
      setLoading(true);
      
      const checkoutData = await createCheckoutSession(priceId, successUrl, cancelUrl);
      
      if (checkoutData.checkoutUrl) {
        // Redirect to Polar checkout
        window.location.href = checkoutData.checkoutUrl;
      } else {
        throw new Error('No checkout URL received');
      }
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to open checkout. Please try again.');
      onFailure?.(error.message || 'Failed to open checkout');
    } finally {
      setLoading(false);
    }
  };

  const verifySubscription = async (subscriptionId: string) => {
    const { data, error } = await supabase.functions.invoke('verify-polar-subscription', {
      body: { subscriptionId }
    });

    if (error) {
      throw error;
    }

    return data;
  };

  return {
    openCheckout,
    createCheckoutSession,
    verifySubscription,
    loading,
  };
};