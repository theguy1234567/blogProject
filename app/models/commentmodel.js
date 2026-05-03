import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    text: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    //Future Replies
    parentId: {
      type: mongoose.Schema.ObjectId,
      ref: "Comment",
      default: null,
      index: true,
    },
  },
  { timestamps: true },
);
//index for fetching comments
commentSchema.index({ postId: 1, createdAt: -1 });
const Comment =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);

export default Comment;
