import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import heroAsset from "@/assets/laavor-facebook-car.jpg.asset.json";
import ppfAsset from "@/assets/laavor-facebook-ppf.jpg.asset.json";
import { useSuspenseQuery } from "@tanstack/react-query";
import { catalogQuery, waLink } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LaAvor — بكرات حماية طلاء السيارات PPF" },
      {
        name: "description",
        content:
          "LaAvor — بكرات فيلم حماية طلاء PPF احترافية من TPU: لمعان فائق، استشفاء ذاتي، وضمان اصفرار لعشر سنوات.",
      },
      { property: "og:title", content: "LaAvor — بكرات حماية طلاء السيارات PPF" },
      {
        property: "og:description",
        content:
          "بكرات PPF احترافية من TPU عالي اللمعان، مصمّمة للصالونات المتخصصة وعشّاق السيارات.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQuery),
  component: Index,
});

function Index() {
  const { data } = useSuspenseQuery(catalogQuery);
  const { products, settings } = data;
  return (
    <div dir="rtl" className="relative min-h-screen overflow-hidden bg-background text-foreground antialiased">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-aurora" />

      {/* Header */}
      <header className="relative z-10 mx-auto flex max-w-[1280px] items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-primary/20 text-lg font-black tracking-tight ring-1 ring-foreground/15">
            LA
          </span>
          <span className="text-xl font-black tracking-tight">LaAvor</span>
        </div>
        <nav className="hidden items-center gap-8 text-sm font-semibold text-foreground/70 md:flex">
          <a href="#products" className="transition-colors hover:text-foreground">المنتجات</a>
          <a href="#features" className="transition-colors hover:text-foreground">المزايا</a>
          <a href="#contact" className="transition-colors hover:text-foreground">تواصل</a>
        </nav>
        <a
          href="#products"
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground ring-1 ring-foreground/20 transition-transform hover:scale-[1.03]"
        >
          تصفّح البكرات
        </a>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto grid max-w-[1280px] gap-5 px-6 pb-10 pt-6 lg:grid-cols-12">
        <div className="glass-card p-8 md:p-12 lg:col-span-8">
          <span className="inline-block rounded-full bg-foreground/5 px-4 py-1.5 font-mono text-[11px] tracking-wider text-accent">
            TPU SELF-HEALING · GLOSS
          </span>
          <h1 className="mt-6 text-4xl font-black leading-[1.15] tracking-tight md:text-6xl">
            طبقة حماية
            <br />
            تلتئم من خدوشها
            <br />
            وتحافظ على لمعان
            <br />
            الطلاء.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            بكرات PPF احترافية من TPU عالي اللمعان، مصمّمة لتركيبات الصالونات المتخصّصة وعشّاق
            السيارات. مرونة فائقة، شفافية كريستالية، واستشفاء ذاتي للحرارة.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#products"
              className="rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground ring-1 ring-foreground/20 transition-transform hover:scale-[1.03]"
            >
              تصفّح البكرات
            </a>
            <a
              href="#contact"
              className="rounded-full border border-foreground/15 bg-foreground/5 px-7 py-3.5 text-sm font-bold text-foreground/80 transition-colors hover:bg-foreground/10"
            >
              اطلب استشارة تركيب
            </a>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-foreground/10 pt-6">
            <div>
              <div className="font-mono text-2xl font-bold text-accent">+40</div>
              <div className="text-xs text-muted-foreground">موزّع معتمد</div>
            </div>
            <div>
              <div className="font-mono text-2xl font-bold text-accent">1.52m</div>
              <div className="text-xs text-muted-foreground">عرض البكرة</div>
            </div>
            <div>
              <div className="font-mono text-2xl font-bold text-accent">10y</div>
              <div className="text-xs text-muted-foreground">ضمان اصفرار</div>
            </div>
          </div>
        </div>
        <div className="glass-card p-5 lg:col-span-4">
          <img
            src={heroAsset.url}
            alt="سيارة لامبورغيني بطلاء مطفي من صفحة LaAvor PPF"
            width={960}
            height={640}
            className="h-full min-h-[360px] w-full rounded-2xl border border-foreground/10 object-contain"
          />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 mx-auto grid max-w-[1280px] gap-5 px-6 pb-10 lg:grid-cols-12">
        <div className="glass-card p-7 lg:col-span-5">
          <div className="font-mono text-xs text-accent">01</div>
          <h3 className="mt-3 text-2xl font-bold">استشفاء ذاتي بالحرارة</h3>
          <p className="mt-3 text-muted-foreground">
            تختفي الخدوش الدقيقة تلقائياً مع حرارة الشمس أو ماء ساخن، فتبقى السيارة خالية من
            العلامات.
          </p>
        </div>
        <div className="glass-card p-7 lg:col-span-4">
          <div className="font-mono text-xs text-accent">02</div>
          <h3 className="mt-3 text-2xl font-bold">لمعان فائق الشفافية</h3>
          <p className="mt-3 text-muted-foreground">
            طبقة لامعة لا تغيّر لون الطلاء، تمنح عمقاً بصرياً يشبه الطلاء المصقول.
          </p>
        </div>
        <div className="glass-card p-7 lg:col-span-3">
          <div className="font-mono text-xs text-accent">03</div>
          <h3 className="mt-3 text-2xl font-bold">حماية من الاصفرار</h3>
          <p className="mt-3 text-muted-foreground">
            مقاومة للأشعة UV والعوامل الكيميائية مع ضمان اصفرار لعشر سنوات.
          </p>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1280px] px-6 pb-10">
        <h2 className="mb-6 text-3xl font-black">LaAvor PPF</h2>
        <img
          src={ppfAsset.url}
          alt="صورة LaAvor PPF الأصلية: سيارة رياضية وجدول مواصفات فيلم الحماية"
          width={720}
          height={510}
          loading="lazy"
          className="mx-auto h-auto w-full max-w-[900px] rounded-lg border border-foreground/10"
        />
      </section>

      {/* Products */}
      <section id="products" className="relative z-10 mx-auto max-w-[1280px] px-6 pb-16">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-3xl font-black tracking-tight">بكرات مختارة</h2>
          <span className="text-sm font-semibold text-muted-foreground">عرض 1.52m · طول 15m</span>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {products.map((p) => (
            <Link
              key={p.handle}
              to="/product/$handle"
              params={{ handle: p.handle }}
              className="glass-card group block p-6 transition-transform hover:scale-[1.015]"
            >
              <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl border border-foreground/10">
                <img
                  src={p.image_url}
                  alt={p.title}
                  loading="lazy"
                  width={976}
                  height={688}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="mt-5 text-xl font-bold">{p.title}</h3>
              <p className="mt-2 text-muted-foreground">{p.tagline}</p>
              <div className="mt-5 flex items-center justify-between border-t border-foreground/10 pt-4 font-mono">
                <span className="text-muted-foreground">{p.sku}</span>
                <span className="font-bold text-accent">{p.price}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Contact / Footer */}
      <footer id="contact" className="relative z-10 border-t border-foreground/10 bg-foreground/[0.03]">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row">
          <div>
            <span className="text-sm font-bold">LaAvor · حماية الطلاء الفاخرة</span>
            <p className="mt-1 text-sm text-muted-foreground">
              للطلبات والاستفسارات — تواصل معنا لتحصل على عرض سعر وتركيب معتمد.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {[settings.phone1, settings.phone2].filter(Boolean).map((ph) => (
              <a
                key={ph}
                href={waLink(ph, "مرحباً LaAvor، أود الاستفسار عن بكرات PPF")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground ring-1 ring-foreground/20 transition-transform hover:scale-[1.03]"
              >
                واتساب <span dir="ltr" className="font-mono">{ph}</span>
                <ArrowLeft className="size-4" />
              </a>
            ))}
          </div>
        </div>
        <div className="border-t border-foreground/10">
          <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-5 font-mono text-xs text-muted-foreground">
            <span>© 2026 LaAvor — جميع الحقوق محفوظة</span>
            <span>بغداد · أربيل</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
