import { randomUUID } from "crypto";
import { getDb } from "@/lib/redis";
import { Relationship } from "@/lib/types";

const LIST_KEY = "relationship:list";
const itemKey = (id: string) => `relationship:item:${id}`;

export async function listRelationships(): Promise<Relationship[]> {
  const db = getDb();
  const ids = await db.smembers(LIST_KEY);
  if (ids.length === 0) return [];
  const raw = await Promise.all(ids.map((id) => db.get(itemKey(id))));
  return raw
    .filter((r): r is string => Boolean(r))
    .map((r) => JSON.parse(r) as Relationship)
    .sort((a, b) => a.clientName.localeCompare(b.clientName));
}

export async function getRelationship(id: string): Promise<Relationship | null> {
  const db = getDb();
  const raw = await db.get(itemKey(id));
  return raw ? (JSON.parse(raw) as Relationship) : null;
}

export async function createRelationship(
  input: Omit<Relationship, "id" | "createdAt" | "updatedAt">
): Promise<Relationship> {
  const db = getDb();
  const now = new Date().toISOString();
  const rel: Relationship = { ...input, id: randomUUID(), createdAt: now, updatedAt: now };
  await db.set(itemKey(rel.id), JSON.stringify(rel));
  await db.sadd(LIST_KEY, rel.id);
  return rel;
}

export async function updateRelationship(
  id: string,
  input: Partial<Omit<Relationship, "id" | "createdAt" | "updatedAt">>
): Promise<Relationship | null> {
  const db = getDb();
  const existing = await getRelationship(id);
  if (!existing) return null;
  const updated: Relationship = { ...existing, ...input, updatedAt: new Date().toISOString() };
  await db.set(itemKey(id), JSON.stringify(updated));
  return updated;
}

export async function deleteRelationship(id: string): Promise<boolean> {
  const db = getDb();
  const existing = await getRelationship(id);
  if (!existing) return false;
  await db.del(itemKey(id));
  await db.srem(LIST_KEY, id);
  return true;
}
