"use client";

import React, { useState } from "react";
import { HeartHandshake, Menu, X } from "lucide-react";

type NavItem = {
  href: string;
  label: string;
};

const navItems: NavItem[] = [
  { href: "#about", label: "من نحن" },
  { href: "#programs", label: "برامجنا" },
  { href: "#initiatives", label: "مبادرات" },
  { href: "#impact", label: "الأثر" },
  { href: "#contact", label: "تواصل" },
];

export default function Header() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        <div className="flex items-center gap-3 text-right">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white flex items-center justify-center shadow-lg border border-white">
            <HeartHandshake className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-slate-600 font-semibold">جمعية إنماء الخيرية</p>
            <p className="font-extrabold text-[var(--color-primary-dark)]">العطاء الذي يصنع أثراً</p>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-700">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-[var(--color-primary-dark)] transition">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a href="#contact" className="btn-primary px-5 py-2 shadow-md">
            تبرع الآن
          </a>
        </div>

        <button
          className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-700"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="القائمة"
          type="button"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t border-slate-200 shadow-inner px-4 pb-4">
          <nav className="flex flex-col gap-3 text-sm font-semibold text-slate-700">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="py-2 border-b last:border-b-0 border-slate-100"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              className="btn-primary w-full justify-center"
              onClick={() => setOpen(false)}
            >
              تبرع الآن
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
