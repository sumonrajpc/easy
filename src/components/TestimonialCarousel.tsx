"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import StarRating from "./StarRating";
import { initials } from "@/lib/utils";

export type Testimonial = {
  id: number;
  name: string;
  rating: number;
  comment: string;
  courseTitle: string;
};

export default function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [items.length]);

  if (items.length === 0) return null;

  const next = () => setIndex((i) => (i + 1) % items.length);
  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const current = items[index];

  return (
    <div className="relative mx-auto max-w-2xl">
      <div className="animate-fade-in rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-xl shadow-slate-200/60" key={current.id}>
        <Quote className="mx-auto mb-4 text-brand-300" size={36} />
        <p className="mb-5 text-lg font-medium leading-relaxed text-slate-700">
          &ldquo;{current.comment}&rdquo;
        </p>
        <div className="mb-3 flex justify-center">
          <StarRating rating={current.rating} />
        </div>
        <div className="flex items-center justify-center gap-3">
          <span className="gradient-brand flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white">
            {initials(current.name)}
          </span>
          <div className="text-left">
            <p className="font-bold text-slate-900">{current.name}</p>
            <p className="text-xs text-slate-500">{current.courseTitle}</p>
          </div>
        </div>
      </div>

      {items.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 hidden -translate-x-6 -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2.5 shadow-lg hover:text-brand-600 sm:flex"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-6 rounded-full border border-slate-200 bg-white p-2.5 shadow-lg hover:text-brand-600 sm:flex"
          >
            <ChevronRight size={20} />
          </button>
          <div className="mt-6 flex justify-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-brand-600" : "w-2 bg-slate-300"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
