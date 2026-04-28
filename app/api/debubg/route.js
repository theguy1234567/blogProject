import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/app/dbconfig/connectdb";

export async function GET() {
  const results = {};

  // Step 1: Test auth
  try {
    const { userId } = await auth();
    results.auth = { ok: true, userId };
  } catch (e) {
    results.auth = { ok: false, error: e.message };
  }

  // Step 2: Test DB
  try {
    await connectDB();
    results.db = { ok: true };
  } catch (e) {
    results.db = { ok: false, error: e.message };
  }

  return NextResponse.json(results);
}
