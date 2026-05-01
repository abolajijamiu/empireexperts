"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const registered = params.get("registered");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setError("");
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-extrabold" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              <span className="text-blue-600">Empire</span>
              <span className="text-slate-900">Experts</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 mt-4 mb-2">Welcome back</h1>
          <p className="text-slate-500 text-sm">Sign in to manage your agency profile</p>
        </div>

        {registered && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 mb-6 text-center">
            Account created! Please sign in.
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
              placeholder="Your password"
              error={errors.password?.message}
              {...register("password")}
            />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" loading={isSubmitting}>
              Sign in
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-600 font-medium hover:underline">
              Register your agency
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
