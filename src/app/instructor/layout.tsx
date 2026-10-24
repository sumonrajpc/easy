import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import PortalShell, { type NavItem } from "@/components/layout/PortalShell";
import ActivityPing from "@/components/ActivityPing";

export default async function InstructorLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/instructor");
  if (user.role !== "INSTRUCTOR" && user.role !== "ADMIN") redirect("/dashboard");

  const navItems: NavItem[] = [
    { label: "Overview", href: "/instructor", icon: "LayoutDashboard" },
    { label: "My Courses", href: "/instructor/courses", icon: "BookOpen" },
  ];

  return (
    <PortalShell
      navItems={navItems}
      user={{ name: user.name, email: user.email, role: user.role }}
      roleLabel="Instructor"
    >
      <ActivityPing />
      {children}
    </PortalShell>
  );
}
