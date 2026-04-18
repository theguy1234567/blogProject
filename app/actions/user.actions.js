import connectDB from "../dbconfig/connectdb";
import getcurruser from "../helper/getcurruser";
import User from "../models/usermodel";

export default async function createUser(user) {
  try {
    await connectDB();
    const newUser = await User.create(user);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.log(error);
  }
}
