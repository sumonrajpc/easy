import Link from "next/link";
import { Users, GraduationCap, BookOpen, TrendingUp, Wallet, Clock } from "lucide-react";
import { getAdminOverview, getRecentEnrollments } from "@/lib/queries";

export const dynamic = "force-dynamic";

function formatBDT(n: number) {
  return "৳" + n.toLocaleString("en-US");
}

export default async function AdminOverviewPage() {
  const [stats, recent] = await Promise.all([getAdminOverview(), getRecentEnrollments(8)]);

  const cards = [
    { label: "Students", value: stats.studentTotal, icon: Users, color: "bg-brand-50 text-brand-600" },
    { label: "Instructors", value: stats.instructorTotal, icon: GraduationCap, color: "bg-indigo-50 text-indigo-600" },
    { label: "Courses", value: `${stats.publishedTotal}/${stats.courseTotal}`, icon: BookOpen, color: "bg-emerald-50 text-emerald-600" },
    { label: "Enrollments", value: stats.enrollmentTotal, icon: TrendingUp, color: "bg-amber-50 text-amber-600" },
    { label: "Revenue (approved)", value: formatBDT(stats.approvedRevenue), icon: Wallet, color: "bg-teal-50 text-teal-600" },
    { label: "Pending Payments", value: stats.pendingPayments, icon: Clock, color: "bg-rose-50 text-rose-600" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900">Admin Overview</h1>
      <p className="mt-1 text-slate-500">Platform-wide summary of EasySkillBD.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="rounded-2xl border border-slate-100 bg-white p-5">
              <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${c.color}`}>
                <Icon size={20} />
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{c.value}</p>
              <p className="text-sm text-slate-500">{c.label}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Recent Enrollments</h2>
        {stats.pendingPayments > 0 && (
          <Link href="/admin/payments" className="text-sm font-semibold text-brand-600">
            Review {stats.pendingPayments} pending payment{stats.pendingPayments > 1 ? "s" : ""}
          </Link>
        )}
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100 bg-white">
        {recent.length === 0 ? (
          <p className="p-8 text-center text-slate-500">No enrollments yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Student</th>
                <th className="px-5 py-3 font-semibold">Course</th>
                <th className="px-5 py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r) => (
                <tr key={r.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-3 font-semibold text-slate-800">{r.studentName ?? "—"}</td>
                  <td className="px-5 py-3 text-slate-600">{r.courseTitle ?? "—"}</td>
                  <td className="px-5 py-3 text-slate-500">
                    {r.enrolledAt ? new Date(r.enrolledAt).toLocaleDateString("en-GB") : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
