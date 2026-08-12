"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { DualBrandLockup } from "@/components/Logo";
import { BrandSplitRule } from "@/components/BrandSplit";
import { Menu, X } from "lucide-react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/what-changes", label: "What Changes" },
  { href: "/brand-guide", label: "Brand Guide" },
  { href: "/timeline", label: "Timeline" },
  { href: "/faq", label: "FAQ" },
  { href: "/transition-leads", label: "Find Your Lead" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-borderc">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 focus-ring rounded-md" onClick={() => setOpen(false)}>
            <DualBrandLockup />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 text-sm rounded-full transition-colors focus-ring ${
                    active
                      ? "bg-teal text-white font-medium"
                      : "text-charcoal/80 hover:bg-cream-alt hover:text-charcoal"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/admin"
              className="ml-2 px-3 py-2 text-sm rounded-full border border-borderc text-graytxt hover:text-charcoal hover:border-teal transition-colors focus-ring"
            >
              Admin
            </Link>
          </nav>

          <button
            className="md:hidden p-2 rounded-md focus-ring"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      <BrandSplitRule />

      {open && (
        <nav className="md:hidden border-t border-borderc bg-cream px-4 py-3 flex flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`px-3 py-2 rounded-lg text-sm ${
                pathname === item.href ? "bg-teal text-white" : "text-charcoal hover:bg-cream-alt"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/admin"
            onClick={() => setOpen(false)}
            className="px-3 py-2 rounded-lg text-sm border border-borderc text-graytxt"
          >
            Admin
          </Link>
        </nav>
      )}
    </header>
  );
}
