"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    agencyName: z.string().min(2, "Agency name must be at least 2 characters"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error || "Something went wrong");
      return;
    }

    router.push("/login?registered=true");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-extrabold" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              <span className="text-blue-600">Empire</span>
              <span className="text-slate-900">Experts</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 mt-4 mb-2">Create your agency profile</h1>
          <p className="text-slate-500 text-sm">Join thousands of agencies on EmpireExperts</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              id="name"
              label="Your full name"
              placeholder="John Smith"
              error={errors.name?.message}
              {...register("name")}
            />
            <Input
              id="agencyName"
              label="Agency name"
              placeholder="Acme Agency"
              error={errors.agencyName?.message}
              {...register("agencyName")}
            />
            <Input
              id="email"
              type="email"
              label="Email address"
              placeholder="john@acme.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="At least 8 characters"
              error={errors.password?.message}
              {...register("password")}
            />
            <Input
              id="confirmPassword"
              type="password"
              label="Confirm password"
              placeholder="Repeat your password"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" loading={isSubmitting}>
              Create account
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          By registering, you agree to our{" "}
          <Link href="/terms" className="underline">Terms</Link> and{" "}
          <Link href="/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
