import connectDB from "@/app/dbconfig/connectdb";
import Post from "@/app/models/postmodel"; // make sure path is correct
import { NextResponse } from "next/server";
import getcurruser from "@/app/helper/getcurruser";

export async function POST(req) {
  try {
    // 1. Connect DB
    await connectDB();

    // 2. Get current user
    const user = await getcurruser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized. Sign in to continue." },
        { status: 401 },
      );
    }

    // 3. Parse body
    const body = await req.json();

    const {
      title,
      content,
      type,
      category,
      image,
      lookingFor,
      ideaStatus,
      isPublic,
    } = body;

    // 4. Basic validation
    if (!title || !type || !content) {
      return NextResponse.json(
        { message: "Title, type, and content are required" },
        { status: 400 },
      );
    }

    // 5. Conditional validation
    if (type === "Idea" && (!lookingFor || lookingFor.length === 0)) {
      return NextResponse.json(
        { message: "Ideas must include lookingFor field" },
        { status: 400 },
      );
    }

    // 6. Create post
    const newPost = await Post.create({
      title,
      content,
      type,
      category,
      image,
      lookingFor,
      ideaStatus,
      isPublic,
      userId: user._id, // IMPORTANT: link post to user
    });

    // 7. Response
    return NextResponse.json(
      {
        message: "Post created successfully",
        post: newPost,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST ERROR:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
