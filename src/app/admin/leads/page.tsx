"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X, Save } from "lucide-react";
import { TeamLead } from "@/lib/types";

const EMPTY = { team: "", leadNames: "", leadEmail: "", leadSlack: "", members: "", notes: "" };

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<TeamLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    fetch("/api/leads")
      .then((r) => r.json())
      .then((d) => setLeads(d.leads ?? []))
      .finally(() => setLoading(false));
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect -- imperative refetch after mutations, not a derived-state effect
  useEffect(() => { load(); }, []);

  function startEdit(lead: TeamLead) {
    setEditingId(lead.id);
    setCreating(false);
    setForm({
      team: lead.team,
      leadNames: lead.leadNames.join(", "),
      leadEmail: lead.leadEmail ?? "",
      leadSlack: lead.leadSlack ?? "",
      members: lead.members.join(", "),
      notes: lead.notes ?? "",
    });
  }

  function startCreate() {
    setCreating(true);
    setEditingId(null);
    setForm(EMPTY);
  }

  function cancel() {
    setCreating(false);
    setEditingId(null);
    setForm(EMPTY);
  }

  async function save() {
    setSaving(true);
    const payload = {
      team: form.team,
      leadNames: form.leadNames.split(",").map((n) => n.trim()).filter(Boolean),
      leadEmail: form.leadEmail || undefined,
      leadSlack: form.leadSlack || undefined,
      members: form.members.split(",").map((m) => m.trim()).filter(Boolean),
      notes: form.notes || undefined,
    };
    const url = editingId ? `/api/leads/${editingId}` : "/api/leads";
    const method = editingId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      cancel();
      load();
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this team/lead entry?")) return;
    await fetch(`/api/leads/${id}`, { method: "DELETE" });
    load();
  }

  const showForm = creating || editingId;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-charcoal">Transition Leads</h1>
        {!showForm && (
          <button
            onClick={startCreate}
            className="flex items-center gap-1.5 bg-teal text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-teal-dark transition-colors focus-ring"
          >
            <Plus size={16} /> Add team
          </button>
        )}
      </div>

      {showForm && (
        <div className="mt-6 card p-6 space-y-3">
          <h2 className="font-semibold text-charcoal">{editingId ? "Edit team" : "New team"}</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              placeholder="Team name"
              value={form.team}
              onChange={(e) => setForm({ ...form, team: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-borderc focus-ring outline-none text-sm"
            />
            <input
              placeholder="Transition Lead name(s), comma separated"
              value={form.leadNames}
              onChange={(e) => setForm({ ...form, leadNames: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-borderc focus-ring outline-none text-sm"
            />
            <input
              placeholder="Lead email (optional)"
              value={form.leadEmail}
              onChange={(e) => setForm({ ...form, leadEmail: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-borderc focus-ring outline-none text-sm"
            />
            <input
              placeholder="Lead Slack handle (optional)"
              value={form.leadSlack}
              onChange={(e) => setForm({ ...form, leadSlack: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-borderc focus-ring outline-none text-sm"
            />
          </div>
          <textarea
            placeholder="Team members, comma separated (used for name lookup)"
            value={form.members}
            onChange={(e) => setForm({ ...form, members: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-borderc focus-ring outline-none text-sm"
          />
          <textarea
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-borderc focus-ring outline-none text-sm"
          />
          <div className="flex gap-2 pt-1">
            <button
              onClick={save}
              disabled={saving || !form.team || !form.leadNames.trim()}
              className="flex items-center gap-1.5 bg-teal text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-teal-dark transition-colors focus-ring disabled:opacity-50"
            >
              <Save size={15} /> {saving ? "Saving…" : "Save"}
            </button>
            <button
              onClick={cancel}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm border border-borderc hover:border-teal transition-colors focus-ring"
            >
              <X size={15} /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-2">
        {loading && <p className="text-sm text-graylight">Loading…</p>}
        {leads.map((lead) => (
          <div key={lead.id} className="card p-4 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-medium text-charcoal">
                {lead.team}
                {lead.isCompanyWide && (
                  <span className="ml-2 text-xs font-normal text-teal">Company-wide</span>
                )}
              </p>
              <p className="text-sm text-graytxt">
                {lead.leadNames.join(", ")}
                {lead.leadEmail ? ` · ${lead.leadEmail}` : ""}
              </p>
              {lead.members.length > 0 && (
                <p className="text-xs text-graylight mt-1 truncate">{lead.members.join(", ")}</p>
              )}
            </div>
            <div className="flex gap-1.5 shrink-0">
              <button
                onClick={() => startEdit(lead)}
                className="p-2 rounded-lg hover:bg-cream-alt text-graytxt hover:text-teal focus-ring"
                aria-label="Edit"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => remove(lead.id)}
                className="p-2 rounded-lg hover:bg-cream-alt text-graytxt hover:text-orange focus-ring"
                aria-label="Delete"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
