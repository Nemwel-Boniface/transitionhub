"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, HelpCircle, Users, Inbox, Handshake, LogOut } from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/leads", label: "Transition Leads", icon: Users },
  { href: "/admin/questions", label: "Questions Inbox", icon: Inbox },
  { href: "/admin/relationships", label: "Relationship Tracker", icon: Handshake },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        setIsAdmin(Boolean(d.isAdmin));
        setChecked(true);
        if (!d.isAdmin && !isLoginPage) {
          router.replace("/admin/login");
        }
      });
  }, [isLoginPage, router]);

  if (isLoginPage) return <>{children}</>;

  if (!checked) {
    return <div className="mx-auto max-w-6xl px-6 py-20 text-sm text-graylight">Checking session…</div>;
  }

  if (!isAdmin) {
    return <div className="mx-auto max-w-6xl px-6 py-20 text-sm text-graylight">Redirecting to login…</div>;
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 flex gap-8">
      <aside className="w-52 shrink-0 hidden md:block">
        <nav className="space-y-1 sticky top-24">
          {NAV.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors focus-ring ${
                  active ? "bg-teal text-white" : "text-graytxt hover:bg-cream-alt hover:text-charcoal"
                }`}
              >
                <Icon size={16} /> {item.label}
              </Link>
            );
          })}
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-graytxt hover:bg-cream-alt hover:text-charcoal transition-colors mt-4 focus-ring"
          >
            <LogOut size={16} /> Log out
          </button>
        </nav>
      </aside>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
