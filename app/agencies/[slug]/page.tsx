import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Globe, Mail, Phone, MapPin, Users, Calendar, ExternalLink, ArrowLeft, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const agency = await prisma.agency.findUnique({ where: { slug } });
  if (!agency) return { title: "Agency not found" };

  return {
    title: `${agency.name} – EmpireExperts`,
    description: agency.tagline || agency.description || "",
  };
}

export default async function AgencyProfilePage({ params }: Props) {
  const { slug } = await params;

  const agency = await prisma.agency.findUnique({
    where: { slug, status: "APPROVED" },
    include: { categories: true, projects: true, services: true },
  });

  if (!agency) notFound();

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Cover */}
      <div className="h-56 bg-gradient-to-br from-blue-600 to-slate-800 relative">
        {agency.coverImage && (
          <img src={agency.coverImage} alt={agency.name} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 -mt-8 relative mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Logo */}
            <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0 -mt-14 shadow-md">
              {agency.logo ? (
                <img src={agency.logo} alt={agency.name} className="w-full h-full object-cover" />
              ) : (
                <Briefcase size={32} className="text-blue-600" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                      {agency.name}
                    </h1>
                    {agency.featured && <Badge className="bg-amber-100 text-amber-700">⭐ Featured</Badge>}
                  </div>
                  {agency.tagline && (
                    <p className="text-slate-500 mt-1 text-lg">{agency.tagline}</p>
                  )}
                </div>

                {agency.website && (
                  <a href={agency.website} target="_blank" rel="noopener noreferrer">
                    <Button>
                      Visit website <ExternalLink size={14} />
                    </Button>
                  </a>
                )}
              </div>

              {/* Meta info */}
              <div className="flex flex-wrap gap-5 mt-5 text-sm text-slate-500">
                {(agency.location || agency.country) && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} /> {agency.location}{agency.country ? `, ${agency.country}` : ""}
                  </span>
                )}
                {agency.founded && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} /> Founded {agency.founded}
                  </span>
                )}
                {agency.teamSize && (
                  <span className="flex items-center gap-1.5">
                    <Users size={14} /> {agency.teamSize}
                  </span>
                )}
                {agency.email && (
                  <a href={`mailto:${agency.email}`} className="flex items-center gap-1.5 hover:text-blue-600">
                    <Mail size={14} /> {agency.email}
                  </a>
                )}
                {agency.website && (
                  <a href={agency.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-blue-600">
                    <Globe size={14} /> Website
                  </a>
                )}
                {agency.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone size={14} /> {agency.phone}
                  </span>
                )}
              </div>

              {/* Categories */}
              {agency.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {agency.categories.map((c: { id: string; name: string }) => (
                    <Badge key={c.id} variant="secondary">{c.name}</Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-16">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            {agency.description && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>About</h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{agency.description}</p>
              </div>
            )}

            {/* Portfolio */}
            {agency.projects.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                  Portfolio ({agency.projects.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {agency.projects.map((p) => (
                    <div key={p.id} className="border border-slate-200 rounded-xl overflow-hidden group">
                      {p.image && (
                        <div className="h-40 overflow-hidden bg-slate-100">
                          <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-slate-900 text-sm">{p.title}</h3>
                          {p.url && (
                            <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 flex-shrink-0">
                              <ExternalLink size={14} />
                            </a>
                          )}
                        </div>
                        {p.description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{p.description}</p>}
                        {p.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {p.tags.map((t) => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar — Services */}
          <div className="space-y-6">
            {agency.services.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Services</h2>
                <div className="space-y-4">
                  {agency.services.map((s) => (
                    <div key={s.id} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900 text-sm">{s.title}</h3>
                        {s.price && (
                          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full flex-shrink-0">
                            {s.price}
                          </span>
                        )}
                      </div>
                      {s.description && <p className="text-xs text-slate-500 line-clamp-2">{s.description}</p>}
                    </div>
                  ))}
                </div>

                {agency.email && (
                  <a href={`mailto:${agency.email}`} className="block mt-6">
                    <Button className="w-full">Get in touch</Button>
                  </a>
                )}
              </div>
            )}

            <Link href="/agencies" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors">
              <ArrowLeft size={14} /> Back to directory
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
