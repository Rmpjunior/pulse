import { auth } from '@/lib/auth';
import { getStripePriceId, getStripeServerClient } from '@/lib/billing/stripe';
import {
  internalServerError,
  unauthorized,
  badRequest,
} from '@/lib/api/errors';

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id || !session.user.email) {
      return unauthorized();
    }

    const stripe = getStripeServerClient();
    const priceId = getStripePriceId();

    if (!stripe || !priceId) {
      return badRequest('Stripe is not configured yet');
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const checkout = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: session.user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/dashboard/settings?billing=success`,
      cancel_url: `${baseUrl}/dashboard/settings?billing=cancelled`,
      metadata: {
        userId: session.user.id,
      },
    });

    return Response.json({
      checkoutUrl: checkout.url,
      id: checkout.id,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return internalServerError();
  }
}
