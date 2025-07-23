import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const useRazorpay = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createOrder = async (amount: number, currency: string = 'INR') => {
    if (!user) {
      throw new Error('User must be logged in');
    }

    const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
      body: { amount, currency }
    });

    if (error) {
      throw error;
    }

    return data;
  };

  const verifyPayment = async (paymentData: any) => {
    const { data, error } = await supabase.functions.invoke('verify-razorpay-payment', {
      body: paymentData
    });

    if (error) {
      throw error;
    }

    return data;
  };

  const openCheckout = async (amount: number, currency: string = 'INR', onSuccess?: () => void, onFailure?: (error: string) => void) => {
    try {
      setLoading(true);
      
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay script');
      }

      const orderData = await createOrder(amount, currency);

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'ToolHub Premium',
        description: 'Premium Subscription',
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            console.log('Payment response:', response);
            const verifyResult = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            console.log('Payment verification result:', verifyResult);
            
            toast.success('Payment successful! Premium access activated.');
            
            // Force page reload to refresh auth context
            setTimeout(() => {
              window.location.reload();
            }, 1000);
            
            onSuccess?.();
          } catch (error) {
            console.error('Payment verification failed:', error);
            toast.error('Payment verification failed. Please contact support.');
            onFailure?.(error.message || 'Payment verification failed');
          }
        },
        prefill: {
          email: user?.email,
        },
        theme: {
          color: '#3b82f6',
        },
        modal: {
          ondismiss: () => {
            onFailure?.('Payment cancelled');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to open checkout. Please try again.');
      onFailure?.(error.message || 'Failed to open checkout');
    } finally {
      setLoading(false);
    }
  };

  return {
    openCheckout,
    loading,
  };
};