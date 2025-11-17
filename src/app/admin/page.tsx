"use client";
import React from "react";
import Link from "next/link";

const AdminPanel: React.FC = () => {
  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <div className="flex gap-4 mt-4">
        <Link
          href="/admin/singles"
          className="bg-blue-500 text-white p-2 rounded-md"
        >
          Go to Singles Page
        </Link>
        <Link
          href="/admin/albumadmin"
          className="bg-blue-500 text-white p-2 rounded-md"
        >
          Go to Album Admin Panel
        </Link>
      </div>
    </div>
  );
};

export default AdminPanel;
