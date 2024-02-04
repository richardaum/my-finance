import { NextResponse } from "next/server";
import { fetchEntries } from "~/services/fetchEntries";
import { prisma } from "~/services/prisma";

export async function POST(request: Request) {
  const entry = await prisma.entry.create({
    data: await request.json(),
  });

  return NextResponse.json(entry);
}

export async function GET() {
  const entries = await fetchEntries();
  return NextResponse.json(entries);
}
