import { redirect } from "next/navigation";
import { LayoutDashboard, BookOpen, ClipboardList, Award } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import PortalShell from "@/components/layout/PortalShell";
import ActivityPing from "@/components/ActivityPing";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/dashboard");

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Courses", href: "/dashboard/my-courses", icon: BookOpen },
    { label: "Assignments", href: "/dashboard/assignments", icon: ClipboardList },
    { label: "Certificates", href: "/dashboard/certificates", icon: Award },
  ];

  return (
    <PortalShell
      navItems={navItems}
      user={{ name: user.name, email: user.email, role: user.role }}
      roleLabel="Student"
    >
      <ActivityPing />
      {children}
    </PortalShell>
  );
}
