import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Sparkles, Sun } from "lucide-react";
import { products } from "@/lib/products";

export const Route = createFileRoute("/product/$handle")({
  loader: ({ params }) => {
    const product = products.find((p) => p.handle === params.handle);
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "منتج"} — LaAvor PPF` },
      { name: "description", content: loaderData?.tagline ?? "" },
      { property: "og:title", content: `${loaderData?.title ?? "منتج"} — LaAvor PPF` },
      { property: "og:description", content: loaderData?.tagline ?? "" },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const product = Route.useLoaderData();

  return (
    <div dir="rtl" className="relative min-h-screen overflow-hidden bg-background text-foreground antialiased">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-aurora" />

      <header className="relative z-10 mx-auto flex max-w-[1280px] items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-primary/20 text-lg font-black tracking-tight ring-1 ring-foreground/15">
            LA
          </span>
          <span className="text-xl font-black tracking-tight">LaAvor</span>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-foreground/5 px-5 py-2.5 text-sm font-bold text-foreground/80 transition-colors hover:bg-foreground/10"
        >
          <ArrowRight className="size-4" />
          عودة للمتجر
        </Link>
      </header>

      <main className="relative z-10 mx-auto grid max-w-[1280px] gap-5 px-6 pb-16 pt-4 lg:grid-cols-2">
        <div className="glass-card p-5">
          <img
            src={product.image}
            alt={product.title}
            width={976}
            height={688}
            className="w-full rounded-2xl border border-foreground/10 object-cover"
          />
        </div>

        <div className="glass-card p-8 md:p-10">
          <span className="inline-block rounded-full bg-foreground/5 px-4 py-1.5 font-mono text-[11px] tracking-wider text-accent">
            {product.sku}
          </span>
          <h1 className="mt-5 text-3xl font-black tracking-tight md:text-5xl">{product.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {product.specs.map((s) => (
              <div key={s.label} className="rounded-2xl border border-foreground/10 bg-foreground/5 p-4">
                <div className="text-xs text-muted-foreground">{s.label}</div>
                <div className="mt-1 font-mono text-lg font-bold text-accent">{s.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-foreground/10 pt-6">
            <div>
              <div className="text-xs text-muted-foreground">السعر</div>
              <div className="font-mono text-3xl font-bold text-accent">{product.price}</div>
            </div>
            <a
              href="https://wa.me/9647000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground ring-1 ring-foreground/20 transition-transform hover:scale-[1.03]"
            >
              اطلب الآن عبر واتساب
            </a>
          </div>
        </div>
      </main>

      <section className="relative z-10 mx-auto grid max-w-[1280px] gap-5 px-6 pb-16 md:grid-cols-3">
        <div className="glass-card flex items-start gap-4 p-6">
          <Sparkles className="mt-1 size-6 shrink-0 text-accent" />
          <div>
            <h3 className="font-bold">استشفاء ذاتي</h3>
            <p className="mt-1 text-sm text-muted-foreground">الخدوش الدقيقة تختفي بالحرارة تلقائياً.</p>
          </div>
        </div>
        <div className="glass-card flex items-start gap-4 p-6">
          <Sun className="mt-1 size-6 shrink-0 text-accent" />
          <div>
            <h3 className="font-bold">مقاومة UV</h3>
            <p className="mt-1 text-sm text-muted-foreground">حماية من الاصفرار والعوامل الجوية.</p>
          </div>
        </div>
        <div className="glass-card flex items-start gap-4 p-6">
          <ShieldCheck className="mt-1 size-6 shrink-0 text-accent" />
          <div>
            <h3 className="font-bold">ضمان معتمد</h3>
            <p className="mt-1 text-sm text-muted-foreground">ضمان رسمي ضد الاصفرار والتقشير.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
