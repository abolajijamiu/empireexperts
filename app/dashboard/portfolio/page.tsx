"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/ui/image-upload";
import { Plus, Trash2, ExternalLink } from "lucide-react";

const schema = z.object({
  title: z.string().min(2, "Title required"),
  description: z.string().optional(),
  url: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  image: z.string().optional(),
  tags: z.string().optional(),
});

type FormData = z.infer<typeof schema>;
type Project = {
  id: string;
  title: string;
  description?: string | null;
  url?: string | null;
  image?: string | null;
  tags: string[];
};

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const imageValue = watch("image");

  async function load() {
    const r = await fetch("/api/dashboard/portfolio");
    setProjects(await r.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(data: FormData) {
    await fetch("/api/dashboard/portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        tags: data.tags
          ? data.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
      }),
    });
    reset();
    setShowForm(false);
    load();
  }

  async function deleteProject(id: string) {
    await fetch(`/api/dashboard/portfolio/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-slate-900"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Portfolio
          </h1>
          <p className="text-slate-500 mt-1">
            Showcase your best work to attract new clients.
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus size={16} /> Add project
        </Button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <h2 className="font-semibold text-slate-900 mb-5">New project</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              id="title"
              label="Project title *"
              placeholder="Shopify store redesign"
              error={errors.title?.message}
              {...register("title")}
            />
            <Textarea
              id="description"
              label="Description"
              placeholder="Describe what you built and the results achieved..."
              {...register("description")}
            />
            <Input
              id="url"
              label="Live URL"
              placeholder="https://example.com"
              error={errors.url?.message}
              {...register("url")}
            />
            <ImageUpload
              value={imageValue}
              onChange={(url) => setValue("image", url)}
              folder="empireexperts/portfolio"
              label="Project screenshot"
              aspect="cover"
            />
            <Input
              id="tags"
              label="Tags (comma-separated)"
              placeholder="Shopify, UX, Performance"
              {...register("tags")}
            />
            <div className="flex gap-3 pt-2">
              <Button type="submit" loading={isSubmitting}>
                Save project
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowForm(false);
                  reset();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Projects list */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
          <p className="text-slate-400 mb-4">
            No projects yet. Add your first portfolio piece!
          </p>
          <Button onClick={() => setShowForm(true)}>
            <Plus size={16} /> Add project
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 flex gap-4"
            >
              {p.image && (
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-28 h-20 object-cover rounded-xl flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-slate-900">{p.title}</h3>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {p.url && (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                    <button
                      onClick={() => deleteProject(p.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                {p.description && (
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                    {p.description}
                  </p>
                )}
                {p.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {p.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
