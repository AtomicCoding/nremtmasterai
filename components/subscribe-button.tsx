"use client";

import { useState } from "react";

export function SubscribeButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function startCheckout() {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch("/api/stripe/create-checkout-session", { method: "POST" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Could not create session");
      }
      window.location.href = data.url;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unknown error");
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={startCheckout} disabled={loading}>{loading ? "Redirecting..." : "Subscribe"}</button>
      {message ? <p className="small">{message}</p> : null}
    </div>
  );
}
