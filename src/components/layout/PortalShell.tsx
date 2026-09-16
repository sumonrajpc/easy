"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, Home } from "lucide-react";
import Logo from "./Logo";
import { logoutAction } from "@/app/actions/auth";
import type { LucideIcon } from "lucide-react";

export type NavItem = { label: string; href: string; icon: LucideIcon };

export default function PortalShell({
  navItems,
  user,
  roleLabel,
  children,
}: {
  navItems: NavItem[];
  user: { name: string; email: string; role: string };
  roleLabel: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-slate-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
          <Logo size="sm" />
          <button onClick={() => setOpen(false)} className="lg:hidden">
            <X size={20} />
          </button>
        </div>
        <div className="border-b border-slate-100 px-5 py-4">
          <p className="rounded-full bg-brand-50 px-3 py-1 text-center text-xs font-bold uppercase tracking-wide text-brand-700">
            {roleLabel}
          </p>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/dashboard" && item.href !== "/instructor" && item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  active || pathname === item.href
                    ? "gradient-brand text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon size={17} />
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/"
            className="mt-2 flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-100"
          >
            <Home size={17} /> Back to Website
          </Link>
        </nav>
        <div className="absolute bottom-0 w-full border-t border-slate-100 p-3">
          <div className="mb-2 flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
            <span className="gradient-brand flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white">
              {user.name.slice(0, 1).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">{user.name}</p>
              <p className="truncate text-xs text-slate-400">{user.email}</p>
            </div>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              <LogOut size={17} /> Logout
            </button>
          </form>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md sm:px-6">
          <button onClick={() => setOpen(true)} className="lg:hidden">
            <Menu size={22} />
          </button>
          <p className="font-bold text-slate-800">{roleLabel} Panel</p>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
