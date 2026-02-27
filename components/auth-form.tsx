"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage(null);

    const action = mode === "signup" ? supabase.auth.signUp : supabase.auth.signInWithPassword;
    const { error } = await action({ email, password });

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push(mode === "signup" ? "/pricing" : "/app/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h1>{mode === "signup" ? "Create account" : "Login"}</h1>
      <label>
        Email
        <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label>
        Password
        <input type="password" required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} />
      </label>
      <button type="submit">{mode === "signup" ? "Sign up" : "Login"}</button>
      {message ? <p className="small">{message}</p> : null}
    </form>
  );
}
