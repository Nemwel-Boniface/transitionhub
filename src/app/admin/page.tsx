"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HelpCircle, Users, Inbox, Handshake } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ faqs: 0, leads: 0, openQuestions: 0, relationships: 0 });

  useEffect(() => {
    Promise.all([
      fetch("/api/faqs").then((r) => r.json()),
      fetch("/api/leads").then((r) => r.json()),
      fetch("/api/questions").then((r) => r.json()),
      fetch("/api/relationships").then((r) => r.json()),
    ]).then(([faqs, leads, questions, rels]) => {
      setStats({
        faqs: faqs.faqs?.length ?? 0,
        leads: leads.leads?.length ?? 0,
        openQuestions: (questions.questions ?? []).filter((q: { status: string }) => q.status === "open").length,
        relationships: rels.relationships?.length ?? 0,
      });
    });
  }, []);

  const CARDS = [
    { href: "/admin/faqs", label: "FAQs published", value: stats.faqs, icon: HelpCircle },
    { href: "/admin/leads", label: "Teams in directory", value: stats.leads, icon: Users },
    { href: "/admin/questions", label: "Open questions", value: stats.openQuestions, icon: Inbox, alert: stats.openQuestions > 0 },
    { href: "/admin/relationships", label: "Relationships tracked", value: stats.relationships, icon: Handshake },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-charcoal">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-graytxt">Manage TransitionHub content for the whole company.</p>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CARDS.map(({ href, label, value, icon: Icon, alert }) => (
          <Link key={href} href={href} className="card p-5 hover:border-teal transition-colors focus-ring">
            <div className="flex items-center justify-between">
              <Icon size={18} className="text-teal" />
              {alert && <span className="h-2 w-2 rounded-full bg-orange" />}
            </div>
            <p className="mt-3 text-2xl font-bold text-charcoal">{value}</p>
            <p className="text-sm text-graytxt">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
