import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <p
              className="text-xl font-extrabold text-white tracking-tight mb-3"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              <span className="text-blue-400">Empire</span>Experts
            </p>
            <p className="text-sm leading-relaxed">
              The premier directory for top Shopify agencies and eCommerce
              experts worldwide.
            </p>
          </div>

          {/* Directory */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Directory</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/agencies" className="hover:text-white transition-colors">Browse All</Link></li>
              <li><Link href="/agencies?category=shopify" className="hover:text-white transition-colors">Shopify Experts</Link></li>
              <li><Link href="/agencies?category=marketing" className="hover:text-white transition-colors">Marketing Agencies</Link></li>
              <li><Link href="/agencies?category=design" className="hover:text-white transition-colors">Design Studios</Link></li>
            </ul>
          </div>

          {/* Agency */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">For Agencies</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/register" className="hover:text-white transition-colors">List Your Agency</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <p>© {new Date().getFullYear()} EmpireExperts. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
