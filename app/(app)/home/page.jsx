"use client";

import { useEffect, useState } from "react";

const fetchFeed = async (page = 1) => {
  const res = await fetch(`/api/feed?page=${page}&limit=10&type=all`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch");

  return res.json();
};

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadPosts();
  }, [page]);

  const loadPosts = async () => {
    setLoading(true);
    const data = await fetchFeed(page);

    setPosts((prev) => [...prev, ...data.posts]);
    setHasMore(data.hasMore);
    setLoading(false);
  };

  return (
    <>
      <div className="bg"></div>
    </>
  );
}
