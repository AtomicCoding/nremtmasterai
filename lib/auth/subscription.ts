import { createClient } from "@/lib/supabase/server";

const paidStatuses = new Set(["active", "trialing"]);

export async function getCurrentUser() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function hasActiveSubscription(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("status,current_period_end")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return false;
  return paidStatuses.has(data.status);
}

export async function requirePaidUser() {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false as const, reason: "unauthenticated" as const };
  }

  const isPaid = await hasActiveSubscription(user.id);
  if (!isPaid) {
    return { ok: false as const, reason: "unpaid" as const, user };
  }

  return { ok: true as const, user };
}
