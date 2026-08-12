import { TeamLead } from "@/lib/types";

/** The department names shown as filter options across the directory UI and chatbot. */
export const DEPARTMENTS = [
  "Operations + Commercial",
  "Product & Data",
  "Core Insurance Engineering",
  "Clinical Context Engineering",
  "Company-wide Leadership",
] as const;

function isNameMatch(candidate: string, needle: string): boolean {
  const c = candidate.toLowerCase();
  return c === needle || c.includes(needle) || needle.includes(c);
}

export type DirectoryMatch =
  | { kind: "companyWide"; entry: TeamLead; matchedName: string }
  | { kind: "lead"; lead: TeamLead; matchedName: string; coLeads: string[] }
  | { kind: "member"; lead: TeamLead; matchedName: string }
  | null;

/**
 * Resolves a searched name against the directory. Checks leadNames before
 * members so a Transition Lead searching their own name gets the
 * congratulatory/company-wide branch rather than being treated as a member.
 */
export function findInDirectory(leads: TeamLead[], name: string): DirectoryMatch {
  const needle = name.trim().toLowerCase();
  if (!needle) return null;

  for (const lead of leads) {
    const matchedName = lead.leadNames.find((n) => isNameMatch(n, needle));
    if (matchedName) {
      if (lead.isCompanyWide) {
        return { kind: "companyWide", entry: lead, matchedName };
      }
      return {
        kind: "lead",
        lead,
        matchedName,
        coLeads: lead.leadNames.filter((n) => n !== matchedName),
      };
    }
  }

  for (const lead of leads) {
    const matchedName = lead.members.find((m) => isNameMatch(m, needle));
    if (matchedName) {
      return { kind: "member", lead, matchedName };
    }
  }

  return null;
}
