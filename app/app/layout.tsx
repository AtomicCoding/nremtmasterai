import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { requirePaidUser } from "@/lib/auth/subscription";
import { LogoutButton } from "@/components/logout-button";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const result = await requirePaidUser();
  if (!result.ok && result.reason === "unauthenticated") redirect("/login");
  if (!result.ok && result.reason === "unpaid") redirect("/pricing");

  return (
    <>
      <div className="card">
        <h2>Paid App Area</h2>
        <LogoutButton />
      </div>
      {children}
    </>
  );
}
