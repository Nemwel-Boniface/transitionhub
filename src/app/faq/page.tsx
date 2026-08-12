"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Faq } from "@/lib/types";
import { searchFaqs, groupByCategory } from "@/lib/search";

export default function FaqPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/faqs")
      .then((r) => r.json())
      .then((d) => setFaqs(d.faqs ?? []))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => Object.keys(groupByCategory(faqs)).sort(), [faqs]);

  const visible = useMemo(() => {
    let list = faqs;
    if (category) list = list.filter((f) => f.category === category);
    if (query.trim()) {
      const results = searchFaqs(list, query, list.length || 1);
      return results.map((r) => r.faq);
    }
    return list;
  }, [faqs, query, category]);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-14">
      <h1 className="text-3xl font-bold text-charcoal">Frequently Asked Questions</h1>
      <p className="mt-2 text-graytxt">
        Search, filter, or browse every question we&apos;ve collected about the transition. Can&apos;t
        find yours? The assistant in the corner can log it for you.
      </p>

      <div className="mt-8 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-graylight" size={18} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search e.g. 'email signature' or 'benefits'…"
          className="w-full pl-11 pr-4 py-3 rounded-full border border-borderc bg-white focus-ring outline-none text-sm"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setCategory(null)}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors focus-ring ${
            category === null ? "bg-teal text-white border-teal" : "border-borderc text-graytxt hover:border-teal"
          }`}
        >
          All topics
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors focus-ring ${
              category === c ? "bg-teal text-white border-teal" : "border-borderc text-graytxt hover:border-teal"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-3">
        {loading && <p className="text-sm text-graylight">Loading FAQs…</p>}
        {!loading && visible.length === 0 && (
          <p className="text-sm text-graylight">
            No matches yet. Try a different keyword, or ask the assistant to log your question.
          </p>
        )}
        {visible.map((faq) => {
          const open = openId === faq.id;
          return (
            <div key={faq.id} className="card overflow-hidden">
              <button
                onClick={() => setOpenId(open ? null : faq.id)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left focus-ring"
              >
                <div>
                  <span className="text-[11px] uppercase tracking-wide text-teal font-semibold">
                    {faq.category}
                  </span>
                  <p className="font-medium text-charcoal mt-0.5">{faq.question}</p>
                </div>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-graylight transition-transform ${open ? "rotate-180" : ""}`}
                />
              </button>
              {open && (
                <div className="px-5 pb-5 text-sm text-graytxt whitespace-pre-line border-t border-borderc pt-4">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
