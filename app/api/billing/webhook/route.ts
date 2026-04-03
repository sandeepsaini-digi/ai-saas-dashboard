import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Subscription } from '@/models/Subscription';

export const runtime = 'nodejs';

const PLAN_LIMITS = {
  free: { aiQueries: 50, members: 1, retention: 30 },
  pro: { aiQueries: 1000, members: 10, retention: 365 },
  enterprise: { aiQueries: Infinity, members: Infinity, retention: Infinity },
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  await connectDB();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan as keyof typeof PLAN_LIMITS;

      if (!userId || !plan) break;

      await Subscription.findOneAndUpdate(
        { userId },
        {
          stripeCustomerId: session.customer,
          stripeSubscriptionId: session.subscription,
          tier: plan,
          status: 'active',
          limits: PLAN_LIMITS[plan],
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        { upsert: true, new: true }
      );

      await User.findByIdAndUpdate(userId, { plan, stripeCustomerId: session.customer });
      console.log(`[Billing] User ${userId} upgraded to ${plan}`);
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const status = subscription.status;
      await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: subscription.id },
        { status, currentPeriodEnd: new Date(subscription.current_period_end * 1000) }
      );
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: subscription.id },
        { tier: 'free', status: 'canceled', limits: PLAN_LIMITS.free }
      );
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      console.warn(`[Billing] Payment failed for customer: ${invoice.customer}`);
      // TODO: Send dunning email via Resend/SendGrid
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
