import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, getStripePriceId } from "@/lib/stripe/client";

export async function POST() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: user.email,
    line_items: [{ price: getStripePriceId(), quantity: 1 }],
    success_url: `${baseUrl}/app/dashboard?checkout=success`,
    cancel_url: `${baseUrl}/pricing?checkout=cancel`,
    metadata: {
      user_id: user.id
    }
  });

  return NextResponse.json({ url: session.url });
}
