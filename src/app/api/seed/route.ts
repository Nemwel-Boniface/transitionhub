import { NextResponse } from "next/server";
import { seedIfEmpty } from "@/lib/db/seed";

export async function POST() {
  const result = await seedIfEmpty();
  return NextResponse.json(result);
}
