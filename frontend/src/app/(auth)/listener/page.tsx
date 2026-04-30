"use client";

import { useSession } from "next-auth/react";

export default function ListenerPage() {
  const { data: session } = useSession();

  if (session?.user?.role !== "listener") {
    return <div>Access Denied</div>;
  }

  return (
    <div className="p-10">
      <h1>Listener Dashboard 🎧</h1>
      <p>Browse and play music</p>
    </div>
  );
}