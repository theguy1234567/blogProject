const likeSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true },
);

// Prevent duplicate likes
likeSchema.index({ postId: 1, userId: 1 }, { unique: true });

export default mongoose.models.likes || mongoose.model("likes", likeSchema);
