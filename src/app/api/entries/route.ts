import { type Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { fetchEntries } from "~/services/fetchEntries";
import { _prisma } from "~/services/prisma";

export async function POST(request: Request) {
  const payload = (await request.json()) as Prisma.EntryCreateInput;
  const entry = await _prisma.entry.create({ data: payload });
  return NextResponse.json(entry);
}

export async function GET() {
  const entries = await fetchEntries();
  return NextResponse.json(entries);
}
