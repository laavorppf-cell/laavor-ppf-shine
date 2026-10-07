import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Spec } from "@/lib/products";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "لوحة التحكم — LaAvor" },
      { name: "description", content: "لوحة تحكم LaAvor لإدارة المنتجات والأسعار وأرقام التواصل." },
      { property: "og:title", content: "لوحة التحكم — LaAvor" },
      { property: "og:description", content: "إدارة منتجات وأسعار LaAvor." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const phoneToEmail = (phone: string) => `${phone.replace(/\D/g, "")}@laavor.app`;

type Row = {
  id?: string;
  handle: string;
  title: string;
  tagline: string;
  description: string;
  sku: string;
  price: string;
  image_url: string;
  specs: Spec[];
  sort_order: number;
  is_active: boolean;
};

const empty = (): Row => ({
  handle: "",
  title: "",
  tagline: "",
  description: "",
  sku: "",
  price: "",
  image_url: "",
  specs: [
    { label: "السماكة", value: "" },
    { label: "العرض", value: "1.52m" },
    { label: "الطول", value: "15m" },
    { label: "الضمان", value: "" },
  ],
  sort_order: 0,
  is_active: true,
});

const input =
  "w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm outline-none focus:border-primary";
const btn =
  "rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground ring-1 ring-foreground/20 disabled:opacity-50";
const btnGhost =
  "rounded-full border border-foreground/15 bg-foreground/5 px-5 py-2.5 text-sm font-bold text-foreground/80 hover:bg-foreground/10";

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  if (!ready) return <Shell><p className="text-muted-foreground">جارٍ التحميل…</p></Shell>;
  return <Shell>{session ? <Dashboard /> : <Login />}</Shell>;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div dir="rtl" className="relative min-h-screen bg-background text-foreground antialiased">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-aurora" />
      <div className="relative z-10 mx-auto max-w-[1100px] px-6 py-8">{children}</div>
    </div>
  );
}

function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email: phoneToEmail(phone), password });
    if (error) setError("رقم الهاتف أو كلمة المرور غير صحيحة");
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="glass-card mx-auto mt-16 max-w-md space-y-4 p-8">
      <h1 className="text-2xl font-black">دخول لوحة التحكم</h1>
      <p className="text-sm text-muted-foreground">LaAvor · إدارة المنتجات</p>
      <input className={input} dir="ltr" inputMode="tel" placeholder="07xxxxxxxxx" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      <input className={input} dir="ltr" type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} required />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <button className={`${btn} w-full`} disabled={busy}>{busy ? "…" : "دخول"}</button>
      <Link to="/" className="block text-center text-sm text-muted-foreground">العودة للموقع</Link>
    </form>
  );
}

function Dashboard() {
  const qc = useQueryClient();
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Row | null>(null);
  const [phones, setPhones] = useState({ phone1: "", phone2: "" });
  const [msg, setMsg] = useState("");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [pwd, setPwd] = useState("");

  async function load() {
    const [p, s, u] = await Promise.all([
      supabase.from("products").select("*").order("sort_order"),
      supabase.from("site_settings").select("phone1, phone2").eq("id", 1).maybeSingle(),
      supabase.auth.getUser(),
    ]);
    setRows((p.data ?? []).map((r) => ({ ...r, specs: (r.specs ?? []) as unknown as Spec[] })));
    if (s.data) setPhones(s.data);
    if (u.data.user) {
      const { data } = await supabase.rpc("has_role", { _user_id: u.data.user.id, _role: "admin" });
      setIsAdmin(!!data);
    }
  }
  useEffect(() => { load(); }, []);

  function flash(t: string) {
    setMsg(t);
    setTimeout(() => setMsg(""), 3000);
    qc.invalidateQueries({ queryKey: ["catalog"] });
  }

  async function savePhones() {
    const { error } = await supabase.from("site_settings").update({ ...phones, updated_at: new Date().toISOString() }).eq("id", 1);
    flash(error ? "تعذّر الحفظ" : "تم حفظ الأرقام");
  }

  async function remove(id?: string) {
    if (!id || !confirm("حذف هذا المنتج نهائياً؟")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    flash(error ? "تعذّر الحذف" : "تم الحذف");
    load();
  }

  async function changePassword() {
    if (pwd.length < 6) return flash("كلمة المرور 6 أحرف على الأقل");
    const { error } = await supabase.auth.updateUser({ password: pwd });
    setPwd("");
    flash(error ? "تعذّر تغيير كلمة المرور" : "تم تغيير كلمة المرور");
  }

  if (isAdmin === false)
    return (
      <div className="glass-card p-8">
        <p>هذا الحساب لا يملك صلاحية الإدارة.</p>
        <button className={`${btnGhost} mt-4`} onClick={() => supabase.auth.signOut()}>خروج</button>
      </div>
    );

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-black">لوحة تحكم LaAvor</h1>
        <div className="flex gap-2">
          <Link to="/" className={btnGhost}>عرض الموقع</Link>
          <button className={btnGhost} onClick={() => supabase.auth.signOut()}>خروج</button>
        </div>
      </header>
      {msg && <div className="glass-card p-3 text-center text-sm font-bold text-accent">{msg}</div>}

      {editing ? (
        <Editor row={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); flash("تم حفظ المنتج"); load(); }} />
      ) : (
        <section className="glass-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">المنتجات ({rows.length})</h2>
            <button className={btn} onClick={() => setEditing({ ...empty(), sort_order: rows.length + 1 })}>+ إضافة منتج</button>
          </div>
          <div className="space-y-3">
            {rows.map((r) => (
              <div key={r.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-foreground/10 bg-foreground/5 p-3">
                {r.image_url && <img src={r.image_url} alt={r.title} className="h-14 w-20 rounded-lg object-cover" />}
                <div className="min-w-0 flex-1">
                  <div className="font-bold">{r.title} {!r.is_active && <span className="text-xs text-muted-foreground">(مخفي)</span>}</div>
                  <div className="font-mono text-sm text-accent">{r.price}</div>
                </div>
                <button className={btnGhost} onClick={() => setEditing(r)}>تعديل</button>
                <button className={btnGhost} onClick={() => remove(r.id)}>حذف</button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="grid gap-6 md:grid-cols-2">
        <div className="glass-card space-y-3 p-6">
          <h2 className="text-xl font-bold">أرقام واتساب</h2>
          <input className={input} dir="ltr" value={phones.phone1} onChange={(e) => setPhones({ ...phones, phone1: e.target.value })} placeholder="الرقم الأول" />
          <input className={input} dir="ltr" value={phones.phone2} onChange={(e) => setPhones({ ...phones, phone2: e.target.value })} placeholder="الرقم الثاني" />
          <button className={btn} onClick={savePhones}>حفظ الأرقام</button>
        </div>
        <div className="glass-card space-y-3 p-6">
          <h2 className="text-xl font-bold">تغيير كلمة المرور</h2>
          <input className={input} dir="ltr" type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="كلمة مرور جديدة" />
          <button className={btn} onClick={changePassword}>تغيير</button>
        </div>
      </section>
    </div>
  );
}

function Editor({ row, onClose, onSaved }: { row: Row; onClose: () => void; onSaved: () => void }) {
  const [r, setR] = useState<Row>(row);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set = <K extends keyof Row>(k: K, v: Row[K]) => setR((p) => ({ ...p, [k]: v }));

  async function upload(file: File) {
    setBusy(true);
    const path = `${Date.now()}-${file.name.replace(/[^\w.-]/g, "")}`;
    const up = await supabase.storage.from("product-images").upload(path, file);
    if (up.error) { setErr("فشل رفع الصورة"); setBusy(false); return; }
    const { data } = await supabase.storage.from("product-images").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
    if (data) set("image_url", data.signedUrl);
    setBusy(false);
  }

  async function save() {
    if (!r.title || !r.price) return setErr("الاسم والسعر مطلوبان");
    setBusy(true);
    const handle = r.handle || r.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `p-${Date.now()}`;
    const payload = { ...r, handle, specs: r.specs.filter((s) => s.label) as unknown as never };
    const res = r.id
      ? await supabase.from("products").update(payload).eq("id", r.id)
      : await supabase.from("products").insert(payload);
    setBusy(false);
    if (res.error) return setErr(res.error.message.includes("duplicate") ? "الرابط مستخدم مسبقاً" : "تعذّر الحفظ");
    onSaved();
  }

  return (
    <section className="glass-card space-y-4 p-6">
      <h2 className="text-xl font-bold">{r.id ? "تعديل منتج" : "منتج جديد"}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-sm">الاسم<input className={input} value={r.title} onChange={(e) => set("title", e.target.value)} /></label>
        <label className="space-y-1 text-sm">السعر<input className={input} value={r.price} onChange={(e) => set("price", e.target.value)} placeholder="325,000 د.ع" /></label>
        <label className="space-y-1 text-sm">رمز المنتج SKU<input className={input} dir="ltr" value={r.sku} onChange={(e) => set("sku", e.target.value)} /></label>
        <label className="space-y-1 text-sm">الترتيب<input className={input} type="number" value={r.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} /></label>
      </div>
      <label className="block space-y-1 text-sm">وصف قصير<input className={input} value={r.tagline} onChange={(e) => set("tagline", e.target.value)} /></label>
      <label className="block space-y-1 text-sm">الوصف الكامل<textarea className={`${input} min-h-28`} value={r.description} onChange={(e) => set("description", e.target.value)} /></label>

      <div className="space-y-2">
        <div className="text-sm">الصورة</div>
        <div className="flex flex-wrap items-center gap-4">
          {r.image_url && <img src={r.image_url} alt="" className="h-24 w-36 rounded-xl object-cover" />}
          <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} className="text-sm" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm">المواصفات</div>
        {r.specs.map((s, i) => (
          <div key={i} className="flex gap-2">
            <input className={input} value={s.label} placeholder="الخاصية" onChange={(e) => set("specs", r.specs.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
            <input className={input} value={s.value} placeholder="القيمة" onChange={(e) => set("specs", r.specs.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} />
            <button className={btnGhost} onClick={() => set("specs", r.specs.filter((_, j) => j !== i))}>×</button>
          </div>
        ))}
        <button className={btnGhost} onClick={() => set("specs", [...r.specs, { label: "", value: "" }])}>+ خاصية</button>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={r.is_active} onChange={(e) => set("is_active", e.target.checked)} /> ظاهر في الموقع
      </label>
      {err && <p className="text-sm text-destructive">{err}</p>}
      <div className="flex gap-2">
        <button className={btn} disabled={busy} onClick={save}>{busy ? "…" : "حفظ"}</button>
        <button className={btnGhost} onClick={onClose}>إلغاء</button>
      </div>
    </section>
  );
}
