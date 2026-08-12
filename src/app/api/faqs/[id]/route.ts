import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { updateFaq, deleteFaq } from "@/lib/db/faqs";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const faq = await updateFaq(id, {
    question: body?.question,
    answer: body?.answer,
    category: body?.category,
    tags: Array.isArray(body?.tags) ? body.tags : undefined,
  });
  if (!faq) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ faq });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const ok = await deleteFaq(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
