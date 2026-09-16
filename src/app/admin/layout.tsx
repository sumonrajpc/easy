import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import PortalShell, { type NavItem } from "@/components/layout/PortalShell";
import ActivityPing from "@/components/ActivityPing";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/admin");
  if (user.role !== "ADMIN") redirect("/dashboard");

  const navItems: NavItem[] = [
    { label: "Overview", href: "/admin", icon: "LayoutDashboard" },
    { label: "Courses", href: "/admin/courses", icon: "BookOpen" },
    { label: "Students", href: "/admin/users", icon: "Users" },
    { label: "Payments", href: "/admin/payments", icon: "FileText" },
  ];

  return (
    <PortalShell
      navItems={navItems}
      user={{ name: user.name, email: user.email, role: user.role }}
      roleLabel="Admin"
    >
      <ActivityPing />
      {children}
    </PortalShell>
  );
}
