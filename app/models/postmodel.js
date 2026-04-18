import mongoose from "mongoose";

const postschema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 5,
    },
    type: {
      type: String,
      required: true,
      enum: ["Blog", "Idea", "diary"],
      index: true,
    },
    category: {
      type: String,
      default: "Genral",
      enum: ["Software", "Cooking", "Gaming", "Promotion", "Entertainment"],
      index: true,
    },
    image: {
      type: String,
      default: "",
    },
    //if user does ideas
    lookingFor: [
      {
        type: String, // frontend, backend, design, ai, etc.
      },
    ],
    ideaStatus: {
      type: String,
      enum: ["open", "in-progress", "completed"],
      default: "open",
    },
    // For diary only
    isPublic: {
      type: Boolean,
      default: false,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Post = mongoose.models.posts || mongoose.model("posts", postschema);

export default Post;
