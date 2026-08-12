import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { updateRelationship, deleteRelationship } from "@/lib/db/relationships";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const relationship = await updateRelationship(id, {
    clientName: body?.clientName,
    relationshipOwner: body?.relationshipOwner,
    currentBrand: body?.currentBrand,
    futureBrand: body?.futureBrand,
    transitionMethod: body?.transitionMethod,
    targetDate: body?.targetDate,
    status: body?.status,
    informed: typeof body?.informed === "boolean" ? body.informed : undefined,
    outstandingActions: body?.outstandingActions,
  });
  if (!relationship) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ relationship });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const ok = await deleteRelationship(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
