import type { Metadata } from "next";
import "./globals.css";
import React from "react";

export const metadata: Metadata = {
  title: "جمعية إنماء | العطاء المستدام",
  description:
    "جمعية إنماء الخيرية - برامج تنموية ومستدامة في المياه والتعليم والرعاية المجتمعية.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-brandGray">{children}</body>
    </html>
  );
}
