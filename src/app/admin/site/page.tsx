import { getAdminSiteControls } from "@/lib/queries";
import { updateMarqueeAction } from "@/app/actions/admin";

export const dynamic = "force-dynamic";

export default async function AdminSitePage() {
  const { settings, activeUsers } = await getAdminSiteControls();
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900">Site Controls</h1>
      <p className="mt-1 text-slate-500">Update the announcement marquee and see recently active signed-in visitors.</p>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <form action={updateMarqueeAction} className="rounded-2xl border border-slate-100 bg-white p-5">
          <label className="text-sm font-semibold text-slate-700">News marquee text<textarea name="marqueeText" defaultValue={settings.marqueeText} required maxLength={240} rows={4} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 font-normal" /></label>
          <button type="submit" className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">Save marquee</button>
        </form>
        <section className="rounded-2xl border border-slate-100 bg-white p-5"><h2 className="font-bold text-slate-900">Live signed-in visitors</h2><p className="mt-1 text-3xl font-extrabold text-brand-600">{activeUsers.length}</p><p className="text-xs text-slate-500">Active in the last 5 minutes</p><ul className="mt-4 grid gap-2">{activeUsers.length ? activeUsers.map((visitor) => <li key={visitor.id} className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"><span>{visitor.name}</span><span className="text-xs text-slate-500">{visitor.role}</span></li>) : <li className="text-sm text-slate-500">No signed-in visitors right now.</li>}</ul></section>
      </div>
      <p className="mt-5 text-xs text-slate-400">Visitor tracking currently covers authenticated activity through the existing activity heartbeat; anonymous visitor analytics requires a separate analytics integration.</p>
    </div>
  );
}
