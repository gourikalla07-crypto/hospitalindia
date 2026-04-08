import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // During build or if env is missing, we return a mock/client that doesn't crash
    // but this shouldn't happen if Netlify is configured correctly.
    console.warn("Supabase credentials missing. Client might fail at runtime.");
    return createBrowserClient("https://placeholder.supabase.co", "placeholder-key");
  }

  return createBrowserClient(url, key);
}
