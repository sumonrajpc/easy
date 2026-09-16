import { CheckCircle2, AlertCircle } from "lucide-react";

export default function FormMessage({
  state,
}: {
  state: { error?: string; success?: string } | null;
}) {
  if (!state) return null;
  if (state.error) {
    return (
      <div className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
        <AlertCircle size={18} className="mt-0.5 shrink-0" />
        <span>{state.error}</span>
      </div>
    );
  }
  if (state.success) {
    return (
      <div className="flex items-start gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
        <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
        <span>{state.success}</span>
      </div>
    );
  }
  return null;
}
