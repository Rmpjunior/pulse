import Stripe from 'stripe';

let cached: Stripe | null = null;

export function getStripeServerClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return null;
  }

  if (!cached) {
    cached = new Stripe(secretKey, {
      apiVersion: '2025-08-27.basil',
    });
  }

  return cached;
}

export function getStripePriceId() {
  return process.env.STRIPE_PRICE_PLUS_MONTHLY || null;
}
