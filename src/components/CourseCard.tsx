import Image from "next/image";
import Link from "next/link";
import { Users, Sparkles } from "lucide-react";
import StarRating from "./StarRating";
import { formatBDT } from "@/lib/utils";

export type CourseCardData = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  thumbnail: string | null;
  price: string;
  category: string | null;
  level: string | null;
  techStack: string[] | null;
  rating: number;
  reviewCount: number;
  studentCount: number;
  instructorName?: string;
};

export default function CourseCard({ course }: { course: CourseCardData }) {
  return (
    <div className="glow-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300">
      <div className="relative h-44 w-full overflow-hidden">
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="gradient-brand flex h-full w-full items-center justify-center text-white">
            <Sparkles size={36} />
          </div>
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          {course.category && (
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-brand-700 shadow">
              {course.category}
            </span>
          )}
        </div>
        <div className="absolute right-3 top-3">
          <span className="gradient-brand rounded-full px-3 py-1 text-xs font-bold text-white shadow-lg">
            {course.level}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {(course.techStack ?? []).slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600"
            >
              {tech}
            </span>
          ))}
        </div>

        <h3 className="mb-1.5 line-clamp-2 text-base font-bold leading-snug text-slate-900 group-hover:text-brand-700">
          {course.title}
        </h3>
        <p className="mb-3 line-clamp-2 text-sm text-slate-500">{course.excerpt}</p>

        <div className="mb-3 flex items-center justify-between">
          <StarRating rating={course.rating} />
          <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
            <Users size={13} /> {course.studentCount}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-lg font-extrabold text-brand-700">
            {formatBDT(course.price)}
          </span>
          <Link
            href={`/courses/${course.slug}`}
            className="gradient-brand rounded-full px-4 py-2 text-xs font-bold text-white shadow-md transition hover:shadow-lg"
          >
            Enroll Now
          </Link>
        </div>
      </div>
    </div>
  );
}
