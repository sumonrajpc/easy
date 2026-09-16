import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth";
import { getEnrolledCoursesWithProgress } from "@/lib/queries";
import { formatBDT } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function MyCoursesPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const enrolled = await getEnrolledCoursesWithProgress(user.id);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900">My Courses</h1>
      <p className="mt-1 text-slate-500">All courses you are currently enrolled in.</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {enrolled.map((e) => (
          <div key={e.enrollmentId} className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
            <div className="relative h-36 w-full">
              {e.course.thumbnail ? (
                <Image src={e.course.thumbnail} alt={e.course.title} fill className="object-cover" />
              ) : (
                <div className="gradient-brand h-full w-full" />
              )}
            </div>
            <div className="p-4">
              <p className="mb-2 line-clamp-1 font-bold text-slate-900">{e.course.title}</p>
              <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="gradient-brand h-full rounded-full" style={{ width: `${e.percent}%` }} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{e.percent}% complete &middot; {formatBDT(e.course.price)}</span>
              </div>
              <Link
                href={`/dashboard/courses/${e.course.slug}`}
                className="gradient-brand mt-3 block rounded-xl py-2 text-center text-sm font-bold text-white"
              >
                {e.percent === 100 ? "Review Course" : "Continue Learning"}
              </Link>
            </div>
          </div>
        ))}
        {enrolled.length === 0 && (
          <p className="text-slate-400">You haven&apos;t enrolled in any course yet.</p>
        )}
      </div>
    </div>
  );
}
