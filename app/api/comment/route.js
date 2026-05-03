import getcurruser from "@/app/helper/getcurruser";
import connectDB from "@/app/dbconfig/connectdb";
import { NextResponse } from "next/server";
import Comment from "@/app/models/commentmodel";
import mongoose from "mongoose";
import Post from "@/app/models/postmodel";

export async function POST(req) {
  try {
    await connectDB();
    const user = await getcurruser();
    if (!user) {
      return NextResponse.json(
        {
          message: "Unauthorized! login to get started",
        },
        { status: 401 },
      );
    }
    //validations
    const { postId, text, parentId } = await req.json();
    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json({ message: "Invalid postId" }, { status: 400 });
    }
    const postExists = await Post.exists({ _id: postId });
    if (!postExists) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { message: "Comment cannot be empty" },
        { status: 400 },
      );
    }
    if (parentId && !mongoose.Types.ObjectId.isValid(parentId)) {
      return NextResponse.json(
        { message: "Invalid parentId" },
        { status: 400 },
      );
    }
    //createing the comment
    const comment = await Comment.create({
      postId,
      userId: user._id,
      text: text.trim(),
      parentId: parentId || null,
    });

    //increamenting the commentcount
    await Post.findByIdAndUpdate(postId, {
      $inc: { commentsCount: 1 },
    });

    return NextResponse.json({
      message: "Commented successfully",
      success: true,
      comment,
    });
  } catch (error) {
    console.log("Something went wrong with the Comment api", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
