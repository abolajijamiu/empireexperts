"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";

const schema = z.object({
  name: z.string().min(2, "Agency name required"),
  tagline: z.string().optional(),
  description: z.string().optional(),
  logo: z.string().optional(),
  coverImage: z.string().optional(),
  website: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  location: z.string().optional(),
  country: z.string().optional(),
  founded: z.string().optional(),
  teamSize: z.string().optional(),
  categories: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const logo = watch("logo");
  const coverImage = watch("coverImage");

  useEffect(() => {
    fetch("/api/dashboard/profile")
      .then((r) => r.json())
      .then((data) => {
        reset({
          ...data,
          categories: data.categories?.map((c: any) => c.name).join(", ") || "",
        });
        setLoading(false);
      });
  }, [reset]);

  async function onSubmit(data: FormData) {
    setSaved(false);
    await fetch("/api/dashboard/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) {
    return (
      <div className="max-w-2xl space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-11 bg-slate-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1
          className="text-2xl font-bold text-slate-900"
          style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
        >
          Agency profile
        </h1>
        <p className="text-slate-500 mt-1">
          This information is shown on your public profile page.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Images */}
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-4">Brand images</p>
            <ImageUpload
              value={coverImage}
              onChange={(url) => setValue("coverImage", url)}
              folder="empireexperts/covers"
              label="Cover image"
              aspect="cover"
              className="mb-4"
            />
            <ImageUpload
              value={logo}
              onChange={(url) => setValue("logo", url)}
              folder="empireexperts/logos"
              label="Agency logo"
              aspect="square"
            />
          </div>

          <div className="border-t border-slate-100 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              id="name"
              label="Agency name *"
              placeholder="Acme Agency"
              error={errors.name?.message}
              {...register("name")}
            />
            <Input
              id="tagline"
              label="Tagline"
              placeholder="We build amazing Shopify stores"
              {...register("tagline")}
            />
          </div>

          <Textarea
            id="description"
            label="About your agency"
            placeholder="Tell potential clients about your agency, experience, and what makes you unique..."
            className="min-h-[140px]"
            {...register("description")}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              id="website"
              label="Website"
              placeholder="https://youragency.com"
              error={errors.website?.message}
              {...register("website")}
            />
            <Input
              id="email"
              label="Contact email"
              placeholder="hello@youragency.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              id="phone"
              label="Phone"
              placeholder="+1 555 000 0000"
              {...register("phone")}
            />
            <Input
              id="location"
              label="City"
              placeholder="New York"
              {...register("location")}
            />
            <Input
              id="country"
              label="Country"
              placeholder="United States"
              {...register("country")}
            />
            <Input
              id="founded"
              label="Founded year"
              placeholder="2018"
              {...register("founded")}
            />
            <Input
              id="teamSize"
              label="Team size"
              placeholder="10–25 people"
              {...register("teamSize")}
            />
          </div>

          <Input
            id="categories"
            label="Specialisations (comma-separated)"
            placeholder="Shopify Development, Marketing, SEO"
            {...register("categories")}
          />

          <div className="flex items-center gap-4 pt-2">
            <Button type="submit" loading={isSubmitting}>
              Save profile
            </Button>
            {saved && (
              <span className="text-sm text-green-600 font-medium">
                ✓ Saved successfully
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
