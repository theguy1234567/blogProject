import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/dbconfig/connectdb";
import getcurruser from "@/app/helper/getcurruser";
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

    const body = await req.json();
    const {
      title,
      type,
      content,
      image,
      tags,
      category,
      lookingFor,
      ideaStatus,
      isPublic,
      status,
    } = body;

    //validations

    if (!title || title.length < 5) {
      return NextResponse.json(
        {
          message: "Title must be atleast 5 chars long",
        },
        { status: 400 },
      );
    }
    if (!content) {
      return NextResponse.json({
        message: "Content is required",
      });
    }
    if (!["Blog", "Idea", "Diary"].includes(type)) {
      return NextResponse.json({ message: "Invalid type" }, { status: 400 });
    }
    if (tags && !Array.isArray(tags)) {
      return NextResponse.json(
        { message: "Tags must be an array" },
        { status: 400 },
      );
    }
    const VALID_CATEGORIES = [
      "Software",
      "Cooking",
      "Gaming",
      "Promotion",
      "Entertainment",
      "Health",
      "Finance",
      "Education",
      "General",
    ];

    if (category && !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { message: "Invalid category" },
        { status: 400 },
      );
    }

    const postData = {
      author: user._id,
      title: title.trim(),
      type: type,
      status: status || "published",
      content: content,
      image: image || "",
      tags: tags ? tags.map((t) => t.toLowerCase().trim()) : [],
      category: category || "General",
    };

    if (type === "Idea") {
      if (!lookingFor || lookingFor.length === 0) {
        return NextResponse.json(
          { success: false, message: "Idea must include lookingFor" },
          { status: 400 },
        );
      }
      postData.lookingFor = lookingFor.map((s) => s.trim());
      postData.ideaStatus = ideaStatus || "open";
    }
    if (type === "Diary") {
      postData.isPublic = isPublic ?? false;
    }

    const newpost = await Post.create(postData);

    return NextResponse.json(
      {
        success: true,
        message: "Post created successsfully",
        post: newpost,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
