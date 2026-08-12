"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X, Save } from "lucide-react";
import { Faq } from "@/lib/types";

const EMPTY = { question: "", answer: "", category: "", tags: "" };

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    fetch("/api/faqs")
      .then((r) => r.json())
      .then((d) => setFaqs(d.faqs ?? []))
      .finally(() => setLoading(false));
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect -- imperative refetch after mutations, not a derived-state effect
  useEffect(() => { load(); }, []);

  function startEdit(faq: Faq) {
    setEditingId(faq.id);
    setCreating(false);
    setForm({ question: faq.question, answer: faq.answer, category: faq.category, tags: faq.tags.join(", ") });
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
      question: form.question,
      answer: form.answer,
      category: form.category,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    const url = editingId ? `/api/faqs/${editingId}` : "/api/faqs";
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
    if (!confirm("Delete this FAQ?")) return;
    await fetch(`/api/faqs/${id}`, { method: "DELETE" });
    load();
  }

  const showForm = creating || editingId;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-charcoal">FAQs</h1>
        {!showForm && (
          <button
            onClick={startCreate}
            className="flex items-center gap-1.5 bg-teal text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-teal-dark transition-colors focus-ring"
          >
            <Plus size={16} /> Add FAQ
          </button>
        )}
      </div>

      {showForm && (
        <div className="mt-6 card p-6 space-y-3">
          <h2 className="font-semibold text-charcoal">{editingId ? "Edit FAQ" : "New FAQ"}</h2>
          <input
            placeholder="Question"
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-borderc focus-ring outline-none text-sm"
          />
          <textarea
            placeholder="Answer"
            value={form.answer}
            onChange={(e) => setForm({ ...form, answer: e.target.value })}
            rows={5}
            className="w-full px-3 py-2 rounded-lg border border-borderc focus-ring outline-none text-sm"
          />
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              placeholder="Category (e.g. Strategy)"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-borderc focus-ring outline-none text-sm"
            />
            <input
              placeholder="Tags, comma separated"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-borderc focus-ring outline-none text-sm"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={save}
              disabled={saving || !form.question || !form.answer || !form.category}
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
        {faqs.map((faq) => (
          <div key={faq.id} className="card p-4 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <span className="text-[11px] uppercase tracking-wide text-teal font-semibold">
                {faq.category}
              </span>
              <p className="font-medium text-charcoal truncate">{faq.question}</p>
              <p className="text-sm text-graytxt line-clamp-1">{faq.answer}</p>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <button
                onClick={() => startEdit(faq)}
                className="p-2 rounded-lg hover:bg-cream-alt text-graytxt hover:text-teal focus-ring"
                aria-label="Edit"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => remove(faq.id)}
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
