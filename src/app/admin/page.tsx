"use client";
import React from "react";
import { useRouter } from "next/navigation";

const AdminPanel: React.FC = () => {
  const router = useRouter();

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <div className="flex gap-4 mt-4">
        <div onClick={() => router.push("/admin/singles")} className="bg-blue-500 text-white p-2 rounded-md">
          Go to Singles Page
        </div>
        <div onClick={() => router.push("/admin/albumadmin")} className="bg-blue-500 text-white p-2 rounded-md">
          Go to Album Admin Panel
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
