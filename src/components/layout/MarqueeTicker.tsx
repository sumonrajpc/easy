"use client";

import { Megaphone } from "lucide-react";

export default function MarqueeTicker({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div className="gradient-brand flex items-center overflow-hidden py-2 text-white">
      <span className="z-10 flex shrink-0 items-center gap-1.5 bg-brand-700/40 px-3 py-1 text-xs font-bold uppercase tracking-wide backdrop-blur-sm">
        <Megaphone size={14} />
        News
      </span>
      <div className="relative flex-1 overflow-hidden whitespace-nowrap">
        <div className="marquee-track inline-flex w-max">
          <span className="px-6 text-sm font-medium">{text}</span>
          <span className="px-6 text-sm font-medium">{text}</span>
        </div>
      </div>
    </div>
  );
}
