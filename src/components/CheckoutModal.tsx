"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Smartphone, Copy, CheckCircle2 } from "lucide-react";
import { submitPaymentAction, type FormState } from "@/app/actions/courses";
import { formatBDT } from "@/lib/utils";
import SubmitButton from "./SubmitButton";
import FormMessage from "./FormMessage";

export default function CheckoutModal({
  courseId,
  title,
  price,
  bkashNumber,
  nagadNumber,
  isLoggedIn,
}: {
  courseId: number;
  title: string;
  price: string;
  bkashNumber: string;
  nagadNumber: string;
  isLoggedIn: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState<"BKASH" | "NAGAD">("BKASH");
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const [state, formAction] = useActionState<FormState, FormData>(
    submitPaymentAction,
    null,
  );

  const merchantNumber = method === "BKASH" ? bkashNumber : nagadNumber;

  function openModal() {
    if (!isLoggedIn) {
      router.push("/login?redirect=/courses");
      return;
    }
    setOpen(true);
  }

  function copyNumber() {
    navigator.clipboard.writeText(merchantNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <>
      <button
        onClick={openModal}
        className="gradient-brand w-full rounded-xl px-6 py-3.5 text-center font-bold text-white shadow-lg shadow-brand-600/30 transition hover:shadow-xl"
      >
        Enroll Now &mdash; {formatBDT(price)}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Complete Your Enrollment</h3>
                <p className="mt-0.5 line-clamp-1 text-sm text-slate-500">{title}</p>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-full p-1.5 hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            {state?.success ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <CheckCircle2 size={48} className="text-emerald-500" />
                <p className="font-semibold text-slate-800">{state.success}</p>
                <button
                  onClick={() => setOpen(false)}
                  className="mt-2 rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white"
                >
                  Close
                </button>
              </div>
            ) : (
              <form action={formAction} className="space-y-4">
                <input type="hidden" name="courseId" value={courseId} />

                <div className="grid grid-cols-2 gap-3">
                  {(["BKASH", "NAGAD"] as const).map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setMethod(m)}
                      className={`flex items-center justify-center gap-2 rounded-xl border-2 py-3 font-bold transition ${
                        method === m
                          ? m === "BKASH"
                            ? "border-pink-500 bg-pink-50 text-pink-600"
                            : "border-orange-500 bg-orange-50 text-orange-600"
                          : "border-slate-200 text-slate-500"
                      }`}
                    >
                      <Smartphone size={16} />
                      {m === "BKASH" ? "bKash" : "Nagad"}
                    </button>
                  ))}
                </div>
                <input type="hidden" name="method" value={method} />

                <div className="rounded-xl bg-slate-50 p-4 text-sm">
                  <p className="mb-2 text-slate-600">
                    Send <strong>{formatBDT(price)}</strong> to this{" "}
                    <strong>{method === "BKASH" ? "bKash" : "Nagad"}</strong> Personal number
                    using &ldquo;Send Money&rdquo;:
                  </p>
                  <div className="flex items-center justify-between rounded-lg border border-dashed border-slate-300 bg-white px-3 py-2">
                    <span className="text-lg font-bold tracking-wider text-slate-800">
                      {merchantNumber}
                    </span>
                    <button
                      type="button"
                      onClick={copyNumber}
                      className="flex items-center gap-1 text-xs font-semibold text-brand-600"
                    >
                      <Copy size={14} /> {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Your {method === "BKASH" ? "bKash" : "Nagad"} Number
                  </label>
                  <input
                    name="senderNumber"
                    required
                    placeholder="01XXXXXXXXX"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Transaction ID (TrxID)
                  </label>
                  <input
                    name="trxId"
                    required
                    placeholder="e.g. 8N7K2M9P1Q"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  />
                </div>

                <FormMessage state={state} />

                <SubmitButton className="gradient-brand w-full rounded-xl py-3 font-bold text-white shadow-lg">
                  Confirm Payment
                </SubmitButton>
                <p className="text-center text-xs text-slate-400">
                  Your enrollment will be activated once our team verifies the payment
                  (usually within a few hours).
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
