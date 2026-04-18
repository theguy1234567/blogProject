import connectDB from "@/app/dbconfig/connectdb";
import User from "@/app/models/usermodel";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import getcurruser from "@/app/helper/getcurruser";

export async function POST(req) {
  const user = await getcurruser();
  if (!user) {
    return NextResponse.json(
      {
        message: "Unauthorized singin or signup to use",
      },
      { status: 401 },
    );
  }
  try {
  } catch (error) {}
}
