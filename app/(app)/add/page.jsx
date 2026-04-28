"use client";

import { useState } from "react";

export default function CreatePostPage() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    type: "Blog",
    category: "General",
    tags: "",
    lookingFor: "",
    ideaStatus: "open",
    isPublic: false,
    status: "published",
  });

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const payload = {
        title: form.title,
        content: form.content,
        type: form.type,
        category: form.category,
        status: form.status,
        image: "",
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
      };

      if (form.type === "Idea") {
        payload.lookingFor = form.lookingFor
          ? form.lookingFor.split(",").map((s) => s.trim())
          : [];
        payload.ideaStatus = form.ideaStatus;
      }

      if (form.type === "Diary") {
        payload.isPublic = form.isPublic;
      }

      const res = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();

      setResponse({
        status: res.status,
        data: text,
      });
    } catch (err) {
      setResponse({ error: err.message });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-zinc-900 p-6 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold mb-6">Create Post</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Content */}
          <textarea
            name="content"
            placeholder="Content"
            value={form.content}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Type */}
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700"
          >
            <option value="Blog">Blog</option>
            <option value="Idea">Idea</option>
            <option value="Diary">Diary</option>
          </select>

          {/* Category */}
          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700"
          />

          {/* Tags */}
          <input
            name="tags"
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700"
          />

          {/* Idea fields */}
          {form.type === "Idea" && (
            <>
              <input
                name="lookingFor"
                placeholder="Looking for (comma separated)"
                value={form.lookingFor}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700"
              />

              <select
                name="ideaStatus"
                value={form.ideaStatus}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700"
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </>
          )}

          {/* Diary fields */}
          {form.type === "Diary" && (
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isPublic"
                checked={form.isPublic}
                onChange={handleChange}
              />
              Public Diary
            </label>
          )}

          {/* Status */}
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg font-semibold"
          >
            {loading ? "Creating..." : "Create Post"}
          </button>
        </form>

        {/* Response */}
        {response && (
          <pre className="mt-6 bg-black p-4 rounded-lg text-green-400 overflow-x-auto text-sm">
            {JSON.stringify(response, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
