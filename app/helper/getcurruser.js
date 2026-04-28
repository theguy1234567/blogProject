import { auth, currentUser } from "@clerk/nextjs/server";
import User from "../models/usermodel";

export default async function getcurruser() {
  try {
    console.log("🔹 getcurruser: start");

    const { userId } = await auth();
    console.log("🔹 Clerk userId:", userId);

    if (!userId) {
      console.log("❌ No userId (not logged in)");
      return null;
    }

    console.log("🔹 Checking DB for user...");
    let user = await User.findOne({ clerkId: userId });

    if (user) {
      console.log("✅ User found in DB");
      return user;
    }

    console.log("⚠️ User not found, fetching from Clerk...");

    let clerkUser;
    try {
      clerkUser = await currentUser();
      console.log("🔹 Clerk user fetched");
    } catch (err) {
      console.log("❌ Clerk error:", err);
      return null; // prevents hanging
    }

    if (!clerkUser) {
      console.log("❌ Clerk user is null");
      return null;
    }

    console.log("🔹 Creating/updating user in DB...");

    user = await User.findOneAndUpdate(
      { clerkId: userId },
      {
        clerkId: userId,
        useremail: clerkUser.emailAddresses?.[0]?.emailAddress || "",
        username: clerkUser.username || "",
        avatar: clerkUser.imageUrl || "",
      },
      { upsert: true, new: true },
    );

    console.log("✅ User created/updated in DB");

    return user;
  } catch (error) {
    console.log("❌ getcurruser ERROR:", error);
    return null; // never let it crash your API
  }
}
