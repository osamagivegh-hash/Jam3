"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BookOpenCheck,
  Droplet,
  GraduationCap,
  HandHeart,
  HeartHandshake,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HeroSection, { HeroSlide } from "./components/HeroSection";

interface ReportCard {
  title: string;
  value: string;
}

interface InitiativeCard {
  id?: number;
  tag: string;
  title: string;
  desc: string;
  amount: string;
}

interface ProgramCard {
  id?: number;
  icon: string;
  title: string;
  desc: string;
}

interface AboutHighlight {
  title: string;
  desc: string;
  icon: LucideIcon;
}

interface DashboardContent {
  heroSlides?: HeroSlide[];
  initiatives?: InitiativeCard[];
  programs?: ProgramCard[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const defaultHeroSlides: HeroSlide[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80",
    alt: "أسر تتلقى الدعم في الميدان",
    title: "نصل إلى العائلات الأشد احتياجاً بكرامة",
    subtitle: "فرقنا الميدانية تعمل بمعايير سلامة وجودة لتعزيز أثر عطائكم.",
    href: "#initiatives",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1600&q=80",
    alt: "متطوعون يقدمون خدمات تعليمية",
    title: "برامج تعليمية وتمكينية رائدة",
    subtitle: "نصمم محتوى يلهم الأطفال والشباب ليصنعوا مستقبلهم.",
    href: "#programs",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1600&q=80",
    alt: "مياه نقية تصل للقرى",
    title: "مشروعات مياه مستدامة",
    subtitle: "شبكات مياه وبِنى تحتية تحافظ على صحة الأسر والقرى.",
    href: "#impact",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1517949908110-22fa5f51d36f?auto=format&fit=crop&w=1600&q=80",
    alt: "مبادرات طارئة",
    title: "استجابة فورية للحالات الطارئة",
    subtitle: "نعمل بتكامل مع شركائنا لتأمين الغذاء والرعاية الطبية في الوقت المناسب.",
    href: "#contact",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1600&q=80",
    alt: "شراكات مجتمعية",
    title: "شراكات موثوقة تعزز أثر العطاء",
    subtitle: "حوكمة دقيقة وتقارير شفافة تحافظ على ثقة المانحين.",
    href: "#about",
  },
];

const reportCards: ReportCard[] = [
  { title: "مياه نقية", value: "+3.1M لتر" },
  { title: "جلسات تعليمية", value: "8,500" },
  { title: "وجبات تغذية", value: "42,000" },
  { title: "حالات طوارئ", value: "96%" },
];

const defaultInitiativeCards: InitiativeCard[] = [
  {
    tag: "المياه • موثقة",
    title: "مضخة الأمل",
    desc: "حفر بئر سطحي مع خزان ومضخة كهربائية لتأمين المياه لـ 250 مستفيد يوميًا.",
    amount: "5,500 ر.س",
  },
  {
    tag: "رعاية • موثقة",
    title: "كفالة يتيم لعام",
    desc: "تغطية مصروفات التعليم والرعاية الصحية والبرامج الوجدانية ليَتيم واحد لمدة 12 شهرًا.",
    amount: "2,400 ر.س",
  },
  {
    tag: "القرآن • موثقة",
    title: "حِلْقة نور",
    desc: "تجهيز حلقة تحفيظ كاملة بالمصاحف، الوسائل التقنية، وحوافز التميز لمدة فصل دراسي.",
    amount: "3,200 ر.س",
  },
];

const steps: string[] = [
  "تقييم احتياج ميداني موثق",
  "توريد وتجهيز وفق المعايير",
  "متابعة تشغيل وصيانة مستمرة",
  "تقارير صور وفيديو للأثر",
];

const defaultProgramCards: ProgramCard[] = [
  {
    icon: "Droplet",
    title: "مسارات المياه",
    desc: "شبكات مياه نقية وبِنى تحتية تدعم القرى العطشى بمعايير سلامة عالية.",
  },
  {
    icon: "GraduationCap",
    title: "التعليم والتمكين",
    desc: "برامج تعليمية وتدريبية تفتح آفاقًا جديدة للشباب والأطفال.",
  },
  {
    icon: "HeartHandshake",
    title: "الإغاثة والمساندة",
    desc: "تدخلات طارئة وسلال غذائية ورعاية متكاملة للأسر الأكثر حاجة.",
  },
];

const aboutHighlights: AboutHighlight[] = [
  {
    title: "مياه نقية",
    desc: "آبار وشبكات حديثة تدعم العائلات يومياً.",
    icon: Droplet,
  },
  {
    title: "تعليم وتمكين",
    desc: "بيئات تعليمية آمنة للأطفال والشباب.",
    icon: BookOpenCheck,
  },
  {
    title: "رعاية مجتمعية",
    desc: "دعم نفسي واجتماعي يحفظ الكرامة.",
    icon: HeartHandshake,
  },
  {
    title: "حوكمة وموثوقية",
    desc: "تقارير موثقة ومؤشرات أثر واضحة.",
    icon: ShieldCheck,
  },
];

const aboutBullets: string[] = [
  "حَوْكمة مالية بشفافية وتقارير دورية للمانحين.",
  "شراكات معتمدة مع جهات دولية ومحلية.",
  "مسارات تبرع سريعة وآمنة عبر قنوات متعددة.",
  "فرق ميدانية مدربة تعمل وفق معايير السلامة والجودة.",
];

export default function Home() {
  const [content, setContent] = useState<DashboardContent | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    topic: "تبرع",
    message: "",
  });
  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoadingContent(true);
      try {
        const res = await fetch(`${API_BASE}/api/dashboard/content`);
        if (res.ok) {
          const data = await res.json();
          setContent(data);
        }
      } catch (error) {
        console.error("Unable to load dashboard content", error);
      } finally {
        setIsLoadingContent(false);
      }
    };

    fetchContent();
  }, []);

  const heroSlides = useMemo(() => {
    const slides = content?.heroSlides || [];
    const formattedSlides = slides.map((slide) => {
      const src = slide.src ?? "";
      if (!src) return slide;
      if (src.startsWith("http")) return slide;
      const normalizedSrc = src.startsWith("/") ? src : `/${src}`;
      return { ...slide, src: normalizedSrc };
    });
    return formattedSlides.length ? formattedSlides : defaultHeroSlides;
  }, [content?.heroSlides]);

  const initiativeCards = useMemo(() => {
    const initiatives = content?.initiatives || [];
    return initiatives.length ? initiatives : defaultInitiativeCards;
  }, [content?.initiatives]);

  const programs = useMemo(() => {
    const iconMap: Record<string, LucideIcon> = {
      Droplet,
      GraduationCap,
      HeartHandshake,
      HandHeart,
      Sparkles,
      ShieldCheck,
    };

    const programsPayload = content?.programs || [];
    const source = programsPayload.length ? programsPayload : defaultProgramCards;

    return source.map((program) => ({
      ...program,
      iconComponent: iconMap[program.icon] || Sparkles,
    }));
  }, [content?.programs]);

  const handleContactSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setContactStatus("sending");

    try {
      const res = await fetch(`${API_BASE}/api/dashboard/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      setContactStatus("success");
      setContactForm({ name: "", email: "", topic: "تبرع", message: "" });
    } catch (error) {
      console.error(error);
      setContactStatus("error");
    }
  };

  return (
    <>
      <Header />

      <main className="bg-[var(--color-soft)]">
        <HeroSection slides={heroSlides} />

        <section id="about" className="section bg-white relative">
          <div className="container mx-auto px-4 grid lg:grid-cols-[1.2fr_1fr] gap-10 items-start">
            <div className="space-y-4 text-right">
              <p className="text-sm font-semibold text-[var(--color-primary-dark)]">من نحن</p>
              <h2 className="section-title text-right">جمعية إنماء الخيرية</h2>
              <p className="text-slate-700 leading-relaxed text-lg">
                نؤمن بأن لكل إنسان الحق في الماء والتعليم والكرامة. فريقنا يعمل بمعايير دولية معتمدة، ويعتمد على الابتكار في تصميم
                البرامج التي تصل بأمان وفاعلية إلى المستفيدين.
              </p>
              <div className="space-y-3">
                {aboutBullets.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl bg-[var(--color-soft)] p-3 border border-[var(--color-muted)]"
                  >
                    <span className="h-8 w-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold">
                      ✓
                    </span>
                    <p className="text-slate-800 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-card p-6 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-[var(--color-primary-dark)]">تقرير الأثر السنوي</p>
                    <h3 className="text-2xl font-bold text-slate-900">أرقام موثوقة تعكس أثر العطاء</h3>
                  </div>
                  <Sparkles className="h-6 w-6 text-[var(--color-primary-dark)]" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {reportCards.map((card) => (
                    <div key={card.title} className="rounded-2xl bg-[var(--color-soft)] p-4 border border-[var(--color-muted)] text-right">
                      <p className="text-sm text-[var(--color-primary-dark)] mb-1">{card.title}</p>
                      <p className="text-2xl font-extrabold text-slate-900">{card.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="rounded-card p-6 bg-[var(--color-soft)] border border-[var(--color-muted)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900">مبادرات موثقة</h3>
                <HandHeart className="h-6 w-6 text-[var(--color-primary-dark)]" />
              </div>
              <div className="space-y-4">
                {initiativeCards.map((item) => (
                  <div key={`${item.title}-${item.tag}`} className="rounded-2xl bg-white p-4 border border-[var(--color-muted)]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-[var(--color-primary-dark)]">{item.tag}</span>
                      <ArrowUpRight className="h-5 w-5 text-[var(--color-primary-dark)]" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">{item.desc}</p>
                    {item.amount ? (
                      <p className="text-sm font-semibold text-[var(--color-primary-dark)] mt-2">{item.amount}</p>
                    ) : null}
                  </div>
                ))}
              </div>
              {isLoadingContent ? (
                <p className="text-center text-xs text-slate-500 mt-3">جاري تحميل البيانات...</p>
              ) : null}
            </div>
          </div>
        </section>

        <section id="initiatives" className="section bg-[var(--color-soft)]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-sm font-semibold text-[var(--color-primary-dark)]">مبادرات مختارة</p>
              <h2 className="section-title">تأثير فوري وشفاف</h2>
              <p className="section-sub">
                مبادرات موثقة بتقارير صور وفيديو تضمن أن يصل عطاؤكم بأمان للمستفيدين.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {initiativeCards.map((card) => (
                <div key={card.title} className="rounded-card p-6 bg-white card-hover text-right h-full border border-[var(--color-muted)]">
                  <p className="text-xs font-semibold text-[var(--color-primary-dark)] mb-2">{card.tag}</p>
                  <h3 className="text-xl font-bold text-[var(--color-primary-dark)] mb-2">{card.title}</h3>
                  <p className="text-slate-700 leading-relaxed text-sm">{card.desc}</p>
                  {card.amount ? <p className="text-sm font-semibold text-[var(--color-primary-dark)] mt-3">{card.amount}</p> : null}
                  <div className="mt-4 flex items-center gap-2 text-[var(--color-primary-dark)] text-sm font-semibold">
                    <ShieldCheck className="h-4 w-4" />
                    أثر موثق
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section bg-white relative">
          <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4 text-right">
              <p className="text-sm font-semibold text-[var(--color-primary-dark)]">رحلة التبرع</p>
              <h2 className="section-title text-right">من الفكرة إلى الأثر</h2>
              <p className="text-slate-700 leading-relaxed text-lg">
                رحلة تبرع واضحة تبدأ بتقييم الاحتياج وتنتهي بتقارير دقيقة تضمن وصول عطائك للمستفيدين بأعلى معايير الشفافية.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                {steps.map((step, idx) => (
                  <div key={step} className="rounded-2xl bg-[var(--color-soft)] p-4 border border-[var(--color-muted)] text-right">
                    <div className="flex items-center justify-between mb-2">
                      <span className="h-8 w-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <Sparkles className="h-5 w-5 text-[var(--color-primary-dark)]" />
                    </div>
                    <p className="text-slate-800 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-card p-6 bg-[var(--color-soft)] border border-[var(--color-muted)] text-right space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">حوكمة وأمان</h3>
                <ShieldCheck className="h-6 w-6 text-[var(--color-primary-dark)]" />
              </div>
              <p className="text-slate-700 leading-relaxed">
                نلتزم بحوكمة مالية وتقنية صارمة، مع لوحات تحكم تُمكّن المانحين من تتبع مسارات التبرع والمخرجات الفعلية.
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm text-slate-700">
                <div className="rounded-2xl bg-white p-4 border border-[var(--color-muted)]">تتبع فوري للحالات</div>
                <div className="rounded-2xl bg-white p-4 border border-[var(--color-muted)]">تقارير موثقة بالصور</div>
                <div className="rounded-2xl bg-white p-4 border border-[var(--color-muted)]">تحديثات عبر البريد</div>
                <div className="rounded-2xl bg-white p-4 border border-[var(--color-muted)]">خط دعم مباشر</div>
              </div>
            </div>
          </div>
        </section>

        <section id="programs" className="section bg-[var(--color-soft)]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-sm font-semibold text-[var(--color-primary-dark)]">برامجنا</p>
              <h2 className="section-title">مسارات تخصصية</h2>
              <p className="section-sub">
                مسارات متخصصة تضمن أثراً متوازنًا في المياه والتعليم والإغاثة، مع روح عائلية ودعم مستمر.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {programs.map((card) => {
                const Icon = card.iconComponent;
                return (
                  <div key={card.title} className="rounded-card p-6 card-hover text-right h-full border border-[var(--color-muted)] bg-white">
                    <div className="h-12 w-12 rounded-2xl bg-[var(--color-muted)] flex items-center justify-center text-[var(--color-primary-dark)] mb-4">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--color-primary-dark)] mb-2">{card.title}</h3>
                    <p className="text-slate-700 leading-relaxed text-sm">{card.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="impact" className="section bg-white relative">
          <div className="container mx-auto px-4 grid lg:grid-cols-[1.2fr_1fr] gap-10 items-start">
            <div className="space-y-4 text-right">
              <p className="text-sm font-semibold text-[var(--color-primary-dark)]">أثرنا</p>
              <h2 className="section-title text-right">مجتمعات تزدهر بالعطاء</h2>
              <p className="text-slate-700 leading-relaxed text-lg">
                من المياه إلى التعليم والرعاية، نعمل بروح عائلية مع الشركاء والمتطوعين لضمان أثر مستدام وواضح.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {aboutHighlights.map((item) => (
                  <div key={item.title} className="rounded-2xl bg-[var(--color-soft)] p-4 border border-[var(--color-muted)]">
                    <div className="flex items-center gap-3 mb-2 justify-end">
                      <item.icon className="h-6 w-6 text-[var(--color-primary-dark)]" />
                      <h4 className="text-lg font-bold text-slate-900">{item.title}</h4>
                    </div>
                    <p className="text-slate-700 leading-relaxed text-sm text-right">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-card p-6 bg-[var(--color-soft)] border border-[var(--color-muted)] space-y-3 text-right">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">مؤشرات الثقة</h3>
                <Sparkles className="h-6 w-6 text-[var(--color-primary-dark)]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white p-4 border border-[var(--color-muted)]">
                  <p className="text-sm text-[var(--color-primary-dark)] mb-1">حوكمة</p>
                  <p className="text-2xl font-extrabold text-slate-900">+95%</p>
                  <p className="text-xs text-slate-600">التزام بالمعايير</p>
                </div>
                <div className="rounded-2xl bg-white p-4 border border-[var(--color-muted)]">
                  <p className="text-sm text-[var(--color-primary-dark)] mb-1">التزام</p>
                  <p className="text-2xl font-extrabold text-slate-900">24/7</p>
                  <p className="text-xs text-slate-600">فِرق متابعة ميدانية</p>
                </div>
                <div className="rounded-2xl bg-white p-4 border border-[var(--color-muted)]">
                  <p className="text-sm text-[var(--color-primary-dark)] mb-1">تمكين</p>
                  <p className="text-2xl font-extrabold text-slate-900">+12K</p>
                  <p className="text-xs text-slate-600">مستفيد مباشر</p>
                </div>
                <div className="rounded-2xl bg-white p-4 border border-[var(--color-muted)]">
                  <p className="text-sm text-[var(--color-primary-dark)] mb-1">شراكات</p>
                  <p className="text-2xl font-extrabold text-slate-900">38</p>
                  <p className="text-xs text-slate-600">جهات موثوقة</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="section bg-gradient-to-br from-[var(--color-muted)] via-[var(--color-soft)] to-[var(--color-muted)] relative overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[var(--color-primary)]/15 to-transparent" aria-hidden />
          <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-10 items-start relative">
            <div className="space-y-4 text-right">
              <p className="text-sm font-semibold text-[var(--color-primary-dark)]">تواصل</p>
              <h2 className="text-3xl font-extrabold text-[var(--color-primary-dark)]">تواصل معنا</h2>
              <p className="text-slate-700 leading-relaxed">
                ندعو المانحين والشركاء للتواصل معنا لتصميم مسارات عطاء تحقق أثراً فورياً وشفافاً.
              </p>
              <div className="space-y-3 text-sm text-slate-700">
                <div className="flex items-center gap-3 justify-start">
                  <Phone className="h-5 w-5 text-[var(--color-primary-dark)]" />
                  <span>+966 555 123 456</span>
                </div>
                <div className="flex items-center gap-3 justify-start">
                  <Mail className="h-5 w-5 text-[var(--color-primary-dark)]" />
                  <span>support@enmaa.org</span>
                </div>
                <div className="flex items-center gap-3 justify-start">
                  <MapPin className="h-5 w-5 text-[var(--color-primary-dark)]" />
                  <span>الرياض - المملكة العربية السعودية</span>
                </div>
              </div>
            </div>
            <div className="rounded-card p-6 bg-white">
              <h3 className="text-xl font-bold text-[var(--color-primary-dark)] mb-4">استمارة التواصل</h3>
              <form className="space-y-3" onSubmit={handleContactSubmit}>
                <input
                  type="text"
                  placeholder="الاسم الكامل"
                  className="contact-input"
                  value={contactForm.name}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
                <input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  className="contact-input"
                  value={contactForm.email}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                  required
                />
                <select
                  className="contact-input"
                  value={contactForm.topic}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, topic: e.target.value }))}
                >
                  <option>تبرع</option>
                  <option>شراكة</option>
                  <option>استفسار عام</option>
                </select>
                <textarea
                  rows={4}
                  placeholder="نص الرسالة"
                  className="contact-input"
                  value={contactForm.message}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
                  required
                />
                <button type="submit" className="btn-primary w-full justify-center" disabled={contactStatus === "sending"}>
                  {contactStatus === "sending" ? "جاري الإرسال..." : "إرسال الرسالة"}
                </button>
                {contactStatus === "success" ? (
                  <p className="text-xs text-green-600 text-center">تم استلام رسالتك بنجاح.</p>
                ) : null}
                {contactStatus === "error" ? (
                  <p className="text-xs text-red-600 text-center">تعذر إرسال الرسالة، يرجى المحاولة لاحقاً.</p>
                ) : null}
              </form>
              <div className="grid grid-cols-3 gap-3 text-center text-xs text-slate-600 mt-4">
                <div className="rounded-2xl bg-[var(--color-soft)] p-3 border border-[var(--color-muted)]">Email</div>
                <div className="rounded-2xl bg-[var(--color-soft)] p-3 border border-[var(--color-muted)]">Phone</div>
                <div className="rounded-2xl bg-[var(--color-soft)] p-3 border border-[var(--color-muted)]">WhatsApp</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
