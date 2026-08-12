import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { listQuestions, createQuestion } from "@/lib/db/questions";

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const questions = await listQuestions();
  return NextResponse.json({ questions });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.question || typeof body.question !== "string" || !body.question.trim()) {
    return NextResponse.json({ error: "question is required." }, { status: 400 });
  }
  const question = await createQuestion({
    question: body.question,
    name: body.name,
    email: body.email,
  });
  return NextResponse.json({ question }, { status: 201 });
}
