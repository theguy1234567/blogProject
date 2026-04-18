"use client";
import React from "react";

function Healthcheck() {
  const handleclick = async () => {
    const res = await fetch("/api/healthcheck", {
      method: "GET",
    });
    if (res.ok) {
      const reply = await res.json();
      console.log(reply.message);
    }
  };

  return (
    <div>
      <button
        onClick={() => {
          handleclick();
        }}
      >
        check
      </button>
    </div>
  );
}

export default Healthcheck;
