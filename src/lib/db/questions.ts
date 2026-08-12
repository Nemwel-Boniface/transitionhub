import { randomUUID } from "crypto";
import { getDb } from "@/lib/redis";
import { Question } from "@/lib/types";

const LIST_KEY = "question:list";
const itemKey = (id: string) => `question:item:${id}`;

export async function listQuestions(): Promise<Question[]> {
  const db = getDb();
  const ids = await db.smembers(LIST_KEY);
  if (ids.length === 0) return [];
  const raw = await Promise.all(ids.map((id) => db.get(itemKey(id))));
  return raw
    .filter((r): r is string => Boolean(r))
    .map((r) => JSON.parse(r) as Question)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createQuestion(input: {
  question: string;
  name?: string;
  email?: string;
}): Promise<Question> {
  const db = getDb();
  const now = new Date().toISOString();
  const q: Question = {
    id: randomUUID(),
    question: input.question.trim(),
    name: input.name?.trim() || undefined,
    email: input.email?.trim() || undefined,
    status: "open",
    createdAt: now,
  };
  await db.set(itemKey(q.id), JSON.stringify(q));
  await db.sadd(LIST_KEY, q.id);
  return q;
}

export async function getQuestion(id: string): Promise<Question | null> {
  const db = getDb();
  const raw = await db.get(itemKey(id));
  return raw ? (JSON.parse(raw) as Question) : null;
}

export async function resolveQuestion(id: string, answer: string): Promise<Question | null> {
  const db = getDb();
  const existing = await getQuestion(id);
  if (!existing) return null;
  const updated: Question = {
    ...existing,
    answer: answer.trim(),
    status: "resolved",
    resolvedAt: new Date().toISOString(),
  };
  await db.set(itemKey(id), JSON.stringify(updated));
  return updated;
}

export async function deleteQuestion(id: string): Promise<boolean> {
  const db = getDb();
  const existing = await getQuestion(id);
  if (!existing) return false;
  await db.del(itemKey(id));
  await db.srem(LIST_KEY, id);
  return true;
}
