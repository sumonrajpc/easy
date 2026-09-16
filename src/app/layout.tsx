import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";

const hindSiliguri = Hind_Siliguri({
  subsets: ["latin", "bengali"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EasySkillBD — Don't Just Try, Dream Bigger, Shine Brighter",
  description:
    "EasySkillBD is Bangladesh's leading online learning platform offering job-focused courses in Web Development, Digital Marketing, Graphics Design and more.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={hindSiliguri.variable}>
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
