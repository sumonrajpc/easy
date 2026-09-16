import type { ReactNode } from "react";
import Header from "@/components/layout/Header";
import MarqueeTicker from "@/components/layout/MarqueeTicker";
import Footer from "@/components/layout/Footer";
import FloatingWidgets from "@/components/layout/FloatingWidgets";
import ActivityPing from "@/components/ActivityPing";
import { getCurrentUser } from "@/lib/auth";
import { getSiteSettings } from "@/lib/settings";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [user, settings] = await Promise.all([getCurrentUser(), getSiteSettings()]);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="gradient-brand no-print px-4 py-1.5 text-center text-[11px] font-semibold tracking-wide text-white sm:text-xs">
        {settings.bannerText}
      </div>
      <Header
        user={user ? { name: user.name, role: user.role } : null}
        logoUrl={settings.logoUrl || undefined}
        siteName={settings.siteName}
      />
      <MarqueeTicker text={settings.marqueeText} />
      {user && <ActivityPing />}
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <FloatingWidgets whatsapp={settings.whatsapp} />
    </div>
  );
}
