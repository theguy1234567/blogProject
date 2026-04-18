import { NextRequest, NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ message: "hello from backend!" }, { status: 200 });
}
