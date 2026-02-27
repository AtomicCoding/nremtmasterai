import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

function toIsoDateFromUnix(unixSeconds?: number | null) {
  return unixSeconds ? new Date(unixSeconds * 1000).toISOString() : null;
}

async function upsertSubscription(args: {
  userId: string;
  stripeCustomerId?: string | null;
  stripeSubscriptionId: string;
  status: string;
  currentPeriodEnd?: number | null;
}) {
  const admin = createAdminClient();
  await admin.from("subscriptions").upsert(
    {
      user_id: args.userId,
      stripe_customer_id: args.stripeCustomerId ?? null,
      stripe_subscription_id: args.stripeSubscriptionId,
      status: args.status,
      current_period_end: toIsoDateFromUnix(args.currentPeriodEnd)
    },
    { onConflict: "stripe_subscription_id" }
  );
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing webhook signature or secret" }, { status: 400 });
  }

  const body = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid signature" },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;
    if (userId && typeof session.subscription === "string") {
      const subscription = await stripe.subscriptions.retrieve(session.subscription);
      await upsertSubscription({
        userId,
        stripeCustomerId: String(session.customer),
        stripeSubscriptionId: subscription.id,
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end
      });
    }
  }

  if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    const userId = subscription.metadata?.user_id;

    let resolvedUserId = userId;
    if (!resolvedUserId) {
      const { data } = await admin
        .from("subscriptions")
        .select("user_id")
        .eq("stripe_subscription_id", subscription.id)
        .maybeSingle();
      resolvedUserId = data?.user_id;
    }

    if (resolvedUserId) {
      await upsertSubscription({
        userId: resolvedUserId,
        stripeCustomerId: String(subscription.customer),
        stripeSubscriptionId: subscription.id,
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end
      });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    await admin
      .from("subscriptions")
      .update({ status: "canceled", current_period_end: toIsoDateFromUnix(subscription.current_period_end) })
      .eq("stripe_subscription_id", subscription.id);
  }

  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice;
    const subId = typeof invoice.subscription === "string" ? invoice.subscription : null;
    if (subId) {
      await admin
        .from("subscriptions")
        .update({ status: "past_due" })
        .eq("stripe_subscription_id", subId);
    }
  }

  return NextResponse.json({ received: true });
}
