import { auth, currentUser } from "@clerk/nextjs/server";
import connectDB from "../dbconfig/connectdb";
import User from "../models/usermodel";

export default async function getcurruser() {
  const { userId } = await auth();

  if (!userId) return null;

  await connectDB();

  let user = await User.findOne({ clerkId: userId });

  //  KEY FIX: if webhook hasn't created user yet
  if (!user) {
    const clerkUser = await currentUser();

    user = await User.findOneAndUpdate(
      { clerkId: userId },
      {
        clerkId: userId,
        useremail: clerkUser?.emailAddresses[0]?.emailAddress || "",
        username: clerkUser?.username || "",
        avatar: clerkUser?.imageUrl || "",
      },
      { upsert: true, new: true },
    );
  }

  return user;
}
