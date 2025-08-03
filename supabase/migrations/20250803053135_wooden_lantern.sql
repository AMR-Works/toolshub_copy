/*
  # Update subscriptions table for Polar.sh integration

  1. Changes
    - Remove Razorpay-specific columns
    - Add Polar.sh-specific columns
    - Update existing data structure

  2. New Columns
    - `polar_checkout_id` (text) - Polar checkout session ID
    - `polar_subscription_id` (text) - Polar subscription ID

  3. Removed Columns
    - `razorpay_payment_id`
    - `razorpay_order_id` 
    - `razorpay_subscription_id`
*/

-- Add new Polar.sh columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'polar_checkout_id'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN polar_checkout_id text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'polar_subscription_id'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN polar_subscription_id text;
  END IF;
END $$;

-- Remove Razorpay columns if they exist
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'razorpay_payment_id'
  ) THEN
    ALTER TABLE subscriptions DROP COLUMN razorpay_payment_id;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'razorpay_order_id'
  ) THEN
    ALTER TABLE subscriptions DROP COLUMN razorpay_order_id;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'razorpay_subscription_id'
  ) THEN
    ALTER TABLE subscriptions DROP COLUMN razorpay_subscription_id;
  END IF;
END $$;