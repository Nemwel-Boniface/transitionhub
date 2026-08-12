"use client";

import { useEffect, useState } from "react";
import { Trash2, CheckCircle2, Circle, Plus } from "lucide-react";
import { Question } from "@/lib/types";

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<"open" | "resolved" | "all">("open");

  function load() {
    setLoading(true);
    fetch("/api/questions")
      .then((r) => r.json())
      .then((d) => setQuestions(d.questions ?? []))
      .finally(() => setLoading(false));
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect -- imperative refetch after mutations, not a derived-state effect
  useEffect(() => { load(); }, []);

  async function resolve(id: string) {
    const answer = drafts[id]?.trim();
    if (!answer) return;
    await fetch(`/api/questions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this question?")) return;
    await fetch(`/api/questions/${id}`, { method: "DELETE" });
    load();
  }

  async function pushToFaq(q: Question) {
    if (!q.answer) return;
    const category = prompt("Which FAQ category should this go under?", "Roles & Escalation");
    if (!category) return;
    await fetch("/api/faqs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q.question, answer: q.answer, category, tags: [] }),
    });
    alert("Added to the public FAQ.");
  }

  const visible = questions.filter((q) => filter === "all" || q.status === filter);

  return (
    <div>
      <h1 className="text-2xl font-bold text-charcoal">Questions Inbox</h1>
      <p className="mt-1 text-sm text-graytxt">
        Questions the chatbot couldn&apos;t answer, logged for Culture &amp; People / HR.
      </p>

      <div className="mt-5 flex gap-2">
        {(["open", "resolved", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full border capitalize transition-colors focus-ring ${
              filter === f ? "bg-teal text-white border-teal" : "border-borderc text-graytxt hover:border-teal"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {loading && <p className="text-sm text-graylight">Loading…</p>}
        {!loading && visible.length === 0 && (
          <p className="text-sm text-graylight">Nothing here - inbox is clear.</p>
        )}
        {visible.map((q) => (
          <div key={q.id} className="card p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  {q.status === "resolved" ? (
                    <CheckCircle2 size={16} className="text-teal" />
                  ) : (
                    <Circle size={16} className="text-orange" />
                  )}
                  <p className="font-medium text-charcoal">{q.question}</p>
                </div>
                <p className="text-xs text-graylight mt-1">
                  {q.name ? `From ${q.name}` : "Anonymous"}
                  {q.email ? ` · ${q.email}` : ""} · {new Date(q.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => remove(q.id)}
                className="p-2 rounded-lg hover:bg-cream-alt text-graytxt hover:text-orange focus-ring shrink-0"
                aria-label="Delete"
              >
                <Trash2 size={15} />
              </button>
            </div>

            {q.status === "resolved" ? (
              <div className="mt-3 bg-cream-alt rounded-lg p-3 text-sm text-charcoal whitespace-pre-line">
                {q.answer}
                <button
                  onClick={() => pushToFaq(q)}
                  className="mt-2 flex items-center gap-1 text-xs text-teal hover:underline"
                >
                  <Plus size={13} /> Add to public FAQ
                </button>
              </div>
            ) : (
              <div className="mt-3 flex gap-2">
                <textarea
                  placeholder="Write a response…"
                  value={drafts[q.id] ?? ""}
                  onChange={(e) => setDrafts({ ...drafts, [q.id]: e.target.value })}
                  rows={2}
                  className="flex-1 px-3 py-2 rounded-lg border border-borderc focus-ring outline-none text-sm"
                />
                <button
                  onClick={() => resolve(q.id)}
                  disabled={!drafts[q.id]?.trim()}
                  className="px-4 py-2 rounded-lg bg-teal text-white text-sm font-medium hover:bg-teal-dark transition-colors focus-ring disabled:opacity-50 shrink-0"
                >
                  Resolve
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
