"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Image as ImageIcon, Inbox, Layers, ListPlus, LogIn, ShieldCheck, Sparkles } from "lucide-react";

// تأكد من أن هذا الرابط يطابق منفذ الباك اند لديك (4100)
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4100";

interface HeroSlideInput {
  title?: string;
  subtitle?: string;
  href?: string;
  src: string;
  alt: string;
}

interface InitiativeInput {
  title: string;
  desc: string;
  tag: string;
  amount: string;
}

interface ProgramInput {
  title: string;
  desc: string;
  icon: string;
}

interface MessageEntry {
  id: number;
  name: string;
  email: string;
  topic?: string;
  message: string;
  createdAt?: string;
}

const defaultCredentials = { username: "admin", password: "admin123" };

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pendingLogin, setPendingLogin] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [heroSlide, setHeroSlide] = useState<HeroSlideInput>({ src: "", alt: "", title: "", subtitle: "", href: "" });
  const [heroUpload, setHeroUpload] = useState<File | null>(null);
  const [initiative, setInitiative] = useState<InitiativeInput>({ title: "", desc: "", tag: "مبادرة", amount: "" });
  const [program, setProgram] = useState<ProgramInput>({ title: "", desc: "", icon: "Droplet" });
  const [messages, setMessages] = useState<MessageEntry[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlideInput[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const session = typeof window !== "undefined" ? sessionStorage.getItem("dashboard-auth") : null;
    if (session === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const loadContent = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/dashboard/content`);
      if (res.ok) {
        const data = await res.json();
        setHeroSlides(data.heroSlides || []);
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Unable to load dashboard data", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadContent();
    }
  }, [isAuthenticated]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setPendingLogin(true);
    const matches =
      credentials.username.trim() === defaultCredentials.username &&
      credentials.password.trim() === defaultCredentials.password;

    await new Promise((resolve) => setTimeout(resolve, 300));
    setPendingLogin(false);

    if (matches) {
      setIsAuthenticated(true);
      sessionStorage.setItem("dashboard-auth", "true");
    } else {
      setStatusMessage("بيانات الدخول غير صحيحة. تأكد من اسم المستخدم وكلمة المرور.");
    }
  };

  // --- دالة رفع الصور المصححة ---
  const handleHeroUpload = async () => {
    if (!heroUpload) return null;
    const formData = new FormData();
    formData.append("image", heroUpload);

    const res = await fetch(`${API_BASE}/api/hero/upload-image`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      // محاولة قراءة رسالة الخطأ بأمان
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "فشل رفع الصورة");
    }

    const data = await res.json();
    // إرجاع الرابط الكامل القادم من الباك اند
    return data.url as string;
  };

  const submitHeroSlide = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      let finalSrc = heroSlide.src;
      // إذا تم اختيار ملف، نرفعه أولاً ثم نستخدم الرابط الناتج
      if (heroUpload) {
        finalSrc = (await handleHeroUpload()) || heroSlide.src;
      }

      const res = await fetch(`${API_BASE}/api/dashboard/hero/slides`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...heroSlide, src: finalSrc }),
      });

      if (!res.ok) {
        throw new Error("تعذر إضافة الشريحة");
      }

      setStatusMessage("تمت إضافة شريحة الهيرو بنجاح.");
      // تصفير الحقول بعد النجاح
      setHeroSlide({ src: "", alt: "", title: "", subtitle: "", href: "" });
      setHeroUpload(null);
      await loadContent();
    } catch (error) {
      console.error(error);
      setStatusMessage("تعذر إضافة الشريحة. حاول مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitInitiative = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch(`${API_BASE}/api/dashboard/initiatives`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(initiative),
      });

      if (!res.ok) {
        throw new Error("تعذر إضافة المبادرة");
      }

      setStatusMessage("تم إضافة المبادرة بنجاح.");
      setInitiative({ title: "", desc: "", tag: "مبادرة", amount: "" });
      await loadContent();
    } catch (error) {
      console.error(error);
      setStatusMessage("لم يتم حفظ المبادرة، حاول مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitProgram = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch(`${API_BASE}/api/dashboard/programs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(program),
      });

      if (!res.ok) {
        throw new Error("تعذر إضافة البرنامج");
      }

      setStatusMessage("تم إضافة البرنامج بنجاح.");
      setProgram({ title: "", desc: "", icon: "Droplet" });
      await loadContent();
    } catch (error) {
      console.error(error);
      setStatusMessage("لم يتم حفظ البرنامج، حاول مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const latestMessages = useMemo(() => messages.slice().sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 5), [messages]);

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[var(--color-soft)] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-lg w-full max-w-md p-8 border border-[var(--color-muted)]">
          <div className="flex items-center gap-2 mb-6">
            <LogIn className="h-6 w-6 text-[var(--color-primary-dark)]" />
            <h1 className="text-2xl font-bold text-slate-900">تسجيل الدخول للوحة التحكم</h1>
          </div>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-1">
              <label className="text-sm text-slate-700">اسم المستخدم</label>
              <input
                className="contact-input"
                placeholder="مثال: admin"
                value={credentials.username}
                onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-slate-700">كلمة المرور</label>
              <input
                type="password"
                className="contact-input"
                placeholder="مثال: admin123"
                value={credentials.password}
                onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full justify-center" disabled={pendingLogin}>
              {pendingLogin ? "جاري التحقق..." : "دخول"}
            </button>
            <p className="text-xs text-slate-500 text-center">
              اسم المستخدم: <strong>admin</strong> — كلمة المرور: <strong>admin123</strong>
            </p>
            {statusMessage ? <p className="text-xs text-red-600 text-center">{statusMessage}</p> : null}
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-soft)] py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-[var(--color-primary-dark)]">لوحة التحكم</p>
            <h1 className="text-3xl font-bold text-slate-900">إدارة محتوى الموقع</h1>
            <p className="text-sm text-slate-600">إضافة شرائح الهيرو والمبادرات والبرامج واستقبال رسائل التواصل.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 bg-white px-3 py-2 rounded-full border border-[var(--color-muted)]">
            <ShieldCheck className="h-4 w-4 text-[var(--color-primary-dark)]" />
            <span>موثوق — دخول آمن</span>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          <form onSubmit={submitHeroSlide} className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[var(--color-muted)] space-y-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-[var(--color-primary-dark)]" />
              <h2 className="text-xl font-bold text-slate-900">إضافة شريحة للهيرو</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                className="contact-input"
                placeholder="عنوان الشريحة"
                value={heroSlide.title}
                onChange={(e) => setHeroSlide((prev) => ({ ...prev, title: e.target.value }))}
              />
              <input
                className="contact-input"
                placeholder="رابط الإجراء (اختياري)"
                value={heroSlide.href}
                onChange={(e) => setHeroSlide((prev) => ({ ...prev, href: e.target.value }))}
              />
            </div>
            <textarea
              className="contact-input"
              placeholder="وصف مختصر للظهور على الشريحة"
              value={heroSlide.subtitle}
              onChange={(e) => setHeroSlide((prev) => ({ ...prev, subtitle: e.target.value }))}
            />
            <input
              className="contact-input"
              placeholder="رابط الصورة (يُستخدم إذا لم تُرفع صورة)"
              value={heroSlide.src}
              onChange={(e) => setHeroSlide((prev) => ({ ...prev, src: e.target.value }))}
            />
            <input
              className="contact-input"
              placeholder="النص البديل للصورة"
              value={heroSlide.alt}
              onChange={(e) => setHeroSlide((prev) => ({ ...prev, alt: e.target.value }))}
              required
            />
            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-700">رفع صورة جديدة (اختياري)</label>
              <input type="file" accept="image/*" onChange={(e) => setHeroUpload(e.target.files?.[0] || null)} />
            </div>
            <button type="submit" className="btn-primary w-full justify-center" disabled={isSubmitting}>
              {isSubmitting ? "جاري الحفظ..." : "حفظ الشريحة"}
            </button>
          </form>

          <div className="bg-white rounded-3xl p-6 border border-[var(--color-muted)] space-y-4">
            <div className="flex items-center gap-2">
              <Inbox className="h-5 w-5 text-[var(--color-primary-dark)]" />
              <h2 className="text-xl font-bold text-slate-900">أحدث الرسائل</h2>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {latestMessages.length === 0 ? <p className="text-sm text-slate-600">لا توجد رسائل بعد.</p> : null}
              {latestMessages.map((msg) => (
                <div key={msg.id} className="rounded-2xl border border-[var(--color-muted)] p-3 bg-[var(--color-soft)]">
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                    <span>{msg.name}</span>
                    <span>{msg.topic || "عام"}</span>
                  </div>
                  <p className="text-sm text-slate-800 leading-relaxed">{msg.message}</p>
                  <p className="text-xs text-slate-500 mt-1">{msg.email}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <form onSubmit={submitInitiative} className="bg-white rounded-3xl p-6 border border-[var(--color-muted)] space-y-4">
            <div className="flex items-center gap-2">
              <ListPlus className="h-5 w-5 text-[var(--color-primary-dark)]" />
              <h2 className="text-xl font-bold text-slate-900">إضافة مبادرة</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                className="contact-input"
                placeholder="عنوان المبادرة"
                value={initiative.title}
                onChange={(e) => setInitiative((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
              <input
                className="contact-input"
                placeholder="وسم أو فئة"
                value={initiative.tag}
                onChange={(e) => setInitiative((prev) => ({ ...prev, tag: e.target.value }))}
              />
            </div>
            <textarea
              className="contact-input"
              placeholder="وصف مختصر"
              value={initiative.desc}
              onChange={(e) => setInitiative((prev) => ({ ...prev, desc: e.target.value }))}
              required
            />
            <input
              className="contact-input"
              placeholder="قيمة أو ميزانية (اختياري)"
              value={initiative.amount}
              onChange={(e) => setInitiative((prev) => ({ ...prev, amount: e.target.value }))}
            />
            <button type="submit" className="btn-primary w-full justify-center" disabled={isSubmitting}>
              {isSubmitting ? "جاري الحفظ..." : "حفظ المبادرة"}
            </button>
          </form>

          <form onSubmit={submitProgram} className="bg-white rounded-3xl p-6 border border-[var(--color-muted)] space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-[var(--color-primary-dark)]" />
              <h2 className="text-xl font-bold text-slate-900">إضافة برنامج</h2>
            </div>
            <input
              className="contact-input"
              placeholder="اسم البرنامج"
              value={program.title}
              onChange={(e) => setProgram((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
            <textarea
              className="contact-input"
              placeholder="وصف مختصر للبرنامج"
              value={program.desc}
              onChange={(e) => setProgram((prev) => ({ ...prev, desc: e.target.value }))}
              required
            />
            <select
              className="contact-input"
              value={program.icon}
              onChange={(e) => setProgram((prev) => ({ ...prev, icon: e.target.value }))}
            >
              <option value="Droplet">قطرة ماء</option>
              <option value="GraduationCap">تعليم</option>
              <option value="HeartHandshake">مساندة</option>
              <option value="HandHeart">رعاية</option>
              <option value="Sparkles">ابتكار</option>
            </select>
            <button type="submit" className="btn-primary w-full justify-center" disabled={isSubmitting}>
              {isSubmitting ? "جاري الحفظ..." : "حفظ البرنامج"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[var(--color-muted)] space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[var(--color-primary-dark)]" />
            <h2 className="text-xl font-bold text-slate-900">نظرة سريعة</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 text-right text-sm">
            <div className="rounded-2xl bg-[var(--color-soft)] p-4 border border-[var(--color-muted)]">
              <p className="text-[var(--color-primary-dark)]">شرائح الهيرو</p>
              <p className="text-2xl font-extrabold text-slate-900">{heroSlides.length}</p>
            </div>
            <div className="rounded-2xl bg-[var(--color-soft)] p-4 border border-[var(--color-muted)]">
              <p className="text-[var(--color-primary-dark)]">الرسائل المستلمة</p>
              <p className="text-2xl font-extrabold text-slate-900">{messages.length}</p>
            </div>
            <div className="rounded-2xl bg-[var(--color-soft)] p-4 border border-[var(--color-muted)]">
              <p className="text-[var(--color-primary-dark)]">حالة الحفظ</p>
              <div className="flex items-center gap-2 text-slate-700">
                <ArrowRight className="h-4 w-4" />
                <span>{statusMessage || "جاهز لإضافة محتوى جديد"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}