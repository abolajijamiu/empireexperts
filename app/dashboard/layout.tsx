import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, User, FolderOpen, Wrench, LogOut } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/portfolio", label: "Portfolio", icon: FolderOpen },
  { href: "/dashboard/services", label: "Services", icon: Wrench },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full">
        <div className="p-6 border-b border-slate-100">
          <Link href="/">
            <span className="text-lg font-extrabold" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              <span className="text-blue-600">Empire</span>
              <span className="text-slate-900">Experts</span>
            </span>
          </Link>
          <p className="text-xs text-slate-500 mt-1 truncate">{session.user?.email}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 w-full transition-colors"
            >
              <LogOut size={18} />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Content */}
      <div className="ml-64 flex-1 p-8">{children}</div>
    </div>
  );
}
