import Link from "next/link";
import { Award } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getEnrolledCoursesWithProgress } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function CertificatesPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const enrolled = await getEnrolledCoursesWithProgress(user.id);
  const completed = enrolled.filter((e) => e.percent === 100);
  const inProgress = enrolled.filter((e) => e.percent < 100);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900">Certificates</h1>
      <p className="mt-1 text-slate-500">Download certificates for courses you have completed.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {completed.map((e) => (
          <div key={e.enrollmentId} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5">
            <span className="gradient-brand flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white">
              <Award size={22} />
            </span>
            <div className="flex-1">
              <p className="font-bold text-slate-900">{e.course.title}</p>
              <p className="text-xs text-slate-400">Completed &middot; 100%</p>
            </div>
            <Link href={`/dashboard/certificate/${e.course.id}`} className="gradient-brand rounded-full px-4 py-2 text-xs font-bold text-white">
              View
            </Link>
          </div>
        ))}
        {completed.length === 0 && (
          <p className="text-slate-400">No certificates yet. Finish a course to earn one!</p>
        )}
      </div>

      {inProgress.length > 0 && (
        <>
          <h2 className="mb-3 mt-8 text-lg font-bold text-slate-900">In Progress</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {inProgress.map((e) => (
              <div key={e.enrollmentId} className="rounded-2xl border border-dashed border-slate-200 bg-white p-5">
                <p className="font-bold text-slate-700">{e.course.title}</p>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="gradient-brand h-full rounded-full" style={{ width: `${e.percent}%` }} />
                </div>
                <p className="mt-1.5 text-xs font-semibold text-slate-500">{e.percent}% complete</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
