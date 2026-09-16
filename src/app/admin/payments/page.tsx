import { getAllPayments } from "@/lib/queries";
import { approvePaymentAction, rejectPaymentAction } from "@/app/actions/admin";

export const dynamic = "force-dynamic";

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  APPROVED: "bg-emerald-50 text-emerald-700",
  REJECTED: "bg-rose-50 text-rose-700",
};

export default async function AdminPaymentsPage() {
  const payments = await getAllPayments();

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900">Payments</h1>
      <p className="mt-1 text-slate-500">Review and approve manual bKash / Nagad payments.</p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-100 bg-white">
        {payments.length === 0 ? (
          <p className="p-8 text-center text-slate-500">No payments submitted yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Student</th>
                <th className="px-4 py-3 font-semibold">Course</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Method</th>
                <th className="px-4 py-3 font-semibold">Sender</th>
                <th className="px-4 py-3 font-semibold">TrxID</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-800">{p.studentName ?? "—"}</p>
                    <p className="text-xs text-slate-400">{p.studentEmail ?? ""}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{p.courseTitle ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600">৳{Number(p.amount).toLocaleString("en-US")}</td>
                  <td className="px-4 py-3 text-slate-600">{p.method}</td>
                  <td className="px-4 py-3 text-slate-600">{p.senderNumber}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{p.trxId}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusStyles[p.status] ?? ""}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {p.status === "PENDING" ? (
                      <div className="flex gap-2">
                        <form action={approvePaymentAction}>
                          <input type="hidden" name="paymentId" value={p.id} />
                          <button
                            type="submit"
                            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                          >
                            Approve
                          </button>
                        </form>
                        <form action={rejectPaymentAction}>
                          <input type="hidden" name="paymentId" value={p.id} />
                          <button
                            type="submit"
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Reject
                          </button>
                        </form>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">Reviewed</span>
                    )}
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
