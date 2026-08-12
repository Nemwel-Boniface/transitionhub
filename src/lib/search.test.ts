import { describe, it, expect } from "vitest";
import { searchFaqs, groupByCategory } from "@/lib/search";
import { Faq } from "@/lib/types";

const now = new Date().toISOString();

const sample: Faq[] = [
  {
    id: "1",
    question: "Which email address do I use?",
    answer: "Use @ginja.ai for external communication and the approved signature.",
    category: "Branding & Communication",
    tags: ["email", "signature"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "2",
    question: "Do my benefits change?",
    answer: "No. Salary, benefits, leave and medical cover are unaffected.",
    category: "Employment & Benefits",
    tags: ["benefits", "salary"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "3",
    question: "Who is my employer?",
    answer: "Eden Care ProActive Limited remains every person's legal entity.",
    category: "Employment & Benefits",
    tags: ["employer", "legal entity"],
    createdAt: now,
    updatedAt: now,
  },
];

describe("searchFaqs", () => {
  it("returns the most relevant FAQ first for a direct keyword match", () => {
    const results = searchFaqs(sample, "email signature");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].faq.id).toBe("1");
  });

  it("matches on tags even when the word isn't in the question", () => {
    const results = searchFaqs(sample, "salary");
    expect(results[0].faq.id).toBe("2");
  });

  it("returns an empty array for a query with only stopwords", () => {
    const results = searchFaqs(sample, "the is a");
    expect(results).toHaveLength(0);
  });

  it("returns an empty array when nothing matches", () => {
    const results = searchFaqs(sample, "xylophone quokka");
    expect(results).toHaveLength(0);
  });

  it("respects the limit parameter", () => {
    const results = searchFaqs(sample, "employer benefits legal", 1);
    expect(results).toHaveLength(1);
  });
});

describe("groupByCategory", () => {
  it("groups FAQs under their category", () => {
    const grouped = groupByCategory(sample);
    expect(Object.keys(grouped).sort()).toEqual(
      ["Branding & Communication", "Employment & Benefits"].sort()
    );
    expect(grouped["Employment & Benefits"]).toHaveLength(2);
  });
});
