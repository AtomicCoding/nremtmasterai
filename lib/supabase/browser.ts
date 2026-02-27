"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getPublicEnv } from "./env";

export function createClient() {
  const { url, anonKey } = getPublicEnv();
  return createBrowserClient(url, anonKey);
}
