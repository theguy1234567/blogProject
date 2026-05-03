import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post", //
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", //
      required: true,
      index: true, //
    },
  },
  {
    timestamps: true,
  },
);

//  Prevent duplicate likes
likeSchema.index({ postId: 1, userId: 1 }, { unique: true });

//  Fast lookup for feed
likeSchema.index({ postId: 1, createdAt: -1 });

const Like = mongoose.models.Like || mongoose.model("Like", likeSchema);

export default Like;
