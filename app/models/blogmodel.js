import mongoose from "mongoose";

const blogschema = new mongoose.Schema(
  {
    title: {
      type: String,
      minlength: 10,
      required: [true, "title is required"],
    },
    slug: {
      type: String,
      default: "",
      lowercase: true,
      trim: true,
    },
    imageurl: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      enum: ["Software", "Idea", "Tech", "Gaming", "movies"],
      required: true,
    },
    content: {
      type: String,
      minlength: 20,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    visibility: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

blogschema.pre("save", function () {
  if (this.slug == "") {
    const res = this.title.split(/\s+/);
    this.slug = res.join("-");
  }
  console.log(this.slug);
});

const Blog = mongoose.models.blog || mongoose.model("blog", blogschema);

export default Blog;
