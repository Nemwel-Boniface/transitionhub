"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Mail, Hash } from "lucide-react";
import { TeamLead } from "@/lib/types";
import { DEPARTMENTS, findInDirectory } from "@/lib/directory";
import { Highlight } from "@/components/Highlight";

export default function TransitionLeadsPage() {
  const [leads, setLeads] = useState<TeamLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/leads")
      .then((r) => r.json())
      .then((d) => setLeads(d.leads ?? []))
      .finally(() => setLoading(false));
  }, []);

  const match = useMemo(() => {
    if (!query.trim()) return null;
    return findInDirectory(leads, query);
  }, [leads, query]);

  const visibleLeads = useMemo(
    () => (department ? leads.filter((l) => l.team === department) : leads),
    [leads, department]
  );

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-14">
      <span className="text-xs font-semibold tracking-wide uppercase text-teal">Directory</span>
      <h1 className="mt-2 text-3xl font-bold text-charcoal">Find your Transition Lead</h1>
      <p className="mt-3 text-graytxt">
        We have a Transition Lead for every department. Type your name below, or browse the full
        directory further down.
      </p>

      <div className="mt-8 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-graylight" size={18} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type your name…"
          className="w-full pl-11 pr-4 py-3 rounded-full border border-borderc bg-white focus-ring outline-none text-sm"
        />
      </div>

      {query.trim() && (
        <div className="mt-4">
          {match?.kind === "companyWide" && (
            <div className="card p-6 border-orange/30 bg-orange/5">
              <p className="text-sm font-semibold text-orange">⭐ Company-wide leadership</p>
              <p className="mt-2 text-charcoal">
                You&apos;re part of company-wide leadership, representing Ginja.ai externally
                across all teams - not tied to a single department.
              </p>
              <p className="mt-3 text-sm text-graytxt">
                {match.entry.leadNames.map((n, idx) => (
                  <span key={n}>
                    {idx > 0 && " & "}
                    {n === match.matchedName ? <Highlight text={n} query={query} /> : n}
                  </span>
                ))}
                {" - escalate brand or communications questions here."}
              </p>
            </div>
          )}

          {match?.kind === "lead" && (
            <div className="card p-6 border-teal/30 bg-teal/5">
              <p className="text-sm font-semibold text-teal">🎉 Congratulations!</p>
              <h2 className="text-xl font-semibold text-charcoal mt-1">
                You&apos;re the Transition Lead for {match.lead.team}
              </h2>
              <p className="mt-1 text-sm text-graytxt">
                Matched: <Highlight text={match.matchedName} query={query} />
              </p>
              {match.coLeads.length > 0 && (
                <p className="mt-2 text-sm text-graytxt">
                  Co-lead{match.coLeads.length > 1 ? "s" : ""}: {match.coLeads.join(", ")}
                </p>
              )}
              {match.lead.members.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-graylight">
                    Your team
                  </p>
                  <p className="mt-1 text-sm text-graytxt">{match.lead.members.join(", ")}</p>
                </div>
              )}
              {match.lead.notes && <p className="mt-3 text-sm text-graytxt">{match.lead.notes}</p>}
            </div>
          )}

          {match?.kind === "member" && (
            <div className="card p-6 border-teal/30 bg-teal/5">
              <p className="text-sm text-graytxt">
                <Highlight text={match.matchedName} query={query} /> is on the
              </p>
              <h2 className="text-xl font-semibold text-charcoal mt-1">{match.lead.team}</h2>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                <span className="font-medium text-charcoal">
                  Lead{match.lead.leadNames.length > 1 ? "s" : ""}: {match.lead.leadNames.join(", ")}
                </span>
                {match.lead.leadEmail && (
                  <a href={`mailto:${match.lead.leadEmail}`} className="flex items-center gap-1.5 text-teal hover:underline">
                    <Mail size={14} /> {match.lead.leadEmail}
                  </a>
                )}
                {match.lead.leadSlack && (
                  <span className="flex items-center gap-1.5 text-graytxt">
                    <Hash size={14} /> {match.lead.leadSlack}
                  </span>
                )}
              </div>
              {match.lead.notes && <p className="mt-3 text-sm text-graytxt">{match.lead.notes}</p>}
            </div>
          )}

          {!match && (
            <div className="card p-5 text-sm text-graytxt">
              No match yet for &ldquo;<mark className="bg-orange/25 text-charcoal rounded px-0.5">{query}</mark>
              &rdquo; - this directory is still being filled in. Try your full name, ask the
              assistant to log the gap, or check with your manager.
            </div>
          )}
        </div>
      )}

      <div className="mt-14">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-graytxt">
            Full directory
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setDepartment(null)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors focus-ring ${
                department === null
                  ? "bg-teal text-white border-teal"
                  : "border-borderc text-graytxt hover:border-teal"
              }`}
            >
              All departments
            </button>
            {DEPARTMENTS.map((d) => (
              <button
                key={d}
                onClick={() => setDepartment(d)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors focus-ring ${
                  department === d
                    ? "bg-teal text-white border-teal"
                    : "border-borderc text-graytxt hover:border-teal"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        {loading && <p className="mt-4 text-sm text-graylight">Loading…</p>}
        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          {visibleLeads.map((lead) => (
            <div key={lead.id} className="card p-5">
              <h3 className="font-semibold text-charcoal">
                {lead.team}
                {lead.isCompanyWide && <span className="ml-2 text-xs font-normal text-orange">Company-wide</span>}
              </h3>
              <p className="mt-1 text-sm text-graytxt">
                Lead{lead.leadNames.length > 1 ? "s" : ""}: {lead.leadNames.join(", ")}
              </p>
              {lead.leadEmail && (
                <a href={`mailto:${lead.leadEmail}`} className="text-sm text-teal hover:underline">
                  {lead.leadEmail}
                </a>
              )}
              {lead.members.length > 0 && (
                <p className="mt-2 text-xs text-graylight">
                  {lead.members.length} team member{lead.members.length === 1 ? "" : "s"} listed
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <p className="mt-12 text-center text-sm text-graytxt">
        Not sure who to contact? Ask your manager, or reach Culture &amp; People.
      </p>
    </div>
  );
}
