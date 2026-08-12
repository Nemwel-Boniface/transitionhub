import { Check, X } from "lucide-react";
import { BrandSplitRule } from "@/components/BrandSplit";

const CHANGES = [
  "Email addresses (where applicable)",
  "Email signatures",
  "Client-facing communications",
  "Proposals",
  "Contracts",
  "Invoices",
  "External presentations",
  "External representation of Ginja.ai",
];

const NO_CHANGES = [
  "Your legal employer",
  "Your salary",
  "Your benefits",
  "Your employment terms",
  "Your manager",
  "Your team",
  "Performance management",
  "Leave processes",
  "Slack",
  "Google Workspace",
  "Shared Drives",
  "Internal meetings & collaboration",
];

const WHO_MOVES = [
  {
    title: "Sales & Commercial",
    desc: "Client proposals, contracts and outreach → @ginja.ai.",
  },
  {
    title: "Customer Support & SPRM",
    desc: "Client and partner correspondence → @ginja.ai.",
  },
  {
    title: "Leadership & ExCo",
    desc: "External representation of Ginja.ai → @ginja.ai.",
  },
  {
    title: "Everyone else",
    desc: "Engineering, Ops, Actuarial, Product - no change right now. Keep using edencaremedical and internal tools as normal.",
  },
];

export default function WhatChangesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-14">
      <span className="text-xs font-semibold tracking-wide uppercase text-teal">What Changes</span>
      <h1 className="mt-2 text-3xl font-bold text-charcoal">
        Where clients and partners see us, that&apos;s where the brand shifts.
      </h1>
      <p className="mt-3 text-graytxt">
        Only our external brand presentation changes. Internal ways of working remain unchanged.
      </p>

      <div className="mt-10 grid sm:grid-cols-2 gap-5">
        <div className="card p-6">
          <div className="flex items-center gap-2 text-orange font-semibold">
            <X size={18} /> Changes externally
          </div>
          <ul className="mt-4 space-y-2 text-sm text-graytxt">
            {CHANGES.map((c) => (
              <li key={c} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-orange shrink-0" />
                {c}
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-2 text-teal font-semibold">
            <Check size={18} /> Stays exactly the same
          </div>
          <ul className="mt-4 space-y-2 text-sm text-graytxt">
            {NO_CHANGES.map((c) => (
              <li key={c} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-teal shrink-0" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <BrandSplitRule className="my-12" />

      <section>
        <h2 className="text-xl font-bold text-charcoal">Who moves - for now</h2>
        <p className="mt-2 text-graytxt text-sm">
          This is Phase 1. If clients don&apos;t see your name, nothing changes for you.
        </p>
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          {WHO_MOVES.map((w, i) => (
            <div key={w.title} className="card p-5">
              <span className="text-xs font-semibold text-graylight">Group {i + 1}</span>
              <h3 className="font-semibold text-charcoal mt-1">{w.title}</h3>
              <p className="mt-1.5 text-sm text-graytxt">{w.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 card p-5 bg-teal/5 border-teal/20 text-sm text-charcoal">
          This is Phase 1 - not the full move. This is about brand consistency where clients
          see it, not a systems migration. Internal tools, Slack and Google Workspace are not
          changing today. If that changes later, we will communicate it separately, with its
          own timeline.
        </div>
      </section>
    </div>
  );
}
