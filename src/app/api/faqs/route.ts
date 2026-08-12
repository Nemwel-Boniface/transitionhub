import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { listFaqs, createFaq } from "@/lib/db/faqs";

export async function GET() {
  const faqs = await listFaqs();
  return NextResponse.json({ faqs });
}

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  if (!body?.question || !body?.answer || !body?.category) {
    return NextResponse.json(
      { error: "question, answer and category are required." },
      { status: 400 }
    );
  }
  const faq = await createFaq({
    question: body.question,
    answer: body.answer,
    category: body.category,
    tags: Array.isArray(body.tags) ? body.tags : [],
  });
  return NextResponse.json({ faq }, { status: 201 });
}
