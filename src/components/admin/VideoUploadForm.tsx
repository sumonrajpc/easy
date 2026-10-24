"use client";

import { useState } from "react";

export function VideoUploadForm({ courseId, currentUrl }: { courseId: number; currentUrl: string | null }) {
  const [status, setStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) return setStatus("Choose a video first.");

    setUploading(true);
    setStatus("Uploading video…");
    const body = new FormData();
    body.append("courseId", String(courseId));
    body.append("file", file);
    const response = await fetch("/api/admin/courses/video", { method: "POST", body });
    const result = await response.json().catch(() => ({}));
    setUploading(false);
    if (!response.ok) return setStatus(result.error || "Upload failed.");
    setStatus("Video uploaded and saved.");
    form.reset();
    window.location.reload();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <label className="text-xs font-semibold text-slate-600">
          Upload promo video
          <input name="file" type="file" accept="video/*" className="mt-1 block max-w-full text-xs" disabled={uploading} />
        </label>
        <button type="submit" disabled={uploading} className="rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">
          {uploading ? "Uploading…" : "Upload video"}
        </button>
        {currentUrl && <a href={currentUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-brand-700">View current video</a>}
      </div>
      <p className="mt-2 text-xs text-slate-400">MP4/WebM/MOV up to 500 MB.</p>
      {status && <p role="status" className="mt-2 text-xs font-semibold text-slate-600">{status}</p>}
    </form>
  );
}
