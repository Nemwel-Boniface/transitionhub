"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X, Save } from "lucide-react";
import { Relationship, RelationshipStatus } from "@/lib/types";

const STATUSES: RelationshipStatus[] = ["Not started", "In progress", "Informed", "Complete"];
const BRANDS = ["Eden Care", "Ginja.ai", "Both"] as const;

const EMPTY = {
  clientName: "",
  relationshipOwner: "",
  currentBrand: "Eden Care" as (typeof BRANDS)[number],
  futureBrand: "Ginja.ai" as (typeof BRANDS)[number],
  transitionMethod: "",
  targetDate: "",
  status: "Not started" as RelationshipStatus,
  informed: false,
  outstandingActions: "",
};

export default function AdminRelationshipsPage() {
  const [rows, setRows] = useState<Relationship[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [ownerFilter, setOwnerFilter] = useState<string>("all");

  function load() {
    setLoading(true);
    fetch("/api/relationships")
      .then((r) => r.json())
      .then((d) => setRows(d.relationships ?? []))
      .finally(() => setLoading(false));
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect -- imperative refetch after mutations, not a derived-state effect
  useEffect(() => { load(); }, []);

  function startEdit(row: Relationship) {
    setEditingId(row.id);
    setCreating(false);
    setForm({
      clientName: row.clientName,
      relationshipOwner: row.relationshipOwner,
      currentBrand: row.currentBrand,
      futureBrand: row.futureBrand,
      transitionMethod: row.transitionMethod,
      targetDate: row.targetDate,
      status: row.status,
      informed: row.informed,
      outstandingActions: row.outstandingActions,
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
    const url = editingId ? `/api/relationships/${editingId}` : "/api/relationships";
    const method = editingId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      cancel();
      load();
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this relationship record?")) return;
    await fetch(`/api/relationships/${id}`, { method: "DELETE" });
    load();
  }

  const owners = Array.from(new Set(rows.map((r) => r.relationshipOwner))).sort();
  const visible = ownerFilter === "all" ? rows : rows.filter((r) => r.relationshipOwner === ownerFilter);
  const informedPct = rows.length ? Math.round((rows.filter((r) => r.informed).length / rows.length) * 100) : 0;

  const showForm = creating || editingId;

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Relationship Tracker</h1>
          <p className="mt-1 text-sm text-graytxt">
            Every external client or partner relationship, who owns it, and where it stands.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={startCreate}
            className="flex items-center gap-1.5 bg-teal text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-teal-dark transition-colors focus-ring"
          >
            <Plus size={16} /> Add relationship
          </button>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <div className="card px-4 py-2.5 text-sm">
          <span className="font-semibold text-teal">{informedPct}%</span>{" "}
          <span className="text-graytxt">of tracked relationships informed</span>
        </div>
        <div className="card px-4 py-2.5 text-sm">
          <span className="font-semibold text-orange">
            {rows.filter((r) => r.status !== "Complete").length}
          </span>{" "}
          <span className="text-graytxt">still in progress</span>
        </div>
        <select
          value={ownerFilter}
          onChange={(e) => setOwnerFilter(e.target.value)}
          className="text-sm px-3 py-2 rounded-full border border-borderc focus-ring outline-none"
        >
          <option value="all">All owners</option>
          {owners.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      {showForm && (
        <div className="mt-6 card p-6 space-y-3">
          <h2 className="font-semibold text-charcoal">{editingId ? "Edit relationship" : "New relationship"}</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              placeholder="Client / partner name"
              value={form.clientName}
              onChange={(e) => setForm({ ...form, clientName: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-borderc focus-ring outline-none text-sm"
            />
            <input
              placeholder="Relationship owner"
              value={form.relationshipOwner}
              onChange={(e) => setForm({ ...form, relationshipOwner: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-borderc focus-ring outline-none text-sm"
            />
            <select
              value={form.currentBrand}
              onChange={(e) => setForm({ ...form, currentBrand: e.target.value as (typeof BRANDS)[number] })}
              className="w-full px-3 py-2 rounded-lg border border-borderc focus-ring outline-none text-sm"
            >
              {BRANDS.map((b) => (
                <option key={b} value={b}>
                  Current: {b}
                </option>
              ))}
            </select>
            <select
              value={form.futureBrand}
              onChange={(e) => setForm({ ...form, futureBrand: e.target.value as (typeof BRANDS)[number] })}
              className="w-full px-3 py-2 rounded-lg border border-borderc focus-ring outline-none text-sm"
            >
              {BRANDS.map((b) => (
                <option key={b} value={b}>
                  Future: {b}
                </option>
              ))}
            </select>
            <input
              placeholder="Transition method (e.g. call + email)"
              value={form.transitionMethod}
              onChange={(e) => setForm({ ...form, transitionMethod: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-borderc focus-ring outline-none text-sm"
            />
            <input
              type="date"
              value={form.targetDate}
              onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-borderc focus-ring outline-none text-sm"
            />
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as RelationshipStatus })}
              className="w-full px-3 py-2 rounded-lg border border-borderc focus-ring outline-none text-sm"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm text-graytxt px-1">
              <input
                type="checkbox"
                checked={form.informed}
                onChange={(e) => setForm({ ...form, informed: e.target.checked })}
                className="accent-teal"
              />
              Client has been informed
            </label>
          </div>
          <textarea
            placeholder="Outstanding actions (e.g. update CRM, resend proposal, confirm signature)"
            value={form.outstandingActions}
            onChange={(e) => setForm({ ...form, outstandingActions: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-borderc focus-ring outline-none text-sm"
          />
          <div className="flex gap-2 pt-1">
            <button
              onClick={save}
              disabled={saving || !form.clientName || !form.relationshipOwner}
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

      <div className="mt-6 overflow-x-auto">
        {loading && <p className="text-sm text-graylight">Loading…</p>}
        {!loading && visible.length > 0 && (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-graylight border-b border-borderc">
                <th className="py-2 pr-4">Client</th>
                <th className="py-2 pr-4">Owner</th>
                <th className="py-2 pr-4">Brand</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Informed</th>
                <th className="py-2 pr-4">Target</th>
                <th className="py-2 pr-4">Actions outstanding</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => (
                <tr key={r.id} className="border-b border-borderc/70 align-top">
                  <td className="py-3 pr-4 font-medium text-charcoal">{r.clientName}</td>
                  <td className="py-3 pr-4 text-graytxt">{r.relationshipOwner}</td>
                  <td className="py-3 pr-4 text-graytxt whitespace-nowrap">
                    {r.currentBrand} → {r.futureBrand}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        r.status === "Complete"
                          ? "bg-teal/10 text-teal"
                          : r.status === "Not started"
                          ? "bg-graylight/20 text-graytxt"
                          : "bg-orange/10 text-orange"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4">{r.informed ? "✅" : "-"}</td>
                  <td className="py-3 pr-4 text-graytxt whitespace-nowrap">{r.targetDate || "-"}</td>
                  <td className="py-3 pr-4 text-graytxt max-w-xs">{r.outstandingActions || "-"}</td>
                  <td className="py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(r)}
                        className="p-1.5 rounded-lg hover:bg-cream-alt text-graytxt hover:text-teal focus-ring"
                        aria-label="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => remove(r.id)}
                        className="p-1.5 rounded-lg hover:bg-cream-alt text-graytxt hover:text-orange focus-ring"
                        aria-label="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && visible.length === 0 && (
          <p className="text-sm text-graylight">No relationships tracked yet - add the first one above.</p>
        )}
      </div>
    </div>
  );
}
