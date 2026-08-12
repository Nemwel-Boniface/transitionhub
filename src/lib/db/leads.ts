import { randomUUID } from "crypto";
import { getDb } from "@/lib/redis";
import { TeamLead } from "@/lib/types";
import { findInDirectory, DirectoryMatch } from "@/lib/directory";

const LIST_KEY = "lead:list";
const itemKey = (id: string) => `lead:item:${id}`;

export async function listTeamLeads(): Promise<TeamLead[]> {
  const db = getDb();
  const ids = await db.smembers(LIST_KEY);
  if (ids.length === 0) return [];
  const raw = await Promise.all(ids.map((id) => db.get(itemKey(id))));
  return raw
    .filter((r): r is string => Boolean(r))
    .map((r) => JSON.parse(r) as TeamLead)
    .sort((a, b) => a.team.localeCompare(b.team));
}

export async function getTeamLead(id: string): Promise<TeamLead | null> {
  const db = getDb();
  const raw = await db.get(itemKey(id));
  return raw ? (JSON.parse(raw) as TeamLead) : null;
}

export async function createTeamLead(input: {
  team: string;
  leadNames: string[];
  leadEmail?: string;
  leadSlack?: string;
  members?: string[];
  notes?: string;
  isCompanyWide?: boolean;
}): Promise<TeamLead> {
  const db = getDb();
  const now = new Date().toISOString();
  const lead: TeamLead = {
    id: randomUUID(),
    team: input.team.trim(),
    leadNames: input.leadNames.map((n) => n.trim()).filter(Boolean),
    leadEmail: input.leadEmail?.trim(),
    leadSlack: input.leadSlack?.trim(),
    members: input.members ?? [],
    notes: input.notes?.trim(),
    isCompanyWide: input.isCompanyWide,
    createdAt: now,
    updatedAt: now,
  };
  await db.set(itemKey(lead.id), JSON.stringify(lead));
  await db.sadd(LIST_KEY, lead.id);
  return lead;
}

export async function updateTeamLead(
  id: string,
  input: Partial<Omit<TeamLead, "id" | "createdAt" | "updatedAt">>
): Promise<TeamLead | null> {
  const db = getDb();
  const existing = await getTeamLead(id);
  if (!existing) return null;
  const updated: TeamLead = { ...existing, ...input, updatedAt: new Date().toISOString() };
  await db.set(itemKey(id), JSON.stringify(updated));
  return updated;
}

export async function deleteTeamLead(id: string): Promise<boolean> {
  const db = getDb();
  const existing = await getTeamLead(id);
  if (!existing) return false;
  await db.del(itemKey(id));
  await db.srem(LIST_KEY, id);
  return true;
}

/** Case-insensitive search for a person's name against the whole directory (leads first, then members). */
export async function findLeadForPerson(name: string): Promise<DirectoryMatch> {
  const leads = await listTeamLeads();
  return findInDirectory(leads, name);
}
