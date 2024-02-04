import { NextResponse } from "next/server";
import { fetchAccounts } from "~/services/fetchAccounts";

export async function GET() {
  const accounts = await fetchAccounts();
  return NextResponse.json(accounts);
}
