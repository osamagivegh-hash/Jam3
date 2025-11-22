import React from "react";
import { Facebook, Instagram, Twitter } from "lucide-react";

const links = [
  { href: "#about", label: "من نحن" },
  { href: "#programs", label: "برامجنا" },
  { href: "#initiatives", label: "مبادرات" },
  { href: "#impact", label: "الأثر" },
  { href: "#contact", label: "تواصل" },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--color-primary-dark)] text-white pt-12 pb-8 mt-16">
      <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8 items-start">
        <div className="space-y-3 text-right">
          <h3 className="text-2xl font-extrabold">جمعية إنماء الخيرية</h3>
          <p className="text-sm text-white/80 leading-relaxed">
            نعمل لنشر الأمل عبر برامج مستدامة في المياه والتعليم والرعاية المجتمعية، مع التزام كامل بالشفافية والحوكمة.
          </p>
        </div>
        <div className="text-right">
          <h4 className="font-semibold mb-3">روابط سريعة</h4>
          <div className="grid grid-cols-2 gap-2 text-sm text-white/80">
            {links.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-white">
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div className="space-y-3 text-right">
          <h4 className="font-semibold">تواصل اجتماعي</h4>
          <div className="flex items-center justify-end gap-3">
            {[Facebook, Twitter, Instagram].map((Icon) => (
              <a
                key={Icon.displayName ?? Icon.name}
                href="#"
                className="h-10 w-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20"
                aria-label={Icon.name}
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
          <p className="text-xs text-white/70">
            © 2025 جمعية إنماء الخيرية. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
