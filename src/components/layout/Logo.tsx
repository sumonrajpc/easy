import Link from "next/link";
import Image from "next/image";
import { GraduationCap } from "lucide-react";

export default function Logo({
  logoUrl,
  siteName = "EasySkillBD",
  size = "md",
}: {
  logoUrl?: string;
  siteName?: string;
  size?: "sm" | "md" | "lg";
}) {
  const dims = size === "lg" ? 48 : size === "sm" ? 32 : 40;
  const textSize =
    size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-xl";

  return (
    <Link href="/" className="flex items-center gap-2.5 shrink-0">
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={siteName}
          width={dims}
          height={dims}
          className="rounded-xl object-cover"
        />
      ) : (
        <span
          className="gradient-brand flex items-center justify-center rounded-xl text-white shadow-lg shadow-brand-600/30"
          style={{ width: dims, height: dims }}
        >
          <GraduationCap size={dims * 0.58} />
        </span>
      )}
      <span className={`font-extrabold tracking-tight text-slate-900 ${textSize}`}>
        Easy<span className="text-gradient-brand">Skill</span>
        <span className="text-brand-600">BD</span>
      </span>
    </Link>
  );
}
