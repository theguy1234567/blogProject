import { NextResponse } from "next/server";
import connectDB from "@/app/dbconfig/connectdb";
import getcurruser from "@/app/helper/getcurruser";
import Like from "@/app/models/likemodel";
import Post from "@/app/models/postmodel";
import mongoose from "mongoose";

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
    const { postId } = await req.json();

    if (!postId) {
      return NextResponse.json(
        { message: "postId is required" },
        { status: 400 },
      );
    }
    //  const postObjectId = new mongoose.Types.ObjectId(postId); if any error regardint the ObjectId add this and assign to postId

    //validating the Object id for the post
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json({ message: "Invalid Postid" }, { status: 400 });
    }
    //data integrity cannot like a post that does not exist
    const postexists = await Post.exists({ _id: postId });
    if (!postexists) {
      return NextResponse.json(
        { message: "Post does not exist" },
        { status: 404 },
      );
    }
    //try deleting if like exists
    const deleted = await Like.findOneAndDelete({
      postId,
      userId: user._id,
    });
    if (deleted) {
      //decreament the like count
      await Post.findByIdAndUpdate(postId, {
        $inc: { likesCount: -1 },
        $max: { likesCount: 0 },
      });

      return NextResponse.json({
        success: true,
        liked: false,
        message: "Unliked",
      });
    }
    ///if not found Create a like
    try {
      await Like.create({
        postId,
        userId: user._id,
      });
      //increament the likeCount
      await Post.findByIdAndUpdate(postId, {
        $inc: { likesCount: 1 },
      });

      return NextResponse.json({
        message: "Liked",
        success: true,
        liked: true,
      });
    } catch (error) {
      ///handle race condition
      if (error.code === 11000) {
        return NextResponse.json({
          success: true,
          liked: true,
          message: "Already Liked",
        });
      }
      throw error;
    }
  } catch (error) {
    console.error("LIKE API ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 },
    );
  }
}
