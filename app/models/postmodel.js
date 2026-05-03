import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 150,
      trim: true,
    },
    slug: {
      type: String,
      index: true,
      sparse: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Blog", "Idea", "Diary"],
      index: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived", "flagged"],
      default: "published",
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      maxlength: 200,
    },
    image: {
      type: String,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
      validate: [(arr) => arr.length <= 10, "Max 10 tags"],
    },
    category: {
      type: String,
      default: "General",
      enum: [
        "Software",
        "Cooking",
        "Gaming",
        "Promotion",
        "Entertainment",
        "Health",
        "Finance",
        "Education",
        "General",
      ],
    },

    // Idea-specific
    lookingFor: [
      {
        type: String,
        maxlength: 50,
        trim: true,
      },
    ],
    ideaStatus: {
      type: String,
      enum: ["open", "in-progress", "completed"],
      default: "open",
    },

    // Diary-specific
    isPublic: {
      type: Boolean,
      default: false,
    },

    // Engagement (atomic $inc updates only)
    likesCount: { type: Number, default: 0, min: 0 },
    commentsCount: { type: Number, default: 0, min: 0 },
    sharesCount: { type: Number, default: 0, min: 0 },
    bookmarksCount: { type: Number, default: 0, min: 0 },

    // Soft delete
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
  },
  { timestamps: true },
);

// Indexes
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ type: 1, createdAt: -1 });
postSchema.index({ type: 1, category: 1, createdAt: -1 });
postSchema.index({ tags: 1, createdAt: -1 });
postSchema.index({ ideaStatus: 1, type: 1 });
postSchema.index({ isDeleted: 1, status: 1, createdAt: -1 });

// Auto-excerpt
postSchema.pre("save", function () {
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.replace(/<[^>]+>/g, "").slice(0, 197) + "...";
  }
});
postSchema.pre("save", function () {
  if (!this.slug && this.title) {
    const base = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 60);

    const suffix = Math.random().toString(36).slice(2, 6);

    this.slug = `${base}-${suffix}`;
  }
});

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
export default Post;
