"use client";
import { useState } from "react";
import { updateSiteSettingsAction } from "@/app/actions/admin";

export default function LogoUploadForm({ currentUrl }: { currentUrl: string }) {
  const [url, setUrl] = useState(currentUrl);
  const [status, setStatus] = useState("");
  async function upload(file: File) {
    setStatus("Uploading...");
    const body = new FormData(); body.append("file", file);
    const response = await fetch("/api/admin/site/logo", { method: "POST", body });
    const result = await response.json();
    if (!response.ok) { setStatus(result.error ?? "Upload failed"); return; }
    setUrl(result.url);
    const settings = new FormData(); settings.append("logoUrl", result.url);
    await updateSiteSettingsAction(null, settings);
    setStatus("Logo saved.");
  }
  return <div className="rounded-2xl border border-slate-100 bg-white p-5"><h2 className="font-bold text-slate-900">Site logo</h2><p className="mt-1 text-sm text-slate-500">Upload a PNG, JPG, or WebP logo up to 2MB.</p><div className="mt-4 flex items-center gap-4"><div className="flex size-16 items-center justify-center overflow-hidden rounded-xl bg-slate-100">{url ? <img src={url} alt="Current site logo" className="size-full object-cover" /> : <span className="text-xs text-slate-400">No logo</span>}</div><label className="cursor-pointer rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">Choose image<input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); }} /></label></div>{status && <p className="mt-3 text-sm text-slate-500">{status}</p>}</div>;
}
