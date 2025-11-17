"use client";
import React from "react";
import { useRouter } from "next/navigation";
import albumsData from "@/arrays/albumsData.json";

const AlbumList: React.FC = () => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {albumsData.map((album) => (
        <div
          key={album.id}
          className="cursor-pointer"
          onClick={() => router.push(`/album/${album.id}`)}
        >
          <img
            src={album.imageSrc}
            alt={album.name}
            className="rounded-lg w-full h-40 object-cover"
          />
          <p className="text-white text-center mt-2">{album.name}</p>
        </div>
      ))}
    </div>
  );
};

export default AlbumList;
