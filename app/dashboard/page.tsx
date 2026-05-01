import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, Wrench, User, ArrowRight } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const agency = await prisma.agency.findUnique({
    where: { userId: session!.user!.id },
    include: { projects: true, services: true, categories: true },
  });

  const statusVariant = {
    PENDING: "warning" as const,
    APPROVED: "success" as const,
    REJECTED: "destructive" as const,
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            Welcome back, {session?.user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-slate-500 mt-1">Manage your agency profile, portfolio, and services.</p>
        </div>
        {agency && (
          <Link href={`/agencies/${agency.slug}`} target="_blank">
            <Button variant="outline" size="sm">
              View public profile <ArrowRight size={14} />
            </Button>
          </Link>
        )}
      </div>

      {/* Status card */}
      {agency && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">Agency status</p>
            <p className="font-semibold text-slate-900">{agency.name}</p>
          </div>
          <Badge variant={statusVariant[agency.status]}>
            {agency.status === "PENDING" && "⏳ Under review"}
            {agency.status === "APPROVED" && "✅ Live"}
            {agency.status === "REJECTED" && "❌ Rejected"}
          </Badge>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Projects", value: agency?.projects.length ?? 0, icon: FolderOpen, href: "/dashboard/portfolio" },
          { label: "Services", value: agency?.services.length ?? 0, icon: Wrench, href: "/dashboard/services" },
          { label: "Categories", value: agency?.categories.length ?? 0, icon: User, href: "/dashboard/profile" },
        ].map((s) => (
          <Link key={s.label} href={s.href}>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-blue-200 hover:shadow-sm transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <s.icon size={20} className="text-blue-600" />
                </div>
                <span className="text-sm font-medium text-slate-500">{s.label}</span>
              </div>
              <p className="text-3xl font-bold text-slate-900">{s.value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900 mb-4">Quick actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link href="/dashboard/profile">
            <Button variant="outline" className="w-full justify-start gap-2">
              <User size={16} /> Edit profile
            </Button>
          </Link>
          <Link href="/dashboard/portfolio">
            <Button variant="outline" className="w-full justify-start gap-2">
              <FolderOpen size={16} /> Add project
            </Button>
          </Link>
          <Link href="/dashboard/services">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Wrench size={16} /> Add service
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
