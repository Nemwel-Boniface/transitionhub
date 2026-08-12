import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { listTeamLeads, createTeamLead } from "@/lib/db/leads";

export async function GET() {
  const leads = await listTeamLeads();
  return NextResponse.json({ leads });
}

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  if (!body?.team || !Array.isArray(body?.leadNames) || body.leadNames.length === 0) {
    return NextResponse.json(
      { error: "team and at least one leadNames entry are required." },
      { status: 400 }
    );
  }
  const lead = await createTeamLead({
    team: body.team,
    leadNames: body.leadNames,
    leadEmail: body.leadEmail,
    leadSlack: body.leadSlack,
    members: Array.isArray(body.members) ? body.members : [],
    notes: body.notes,
    isCompanyWide: body.isCompanyWide,
  });
  return NextResponse.json({ lead }, { status: 201 });
}
