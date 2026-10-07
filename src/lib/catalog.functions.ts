import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

const cols = "id, handle, title, tagline, description, sku, price, image_url, specs, sort_order, is_active";

export const getCatalog = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const [p, s] = await Promise.all([
    sb.from("products").select(cols).eq("is_active", true).order("sort_order"),
    sb.from("site_settings").select("phone1, phone2").eq("id", 1).maybeSingle(),
  ]);
  if (p.error) console.error(p.error);
  return {
    products: (p.data ?? []).map((r) => ({ ...r, specs: (r.specs ?? []) as { label: string; value: string }[] })),
    settings: s.data ?? { phone1: "", phone2: "" },
  };
});
