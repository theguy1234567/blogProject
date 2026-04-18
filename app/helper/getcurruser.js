import { auth } from "@clerk/nextjs/server";
import connectDB from "../dbconfig/connectdb";
import { NextResponse } from "next/server";
import User from "../models/usermodel";

//simple function to return the current uuser from clerk

export default async function getcurruser() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "no user found sign in or signup" });
  }
  await connectDB();

  const user = await User.findOne({ clerkId: userId });
  return user;
}
