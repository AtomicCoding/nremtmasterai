import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getPublicEnv, getServiceRoleKey } from "./env";

type CookieOptions = {
  domain?: string;
  expires?: Date;
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: "lax" | "none" | "strict";
  secure?: boolean;
};

export function createClient() {
  const cookieStore = cookies();
  const { url, anonKey } = getPublicEnv();

  return createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.set({ name, value: "", ...options });
      }
    }
  });
}

export function createAdminClient() {
  const { url } = getPublicEnv();
  return createSupabaseClient(url, getServiceRoleKey(), {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}
