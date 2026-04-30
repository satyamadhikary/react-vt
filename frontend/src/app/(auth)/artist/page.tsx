"use client";

import { useSession } from "next-auth/react";

export default function ArtistPage() {
  const { data: session } = useSession();

  if (session?.user?.role !== "artist") {
    return <div>Access Denied</div>;
  }

  return (
    <div className="p-10">
      <h1>Artist Dashboard 🎤</h1>
      <p>Upload songs, manage content</p>
    </div>
  );
}