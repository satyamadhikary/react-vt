"use client";
import React from "react";
import albumsData from "@/arrays/albumsData.json";
import Link from "next/link";

const AlbumList: React.FC = () => {

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {albumsData.map((album) => (
        <Link
          key={album.id}
          className="cursor-pointer"
          href={`/album/${album.id}`}
        >
          <img
            src={album.imageSrc}
            alt={album.name}
            className="rounded-lg w-full h-40 object-cover"
          />
          <p className="text-white text-center mt-2">{album.name}</p>
        </Link>
      ))}
    </div>
  );
};

export default AlbumList;
