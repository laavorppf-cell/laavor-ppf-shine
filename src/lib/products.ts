import glossImg from "@/assets/ppf-gloss.jpg";
import matteImg from "@/assets/ppf-matte.jpg";
import proImg from "@/assets/ppf-pro.jpg";

export interface Product {
  handle: string;
  title: string;
  tagline: string;
  description: string;
  sku: string;
  price: string;
  image: string;
  specs: { label: string; value: string }[];
}

export const products: Product[] = [
  {
    handle: "laavor-gloss-ultra",
    title: "LaAvor Gloss Ultra",
    tagline: "لمعان فائق مع طبقة استشفاء سريع للخدوش الدقيقة.",
    description:
      "بكرة فيلم حماية طلاء TPU عالي اللمعان. شفافية كريستالية لا تغيّر لون الطلاء، استشفاء ذاتي للخدوش الدقيقة بالحرارة، ومقاومة اصفرار مضمونة لعشر سنوات. الخيار الأول للصالونات المتخصصة وعشّاق اللمعان المرآتي.",
    sku: "PPF-GU-152",
    price: "325,000 د.ع",
    image: glossImg,
    specs: [
      { label: "السماكة", value: "200µm" },
      { label: "العرض", value: "1.52m" },
      { label: "الطول", value: "15m" },
      { label: "الضمان", value: "10 سنوات" },
    ],
  },
  {
    handle: "laavor-satin-matte",
    title: "LaAvor Satin Matte",
    tagline: "لمسة حريرية مطفيّة تمنح السيارة حضوراً راقياً.",
    description:
      "بكرة فيلم حماية TPU بلمسة ساتان مطفية. تحوّل أي طلاء لامع إلى مظهر مخملي فاخر دون إعادة طلاء، مع حماية كاملة من الخدوش والحصى المتطاير والأشعة فوق البنفسجية.",
    sku: "PPF-SM-152",
    price: "360,000 د.ع",
    image: matteImg,
    specs: [
      { label: "السماكة", value: "190µm" },
      { label: "العرض", value: "1.52m" },
      { label: "الطول", value: "15m" },
      { label: "الضمان", value: "8 سنوات" },
    ],
  },
  {
    handle: "laavor-self-heal-pro",
    title: "LaAvor Self-Heal Pro",
    tagline: "أداء احترافي للصالونات مع مرونة قصّ عالية.",
    description:
      "الفئة الاحترافية من LaAvor: طبقة TPU متقدمة باستشفاء ذاتي فائق السرعة ومرونة عالية تسهّل التركيب على الانحناءات المعقدة. مصممة لورش التركيب المحترفة التي تطلب أعلى معايير التشطيب.",
    sku: "PPF-SHP-152",
    price: "410,000 د.ع",
    image: proImg,
    specs: [
      { label: "السماكة", value: "210µm" },
      { label: "العرض", value: "1.52m" },
      { label: "الطول", value: "15m" },
      { label: "الضمان", value: "10 سنوات" },
    ],
  },
];
