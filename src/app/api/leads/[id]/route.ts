import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { updateTeamLead, deleteTeamLead } from "@/lib/db/leads";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const lead = await updateTeamLead(id, {
    team: body?.team,
    leadNames: Array.isArray(body?.leadNames) ? body.leadNames : undefined,
    leadEmail: body?.leadEmail,
    leadSlack: body?.leadSlack,
    members: Array.isArray(body?.members) ? body.members : undefined,
    notes: body?.notes,
    isCompanyWide: body?.isCompanyWide,
  });
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ lead });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const ok = await deleteTeamLead(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
