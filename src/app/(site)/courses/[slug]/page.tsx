import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  PlayCircle,
  Lock,
  Clock,
  Video,
  Award,
  BarChart3,
  BookOpen,
} from "lucide-react";
import { getCourseBySlug } from "@/lib/queries";
import { getSiteSettings } from "@/lib/settings";
import { getCurrentUser } from "@/lib/auth";
import StarRating from "@/components/StarRating";
import CheckoutModal from "@/components/CheckoutModal";
import { formatBDT, initials, timeAgo } from "@/lib/utils";
import ReviewForm from "@/components/ReviewForm";
import { db } from "@/db";
import { enrollments } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCourseBySlug(slug);
  if (!data || !data.course.isPublished) notFound();

  const [user, settings] = await Promise.all([getCurrentUser(), getSiteSettings()]);
  const { course, instructor, modules, reviews, studentCount, avgRating } = data;

  let isEnrolled = false;
  if (user) {
    const rows = await db
      .select()
      .from(enrollments)
      .where(and(eq(enrollments.userId, user.id), eq(enrollments.courseId, course.id)))
      .limit(1);
    isEnrolled = rows.length > 0;
  }

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);

  return (
    <div>
      <section className="bg-slate-950 py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="lg:col-span-2">
            <div className="mb-3 flex flex-wrap gap-2">
              {course.category && (
                <span className="rounded-full bg-brand-500/20 px-3 py-1 text-xs font-bold text-brand-300">
                  {course.category}
                </span>
              )}
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
                {course.level}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              {course.title}
            </h1>
            <p className="mt-4 max-w-2xl text-slate-300">{course.excerpt}</p>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-300">
              <StarRating rating={avgRating} />
              <span>({reviews.length} reviews)</span>
              <span>&middot;</span>
              <span>{studentCount} students enrolled</span>
            </div>

            {instructor && (
              <div className="mt-5 flex items-center gap-3">
                <span className="gradient-brand flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white">
                  {initials(instructor.name)}
                </span>
                <div>
                  <p className="text-sm text-slate-400">Instructor</p>
                  <p className="font-semibold text-white">{instructor.name}</p>
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-1.5">
              {(course.techStack ?? []).map((t) => (
                <span key={t} className="rounded-md bg-white/10 px-2.5 py-1 text-xs font-semibold text-white">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:row-span-2">
            <div className="sticky top-24 overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="relative h-48 w-full">
                {course.thumbnail ? (
                  <Image src={course.thumbnail} alt={course.title} fill className="object-cover" />
                ) : (
                  <div className="gradient-brand h-full w-full" />
                )}
              </div>
              <div className="p-6">
                <p className="mb-4 text-3xl font-extrabold text-brand-700">
                  {formatBDT(course.price)}
                </p>

                {isEnrolled ? (
                  <Link
                    href={`/dashboard/courses/${course.slug}`}
                    className="gradient-brand block w-full rounded-xl px-6 py-3.5 text-center font-bold text-white shadow-lg"
                  >
                    Go to Course Player
                  </Link>
                ) : (
                  <CheckoutModal
                    courseId={course.id}
                    title={course.title}
                    price={course.price}
                    bkashNumber={settings.bkashNumber}
                    nagadNumber={settings.nagadNumber}
                    isLoggedIn={!!user}
                  />
                )}

                <ul className="mt-6 space-y-3 text-sm text-slate-600">
                  <li className="flex items-center gap-2.5">
                    <Video size={16} className="text-brand-600" /> {totalLessons} video lessons
                  </li>
                  <li className="flex items-center gap-2.5">
                    <BarChart3 size={16} className="text-brand-600" /> Level: {course.level}
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Clock size={16} className="text-brand-600" /> Lifetime access
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Award size={16} className="text-brand-600" /> Certificate of completion
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:grid lg:grid-cols-3 lg:gap-10 lg:px-8">
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Course Description</h2>
          <p className="mb-10 whitespace-pre-line leading-relaxed text-slate-600">
            {course.description}
          </p>

          <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-slate-900">
            <BookOpen size={22} className="text-brand-600" /> Curriculum
          </h2>
          <div className="mb-10 space-y-3">
            {modules.length === 0 && (
              <p className="text-slate-400">Curriculum coming soon.</p>
            )}
            {modules.map((m, i) => (
              <details key={m.id} open={i === 0} className="group rounded-xl border border-slate-200 bg-white">
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 font-semibold text-slate-800">
                  <span>{i + 1}. {m.title}</span>
                  <span className="text-xs font-medium text-slate-400">{m.lessons.length} lessons</span>
                </summary>
                <div className="divide-y divide-slate-100 border-t border-slate-100">
                  {m.lessons.map((l) => (
                    <div key={l.id} className="flex items-center justify-between px-5 py-3 text-sm">
                      <span className="flex items-center gap-2.5 text-slate-600">
                        {l.isFreePreview ? (
                          <PlayCircle size={16} className="text-emerald-500" />
                        ) : (
                          <Lock size={16} className="text-slate-300" />
                        )}
                        {l.title}
                      </span>
                      {l.isFreePreview && (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-600">
                          Free Preview
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>

          <h2 className="mb-4 text-2xl font-bold text-slate-900">Student Reviews</h2>
          <div className="mb-6 space-y-4">
            {reviews.length === 0 && <p className="text-slate-400">No reviews yet. Be the first!</p>}
            {reviews.map((r) => (
              <div key={r.id} className="rounded-xl border border-slate-100 bg-white p-5">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="gradient-brand flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white">
                      {initials(r.userName ?? "S")}
                    </span>
                    <p className="font-semibold text-slate-800">{r.userName}</p>
                  </div>
                  <span className="text-xs text-slate-400">{timeAgo(r.createdAt)}</span>
                </div>
                <StarRating rating={r.rating} showValue={false} />
                <p className="mt-2 text-sm text-slate-600">{r.comment}</p>
              </div>
            ))}
          </div>

          {isEnrolled && <ReviewForm courseId={course.id} />}
        </div>

        <aside className="mt-10 lg:mt-0">
          {instructor && (
            <div className="rounded-2xl border border-slate-100 bg-white p-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                About the Instructor
              </p>
              <div className="mb-3 flex items-center gap-3">
                <span className="gradient-brand flex h-12 w-12 items-center justify-center rounded-full text-base font-bold text-white">
                  {initials(instructor.name)}
                </span>
                <p className="font-bold text-slate-900">{instructor.name}</p>
              </div>
              <p className="text-sm text-slate-500">{instructor.bio}</p>
            </div>
          )}
        </aside>
      </section>
    </div>
  );
}
