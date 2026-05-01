import Link from "next/link";
import { ArrowRight, Star, Users, Briefcase, Shield, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";

async function getFeaturedAgencies() {
  try {
    return await prisma.agency.findMany({
      where: { status: "APPROVED" },
      include: { services: true, categories: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: 6,
    });
  } catch {
    return [];
  }
}

const categories = [
  { label: "Shopify Development", slug: "shopify", icon: "🛒" },
  { label: "Marketing & SEO", slug: "marketing", icon: "📈" },
  { label: "Design & Branding", slug: "design", icon: "🎨" },
  { label: "Email Marketing", slug: "email", icon: "✉️" },
  { label: "Paid Ads", slug: "ads", icon: "📣" },
  { label: "Automation", slug: "automation", icon: "⚙️" },
];

const stats = [
  { label: "Agencies Listed", value: "500+" },
  { label: "Projects Completed", value: "10k+" },
  { label: "Countries", value: "40+" },
  { label: "5-Star Reviews", value: "2k+" },
];

export default async function HomePage() {
  const agencies = await getFeaturedAgencies();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="max-w-3xl">
            <Badge className="mb-6 bg-blue-500/20 text-blue-300">
              🌍 The #1 eCommerce Agency Directory
            </Badge>
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              Discover &amp; hire{" "}
              <span className="text-blue-400">top eCommerce</span>{" "}
              agencies &amp; experts
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl">
              EmpireExperts connects you with verified Shopify agencies,
              marketing experts, and eCommerce specialists — all in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search agencies, services, location..."
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                />
              </div>
              <Link href="/agencies">
                <Button size="lg" className="bg-blue-500 hover:bg-blue-400 rounded-xl whitespace-nowrap">
                  Browse Directory <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
            <p className="text-sm text-slate-400">
              Trusted by 10,000+ brands worldwide · Free to search
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-extrabold text-blue-600 mb-1" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                  {s.value}
                </p>
                <p className="text-sm text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              Find an expert for every service
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Browse agencies by specialisation and find the perfect fit for your project.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/agencies?category=${cat.slug}`}
                className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 text-center leading-snug">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Agencies */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                Featured agencies
              </h2>
              <p className="text-slate-500">Verified experts ready to grow your business.</p>
            </div>
            <Link href="/agencies" className="hidden sm:block">
              <Button variant="outline">View all <ArrowRight size={16} /></Button>
            </Link>
          </div>

          {agencies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {agencies.map((agency) => (
                <AgencyCard key={agency.id} agency={agency} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-400 text-lg mb-4">No agencies listed yet.</p>
              <Link href="/register">
                <Button>Be the first to list</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Agency CTA */}
      <section className="bg-blue-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            Are you an eCommerce agency?
          </h2>
          <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">
            Join EmpireExperts and reach thousands of brands actively looking for agencies like yours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 rounded-xl px-10">
                List your agency — it&apos;s free
              </Button>
            </Link>
            <Link href="/agencies">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 rounded-xl px-10">
                Browse directory
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              Why EmpireExperts?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Shield size={28} className="text-blue-600" />, title: "Verified profiles", desc: "Every agency is reviewed and approved before appearing in the directory." },
              { icon: <Star size={28} className="text-blue-600" />, title: "Real portfolios", desc: "See actual projects, case studies, and services — no fluff." },
              { icon: <Users size={28} className="text-blue-600" />, title: "Global reach", desc: "Find agencies from 40+ countries across every major eCommerce specialty." },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-8 border border-slate-200">
                <div className="mb-5 inline-flex p-3 bg-blue-50 rounded-xl">{f.icon}</div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function AgencyCard({ agency }: { agency: any }) {
  return (
    <Link href={`/agencies/${agency.slug}`}>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all duration-200 h-full flex flex-col">
        <div className="h-36 bg-gradient-to-br from-blue-50 to-slate-100 relative">
          {agency.coverImage && (
            <img src={agency.coverImage} alt={agency.name} className="w-full h-full object-cover" />
          )}
          {agency.featured && (
            <Badge className="absolute top-3 right-3 bg-amber-100 text-amber-700">⭐ Featured</Badge>
          )}
        </div>
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0 -mt-8 shadow-sm">
              {agency.logo ? (
                <img src={agency.logo} alt={agency.name} className="w-full h-full object-cover" />
              ) : (
                <Briefcase size={20} className="text-blue-600" />
              )}
            </div>
            <div className="min-w-0 mt-1">
              <h3 className="font-bold text-slate-900 truncate">{agency.name}</h3>
              {agency.location && <p className="text-xs text-slate-500">{agency.location}</p>}
            </div>
          </div>
          {agency.tagline && (
            <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4 flex-1">{agency.tagline}</p>
          )}
          <div className="flex flex-wrap gap-2 mt-auto">
            {agency.categories.slice(0, 2).map((c: any) => (
              <Badge key={c.id} variant="secondary">{c.name}</Badge>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
