import Footer from "./components/Footer";
import Header from "./components/Header";
import HeroSection, { HeroSlide } from "./components/HeroSection";
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

interface ReportCard {
  title: string;
  value: string;
}

interface InitiativeCard {
  tag: string;
  title: string;
  desc: string;
  amount: string;
}

interface ProgramCard {
  icon: LucideIcon;
  title: string;
  desc: string;
}

interface AboutHighlight {
  title: string;
  desc: string;
  icon: LucideIcon;
}

const heroSlides: HeroSlide[] = [
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

const initiativeCards: InitiativeCard[] = [
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

const programCards: ProgramCard[] = [
  {
    icon: Droplet,
    title: "مسارات المياه",
    desc: "شبكات مياه نقية وبِنى تحتية تدعم القرى العطشى بمعايير سلامة عالية.",
  },
  {
    icon: GraduationCap,
    title: "التعليم والتمكين",
    desc: "برامج تعليمية وتدريبية تفتح آفاقًا جديدة للشباب والأطفال.",
  },
  {
    icon: HeartHandshake,
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
                نؤمن بأن لكل إنسان الحق في الماء والتعليم والكرامة. فريقنا يعمل بمعايير دولية معتمدة، ويعتمد على الابتكار في تصميم البرامج التي تصل بأمان وفاعلية إلى المستفيدين.
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
                    <p className="text-sm text-slate-500">أحدث تقرير أثر</p>
                    <p className="text-xl font-bold text-[var(--color-primary-dark)]">ربع سنوي - 2024</p>
                  </div>
                  <Sparkles className="h-6 w-6 text-[var(--color-primary-dark)]" />
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {reportCards.map((card) => (
                    <div
                      key={card.title}
                      className="rounded-2xl bg-[var(--color-soft)] border border-[var(--color-muted)] p-3"
                    >
                      <p className="text-slate-500">{card.title}</p>
                      <p className="text-lg font-semibold text-[var(--color-primary-dark)]">{card.value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 pt-3 text-sm font-semibold text-[var(--color-primary-dark)]">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>اطلع على تفاصيل أكثر</span>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {aboutHighlights.map((card) => (
                <div key={card.title} className="rounded-card p-5 card-hover h-full">
                  <div className="h-12 w-12 rounded-2xl bg-[var(--color-muted)] flex items-center justify-center text-[var(--color-primary-dark)] mb-3">
                    <card.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--color-primary-dark)] mb-2">{card.title}</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="initiatives" className="section bg-[var(--color-soft)]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-sm font-semibold text-[var(--color-primary-dark)]">مبادرات</p>
              <h2 className="section-title">مبادرات جاهزة للتبرع</h2>
              <p className="section-sub">
                اختر المبادرة التي تلامس قلبك وساهم في تغيير حياة المستفيدين اليوم.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {initiativeCards.map((item) => (
                <div key={item.title} className="rounded-card p-6 card-hover h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className="badge">{item.tag}</span>
                    <span className="text-xs text-slate-500">موثقة</span>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-primary-dark)] mb-2">{item.title}</h3>
                  <p className="text-slate-700 text-sm leading-relaxed flex-1">{item.desc}</p>
                  <div className="flex items-center justify-between mt-6">
                    <p className="text-lg font-extrabold text-[var(--color-primary-dark)]">{item.amount}</p>
                    <a href="#contact" className="btn-outline text-sm px-4 py-2">
                      تبرع الآن
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="impact" className="section bg-white">
          <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-10 items-start">
            <div className="space-y-5 order-2 lg:order-1">
              <p className="text-sm font-semibold text-[var(--color-primary-dark)]">الأثر</p>
              <h2 className="section-title text-right">الأثر الميداني</h2>
              <p className="section-sub text-right">
                نعمل بشراكات محلية موثوقة ونستخدم أنظمة مراقبة رقمية للتأكد من وصول المساعدات للجهات المستهدفة في الوقت المناسب.
              </p>
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div
                    key={step}
                    className="rounded-2xl border border-[var(--color-muted)] bg-[var(--color-soft)] p-4 flex items-center gap-3 shadow-sm"
                  >
                    <div className="h-10 w-10 rounded-full bg-[var(--color-primary)] text-white font-bold flex items-center justify-center">
                      {index + 1}
                    </div>
                    <p className="font-semibold text-slate-800">{step}</p>
                  </div>
                ))}
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary-dark)] text-white px-6 py-3 font-semibold shadow-md">
                نعدك بتجربة عطاء شفافة وآمنة
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="rounded-card p-6 bg-white relative overflow-hidden">
                <div className="absolute -left-10 -top-10 h-32 w-32 bg-[var(--color-primary)] opacity-20 rounded-full" />
                <div className="absolute -right-16 -bottom-16 h-48 w-48 bg-[var(--color-accent)] opacity-20 rounded-full" />
                <div className="relative space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">آخر تحديث</p>
                      <p className="text-lg font-bold text-[var(--color-primary-dark)]">"المحطة الميدانية - شرق إفريقيا"</p>
                    </div>
                    <HandHeart className="h-7 w-7 text-[var(--color-primary-dark)]" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="rounded-2xl bg-[var(--color-soft)] p-4 border border-[var(--color-muted)]">
                      <p className="text-slate-500">مسارات المياه</p>
                      <p className="text-xl font-bold text-[var(--color-primary-dark)]">32 مشروعًا</p>
                    </div>
                    <div className="rounded-2xl bg-[var(--color-soft)] p-4 border border-[var(--color-muted)]">
                      <p className="text-slate-500">حالات طارئة</p>
                      <p className="text-xl font-bold text-[var(--color-primary-dark)]">12 تدخلًا</p>
                    </div>
                    <div className="rounded-2xl bg-[var(--color-soft)] p-4 border border-[var(--color-muted)]">
                      <p className="text-slate-500">برامج تعليمية</p>
                      <p className="text-xl font-bold text-[var(--color-primary-dark)]">18 فصلًا</p>
                    </div>
                    <div className="rounded-2xl bg-[var(--color-soft)] p-4 border border-[var(--color-muted)]">
                      <p className="text-slate-500">متطوعون</p>
                      <p className="text-xl font-bold text-[var(--color-primary-dark)]">+540</p>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-[var(--color-primary)] text-white p-5 flex items-center justify-between shadow-lg">
                    <div>
                      <p className="text-sm opacity-90">وقت استجابة البلاغات</p>
                      <p className="text-2xl font-extrabold">
                        <span className="text-[var(--color-accent)]">48</span>{" "}
                        ساعة فقط
                      </p>
                    </div>
                    <ArrowUpRight className="h-7 w-7" />
                  </div>
                </div>
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
              {programCards.map((card) => (
                <div key={card.title} className="rounded-card p-6 card-hover text-right h-full">
                  <div className="h-12 w-12 rounded-2xl bg-[var(--color-muted)] flex items-center justify-center text-[var(--color-primary-dark)] mb-4">
                    <card.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-primary-dark)] mb-2">{card.title}</h3>
                  <p className="text-slate-700 leading-relaxed text-sm">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="section bg-gradient-to-br from-[var(--color-muted)] via-[var(--color-soft)] to-[var(--color-muted)] relative overflow-hidden"
        >
          <div
            className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[var(--color-primary)]/15 to-transparent"
            aria-hidden
          />
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
              <form className="space-y-3">
                <input type="text" placeholder="الاسم الكامل" className="contact-input" />
                <input type="email" placeholder="البريد الإلكتروني" className="contact-input" />
                <select className="contact-input" defaultValue="تبرع">
                  <option>تبرع</option>
                  <option>شراكة</option>
                  <option>استفسار عام</option>
                </select>
                <textarea rows={4} placeholder="نص الرسالة" className="contact-input" />
                <button type="button" className="btn-primary w-full justify-center">
                  إرسال الرسالة
                </button>
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
