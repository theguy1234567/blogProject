import { NextResponse } from "next/server";
import connectDB from "@/app/dbconfig/connectdb";
import getcurruser from "@/app/helper/getcurruser";
import mongoose from "mongoose";
import Post from "@/app/models/postmodel";

export async function GET(req) {
  try {
    await connectDB();

    // public route
    const user = await getcurruser().catch(() => null);

    const userId = user?._id ? new mongoose.Types.ObjectId(user._id) : null;

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const type = searchParams.get("type") || "all";

    const skip = (page - 1) * limit;

    const matchStage = {
      status: "published",
      isDeleted: false,
    };

    if (type !== "all") {
      matchStage.type = type;
    }

    const pipeline = [
      { $match: matchStage },

      { $sort: { createdAt: -1 } },

      { $skip: skip },
      { $limit: limit },

      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },

      {
        $lookup: {
          from: "likes",
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$postId", "$$postId"] },
                    ...(userId ? [{ $eq: ["$userId", userId] }] : []),
                  ],
                },
              },
            },
          ],
          as: "liked",
        },
      },

      {
        $addFields: {
          isLikedByUser: userId ? { $gt: [{ $size: "$liked" }, 0] } : false,
        },
      },

      {
        $project: {
          liked: 0,
        },
      },
    ];

    const posts = await Post.aggregate(pipeline);

    return NextResponse.json({
      success: true,
      page,
      count: posts.length,
      hasMore: posts.length === limit,
      posts,
    });
  } catch (error) {
    console.error("FEED API ERROR:", error);

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
