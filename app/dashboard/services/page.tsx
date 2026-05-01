"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

const schema = z.object({
  title: z.string().min(2, "Service title required"),
  description: z.string().optional(),
  price: z.string().optional(),
});

type FormData = z.infer<typeof schema>;
type Service = { id: string; title: string; description?: string | null; price?: string | null };

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function load() {
    const r = await fetch("/api/dashboard/services");
    setServices(await r.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function onSubmit(data: FormData) {
    await fetch("/api/dashboard/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    reset();
    setShowForm(false);
    load();
  }

  async function deleteService(id: string) {
    await fetch(`/api/dashboard/services/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Services</h1>
          <p className="text-slate-500 mt-1">List the services your agency offers to clients.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus size={16} /> Add service
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <h2 className="font-semibold text-slate-900 mb-5">New service</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input id="title" label="Service name *" placeholder="Shopify Store Development" error={errors.title?.message} {...register("title")} />
            <Textarea id="description" label="Description" placeholder="Describe what this service includes..." {...register("description")} />
            <Input id="price" label="Starting price" placeholder="From $2,000" {...register("price")} />
            <div className="flex gap-3 pt-2">
              <Button type="submit" loading={isSubmitting}>Save service</Button>
              <Button type="button" variant="ghost" onClick={() => { setShowForm(false); reset(); }}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
          <p className="text-slate-400 mb-4">No services yet. Add what your agency offers!</p>
          <Button onClick={() => setShowForm(true)}><Plus size={16} /> Add service</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-slate-900">{s.title}</h3>
                  {s.price && (
                    <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
                      {s.price}
                    </span>
                  )}
                </div>
                {s.description && <p className="text-sm text-slate-500 line-clamp-2">{s.description}</p>}
              </div>
              <button onClick={() => deleteService(s.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors flex-shrink-0">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
