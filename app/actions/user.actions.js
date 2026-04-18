import connectDB from "../dbconfig/connectdb";
import User from "../models/usermodel";

export default async function createUser(user) {
  try {
    await connectDB();

    const newUser = await User.findOneAndUpdate(
      { clerkId: user.clerkId }, //  unique identifier
      user,
      {
        new: true,
        upsert: true, //  creates if not exists, updates if exists
        returnDocument: "after",
      },
    );

    return newUser;
  } catch (error) {
    console.error("Create user error:", error);
    throw error;
  }
}
