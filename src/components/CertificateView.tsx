"use client";

import { useRef, useState } from "react";
import { Download, GraduationCap } from "lucide-react";

export default function CertificateView({
  studentName,
  courseTitle,
  instructorName,
  code,
  issuedAt,
}: {
  studentName: string;
  courseTitle: string;
  instructorName: string;
  code: string;
  issuedAt: string;
}) {
  const certRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  async function downloadPdf() {
    if (!certRef.current) return;
    setLoading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      const canvas = await html2canvas(certRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [canvas.width, canvas.height] });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`EasySkillBD-Certificate-${code}.pdf`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-5 flex items-center justify-between no-print">
        <h1 className="text-2xl font-extrabold text-slate-900">Your Certificate</h1>
        <button
          onClick={downloadPdf}
          disabled={loading}
          className="gradient-brand flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-lg disabled:opacity-60"
        >
          <Download size={16} /> {loading ? "Preparing..." : "Download PDF"}
        </button>
      </div>

      <div
        ref={certRef}
        className="relative overflow-hidden border-[10px] border-brand-600 bg-white p-10 sm:p-14"
        style={{ aspectRatio: "1.414 / 1" }}
      >
        <div className="pointer-events-none absolute -left-10 -top-10 h-52 w-52 rounded-full bg-brand-100" />
        <div className="pointer-events-none absolute -bottom-14 -right-14 h-60 w-60 rounded-full bg-accent-500/10" />

        <div className="relative flex h-full flex-col items-center justify-between text-center">
          <div>
            <div className="mb-3 flex items-center justify-center gap-2">
              <span className="gradient-brand flex h-10 w-10 items-center justify-center rounded-xl text-white">
                <GraduationCap size={22} />
              </span>
              <span className="text-xl font-extrabold text-slate-900">
                Easy<span className="text-gradient-brand">Skill</span>
                <span className="text-brand-600">BD</span>
              </span>
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
              Certificate of Completion
            </p>
          </div>

          <div>
            <p className="mb-2 text-sm text-slate-500">This certificate is proudly presented to</p>
            <p className="mb-4 text-3xl font-extrabold text-gradient-brand sm:text-4xl">{studentName}</p>
            <p className="mx-auto max-w-lg text-sm text-slate-600 sm:text-base">
              for successfully completing the online course
            </p>
            <p className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">&ldquo;{courseTitle}&rdquo;</p>
          </div>

          <div className="flex w-full items-end justify-between text-left">
            <div>
              <p className="text-xs text-slate-400">Certificate ID</p>
              <p className="text-sm font-bold text-slate-700">{code}</p>
            </div>
            <div className="text-center">
              <p className="mb-1 border-t-2 border-slate-300 pt-1 text-sm font-bold text-slate-700">
                {instructorName}
              </p>
              <p className="text-xs text-slate-400">Instructor</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Issued On</p>
              <p className="text-sm font-bold text-slate-700">
                {new Date(issuedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
