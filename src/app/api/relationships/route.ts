import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { listRelationships, createRelationship } from "@/lib/db/relationships";

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const relationships = await listRelationships();
  return NextResponse.json({ relationships });
}

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  if (!body?.clientName || !body?.relationshipOwner) {
    return NextResponse.json(
      { error: "clientName and relationshipOwner are required." },
      { status: 400 }
    );
  }
  const relationship = await createRelationship({
    clientName: body.clientName,
    relationshipOwner: body.relationshipOwner,
    currentBrand: body.currentBrand ?? "Eden Care",
    futureBrand: body.futureBrand ?? "Ginja.ai",
    transitionMethod: body.transitionMethod ?? "",
    targetDate: body.targetDate ?? "",
    status: body.status ?? "Not started",
    informed: Boolean(body.informed),
    outstandingActions: body.outstandingActions ?? "",
  });
  return NextResponse.json({ relationship }, { status: 201 });
}
