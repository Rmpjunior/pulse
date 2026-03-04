import Stripe from 'stripe';
import { headers } from 'next/headers';
import { db } from '@/lib/db';
import { getStripeServerClient } from '@/lib/billing/stripe';
import { internalServerError, badRequest } from '@/lib/api/errors';

export async function POST(request: Request) {
  try {
    const stripe = getStripeServerClient();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripe || !webhookSecret) {
      return badRequest('Stripe webhook not configured yet');
    }

    const body = await request.text();
    const signature = (await headers()).get('stripe-signature');

    if (!signature) {
      return badRequest('Missing Stripe signature');
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error) {
      console.error('Invalid Stripe signature:', error);
      return badRequest('Invalid Stripe signature');
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const checkout = event.data.object as Stripe.Checkout.Session;
        const userId = checkout.metadata?.userId;

        if (!userId) break;

        await db.subscription.updateMany({
          where: { userId },
          data: {
            plan: 'PLUS_MONTHLY',
            status: 'ACTIVE',
            stripeCustomerId: checkout.customer?.toString(),
            stripeSubscriptionId: checkout.subscription?.toString(),
          },
        });
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        await db.subscription.updateMany({
          where: {
            stripeSubscriptionId: subscription.id,
          },
          data: {
            plan: 'FREE',
            status: 'CANCELED',
          },
        });
        break;
      }
      default:
        break;
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Error processing Stripe webhook:', error);
    return internalServerError();
  }
}
