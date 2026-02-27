import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getCurrentUser } from "@/lib/auth/subscription";

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) redirect("/app/dashboard");
  return <AuthForm mode="signup" />;
}
