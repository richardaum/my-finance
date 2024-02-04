import { NextResponse } from "next/server";
import { fetchCategories } from "~/services/fetchCategories";

export async function GET() {
  const categories = await fetchCategories();
  return NextResponse.json(categories);
}
