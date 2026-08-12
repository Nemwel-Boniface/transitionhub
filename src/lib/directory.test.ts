import { describe, it, expect } from "vitest";
import { findInDirectory } from "@/lib/directory";
import { TeamLead } from "@/lib/types";

const now = new Date().toISOString();

const sample: TeamLead[] = [
  {
    id: "1",
    team: "Operations + Commercial",
    leadNames: ["Francis Nyamu", "Newton Muthomi"],
    members: ["Anne Gikonyo", "Oscar Osula"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "2",
    team: "Clinical Context Engineering",
    leadNames: ["Nemwel Nyandoro", "Nicole Wambui"],
    members: ["Mercy Mwikali", "Zidane Gimiga"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "3",
    team: "Company-wide Leadership",
    leadNames: ["Kyla-Rei Mulligan", "Moses Mukundi"],
    members: [],
    isCompanyWide: true,
    createdAt: now,
    updatedAt: now,
  },
];

describe("findInDirectory", () => {
  it("matches a co-lead and surfaces the other co-lead(s)", () => {
    const match = findInDirectory(sample, "Newton");
    expect(match?.kind).toBe("lead");
    if (match?.kind === "lead") {
      expect(match.lead.team).toBe("Operations + Commercial");
      expect(match.coLeads).toEqual(["Francis Nyamu"]);
    }
  });

  it("matches a solo lead with no co-leads", () => {
    const match = findInDirectory(sample, "Nemwel");
    expect(match?.kind).toBe("lead");
    if (match?.kind === "lead") {
      expect(match.coLeads).toEqual(["Nicole Wambui"]);
    }
  });

  it("matches a regular member and returns their department + leads", () => {
    const match = findInDirectory(sample, "Mercy");
    expect(match?.kind).toBe("member");
    if (match?.kind === "member") {
      expect(match.lead.team).toBe("Clinical Context Engineering");
    }
  });

  it("resolves the company-wide leadership entry for either exec by full name", () => {
    const match = findInDirectory(sample, "Kyla-Rei Mulligan");
    expect(match?.kind).toBe("companyWide");
  });

  it("resolves the company-wide leadership entry from a first-name-only search", () => {
    const match = findInDirectory(sample, "Moses");
    expect(match?.kind).toBe("companyWide");
  });

  it("checks leadNames before members so a lead never resolves as a member", () => {
    const match = findInDirectory(sample, "Nicole Wambui");
    expect(match?.kind).toBe("lead");
  });

  it("returns null when nothing matches", () => {
    expect(findInDirectory(sample, "Nobody Here")).toBeNull();
  });

  it("returns null for an empty query", () => {
    expect(findInDirectory(sample, "   ")).toBeNull();
  });
});
