"use client";

import { useState } from "react";
import { PlayCircle, X } from "lucide-react";
import { getYoutubeEmbedUrl } from "@/lib/utils";

export default function HeroVideoModal({ videoUrl, label }: { videoUrl: string; label: string }) {
  const [open, setOpen] = useState(false);
  const embed = getYoutubeEmbedUrl(videoUrl);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border-2 border-slate-200 bg-white px-6 py-3 font-bold text-slate-700 shadow-sm transition hover:border-brand-400 hover:text-brand-600"
      >
        <PlayCircle size={22} className="text-brand-600" />
        {label}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative aspect-video w-full max-w-3xl overflow-hidden rounded-2xl bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30"
            >
              <X size={20} />
            </button>
            {embed ? (
              <iframe
                src={`${embed}?autoplay=1`}
                title="Promo video"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-white">
                Video not available
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
