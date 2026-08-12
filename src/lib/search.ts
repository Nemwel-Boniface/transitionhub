import { Faq } from "@/lib/types";

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

const STOPWORDS = new Set([
  "the", "is", "at", "which", "on", "a", "an", "and", "or", "to", "of", "in",
  "for", "my", "me", "do", "does", "am", "i", "it", "this", "that", "will",
  "be", "are", "what", "who", "when", "how", "can", "should",
]);

export interface ScoredFaq {
  faq: Faq;
  score: number;
}

/**
 * Simple, dependency-free relevance scoring: counts overlapping meaningful
 * tokens between the query and each FAQ's question/answer/tags/category,
 * weighting question-title matches highest. Good enough for a bounded FAQ
 * set (dozens, not thousands, of entries) and keeps the chatbot fully
 * client-side with zero extra Redis calls per keystroke.
 */
export function searchFaqs(faqs: Faq[], query: string, limit = 4): ScoredFaq[] {
  const queryTokens = tokenize(query).filter((t) => !STOPWORDS.has(t));
  if (queryTokens.length === 0) return [];

  const scored: ScoredFaq[] = faqs.map((faq) => {
    const questionTokens = new Set(tokenize(faq.question));
    const answerTokens = new Set(tokenize(faq.answer));
    const tagTokens = new Set(faq.tags.flatMap((t) => tokenize(t)));
    const categoryTokens = new Set(tokenize(faq.category));

    let score = 0;
    for (const qt of queryTokens) {
      if (questionTokens.has(qt)) score += 3;
      if (tagTokens.has(qt)) score += 2.5;
      if (categoryTokens.has(qt)) score += 1.5;
      if (answerTokens.has(qt)) score += 1;
      // partial/substring boost for things like "email" vs "emails"
      if (faq.question.toLowerCase().includes(qt)) score += 0.5;
    }
    return { faq, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function groupByCategory(faqs: Faq[]): Record<string, Faq[]> {
  return faqs.reduce<Record<string, Faq[]>>((acc, faq) => {
    (acc[faq.category] ||= []).push(faq);
    return acc;
  }, {});
}
