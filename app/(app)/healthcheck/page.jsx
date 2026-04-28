"use client";
import React from "react";

function Healthcheck() {
  const handleclick = async () => {
    try {
      const res = await fetch("/api/healthcheck", {
        method: "GET",
      });
      if (res.ok) {
        const reply = await res.json();
        console.log(reply.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button
        className="bg-amber-50 p-4 text-black"
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
