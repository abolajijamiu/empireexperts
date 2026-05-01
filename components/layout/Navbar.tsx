"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span
              className="text-xl font-extrabold tracking-tight"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              <span className="text-blue-600">Empire</span>
              <span className="text-slate-900">Experts</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/agencies"
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
            >
              Browse Agencies
            </Link>
            <Link
              href="/agencies?category=shopify"
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
            >
              Shopify Experts
            </Link>
            <Link
              href="/agencies?category=marketing"
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
            >
              Marketing
            </Link>
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">List your agency</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-3">
          <Link
            href="/agencies"
            className="block text-sm font-medium text-slate-700 py-2"
            onClick={() => setOpen(false)}
          >
            Browse Agencies
          </Link>
          <Link
            href="/agencies?category=shopify"
            className="block text-sm font-medium text-slate-700 py-2"
            onClick={() => setOpen(false)}
          >
            Shopify Experts
          </Link>
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {session ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full">Dashboard</Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full">Sign in</Button>
                </Link>
                <Link href="/register" onClick={() => setOpen(false)}>
                  <Button className="w-full">List your agency</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
