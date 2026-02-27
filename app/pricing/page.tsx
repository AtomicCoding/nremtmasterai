import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasActiveSubscription } from "@/lib/auth/subscription";
import { SubscribeButton } from "@/components/subscribe-button";

export default async function PricingPage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const paid = await hasActiveSubscription(user.id);
  if (paid) redirect("/app/dashboard");

  return (
    <div className="card">
      <h1>Pricing</h1>
      <p>$29/month for full access to drills, dashboard, and history.</p>
      <SubscribeButton />
    </div>
  );
}
