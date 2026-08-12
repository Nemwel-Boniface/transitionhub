import { randomUUID } from "crypto";
import { getDb } from "@/lib/redis";
import { Faq } from "@/lib/types";

const LIST_KEY = "faq:list";
const itemKey = (id: string) => `faq:item:${id}`;

export async function listFaqs(): Promise<Faq[]> {
  const db = getDb();
  const ids = await db.smembers(LIST_KEY);
  if (ids.length === 0) return [];
  const raw = await Promise.all(ids.map((id) => db.get(itemKey(id))));
  const faqs = raw
    .filter((r): r is string => Boolean(r))
    .map((r) => JSON.parse(r) as Faq);
  return faqs.sort((a, b) => a.category.localeCompare(b.category) || a.question.localeCompare(b.question));
}

export async function getFaq(id: string): Promise<Faq | null> {
  const db = getDb();
  const raw = await db.get(itemKey(id));
  return raw ? (JSON.parse(raw) as Faq) : null;
}

export async function createFaq(input: {
  question: string;
  answer: string;
  category: string;
  tags?: string[];
}): Promise<Faq> {
  const db = getDb();
  const now = new Date().toISOString();
  const faq: Faq = {
    id: randomUUID(),
    question: input.question.trim(),
    answer: input.answer.trim(),
    category: input.category.trim(),
    tags: input.tags ?? [],
    createdAt: now,
    updatedAt: now,
  };
  await db.set(itemKey(faq.id), JSON.stringify(faq));
  await db.sadd(LIST_KEY, faq.id);
  return faq;
}

export async function updateFaq(
  id: string,
  input: Partial<Pick<Faq, "question" | "answer" | "category" | "tags">>
): Promise<Faq | null> {
  const db = getDb();
  const existing = await getFaq(id);
  if (!existing) return null;
  const updated: Faq = {
    ...existing,
    ...input,
    updatedAt: new Date().toISOString(),
  };
  await db.set(itemKey(id), JSON.stringify(updated));
  return updated;
}

export async function deleteFaq(id: string): Promise<boolean> {
  const db = getDb();
  const existing = await getFaq(id);
  if (!existing) return false;
  await db.del(itemKey(id));
  await db.srem(LIST_KEY, id);
  return true;
}
