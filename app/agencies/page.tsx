import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Briefcase, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function AgenciesPage({ searchParams }: Props) {
  const { category, q } = await searchParams;

  const agencies = await prisma.agency.findMany({
    where: {
      status: "APPROVED",
      ...(category && {
        categories: { some: { name: { contains: category, mode: "insensitive" } } },
      }),
      ...(q && {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { tagline: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      }),
    },
    include: { categories: true, services: true, projects: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  const allCategories = [
    "Shopify", "Marketing", "Design", "Email", "Ads", "Automation", "SEO",
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            Agency Directory
          </h1>
          <p className="text-slate-500 mb-8">
            {agencies.length} verified {agencies.length === 1 ? "agency" : "agencies"} found
          </p>

          {/* Search */}
          <form className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                name="q"
                defaultValue={q}
                type="text"
                placeholder="Search agencies..."
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="h-11 px-6 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </form>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mt-6">
            <Link
              href="/agencies"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !category ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300"
              }`}
            >
              All
            </Link>
            {allCategories.map((cat) => (
              <Link
                key={cat}
                href={`/agencies?category=${cat.toLowerCase()}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category?.toLowerCase() === cat.toLowerCase()
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300"
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {agencies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg mb-2">No agencies found.</p>
            <p className="text-slate-400 text-sm">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {agencies.map((agency) => (
              <Link key={agency.id} href={`/agencies/${agency.slug}`}>
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
                        <p className="text-xs text-slate-500">{agency.location}{agency.country ? `, ${agency.country}` : ""}</p>
                      </div>
                    </div>
                    {agency.tagline && (
                      <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">{agency.tagline}</p>
                    )}
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
                      <div className="flex flex-wrap gap-1.5">
                        {agency.categories.slice(0, 2).map((c) => (
                          <Badge key={c.id} variant="secondary">{c.name}</Badge>
                        ))}
                      </div>
                      <span className="text-xs text-slate-400">{agency.projects.length} projects</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
