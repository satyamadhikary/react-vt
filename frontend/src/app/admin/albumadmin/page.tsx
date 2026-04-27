"use client";
import React, { useState } from "react";
import Swal from "sweetalert";
import { IoMdAdd, IoMdCheckmark } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";

const AdminPanel: React.FC = () => {
  const [albumTitle, setAlbumTitle] = useState("");
  const [albumImage, setAlbumImage] = useState<File | null>(null);
  const [songs, setSongs] = useState<{ title: string; audio: File | null }[]>(
    [],
  );
  const [loading, setLoading] = useState(false);

  const { uploadFile } = useCloudinaryUpload();
  const router = useRouter();

  const handleAlbumImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlbumImage(e.target.files ? e.target.files[0] : null);
  };

  const handleAddSong = () => {
    setSongs([...songs, { title: "", audio: null }]);
  };

  const handleSongChange = (
    index: number,
    field: "title" | "audio",
    value: string | File | null,
  ) => {
    const updated = [...songs];
    if (field === "title") updated[index].title = value as string;
    if (field === "audio") updated[index].audio = value as File;
    setSongs(updated);
  };

  const handleUpload = async () => {
    if (!albumTitle.trim() || !albumImage) {
      Swal(
        "Missing Data",
        "Please add album image and title first.",
        "warning",
      );
      return;
    }

    if (songs.length === 0 || songs.some((s) => !s.title || !s.audio)) {
      Swal("Incomplete Songs", "Please add songs properly.", "warning");
      return;
    }

    setLoading(true);

    try {
      // Safe album name
      const safeAlbum = albumTitle.replace(/\s+/g, "_").toLowerCase();

      // 1. Upload COVER only ONCE
      const coverRes = await uploadFile(albumImage, `albums/${safeAlbum}`);

      const coverUrl = coverRes.url;

      // 2. Upload songs
      const uploadedSongs = await Promise.all(
        songs.map(async (song) => {
          if (!song.audio) return null;

          const safeSong = song.title.replace(/\s+/g, "_").toLowerCase();

          const baseFolder = `albums/${safeAlbum}/${safeSong}`;

          // audio upload
          const audioRes = await uploadFile(song.audio, baseFolder);

          // optional per-song image
          // const imageRes = await uploadFile(albumImage, `${baseFolder}/image`);

          return {
            title: song.title,
            audioSrc: audioRes.url,
          };
        }),
      );

      const finalSongs = uploadedSongs.filter(Boolean) as {
        title: string;
        audioSrc: string;
        imageSrc: string;
      }[];

      if (finalSongs.length === 0) {
        throw new Error("Upload failed");
      }

      Swal("Success", "Album uploaded successfully!", "success");

      // Save to backend
      await saveToServer(albumTitle, coverUrl, finalSongs);

      // reset
      setAlbumTitle("");
      setAlbumImage(null);
      setSongs([]);
    } catch (error) {
      console.error(error);
      Swal("Error", "Upload failed!", "error");
    } finally {
      setLoading(false);
    }
  };

  const saveToServer = async (
    albumTitle: string,
    albumImage: string,
    songs: { title: string; audioSrc: string }[],
  ) => {
    try {
      const formattedData = {
        albumTitle: albumTitle,
        songs,
        imageSrc: [albumImage],
      };

      await fetch("http://localhost:5000/save-urls/albums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      Swal("Success", "Album saved to server!", "success");
    } catch (error) {
      Swal("Error", "Failed to save album!", "error");
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Upload Album</h1>

      {/* Album Info */}
      <div className="p-4 shadow-md rounded-md w-80 flex flex-col gap-4">
        <input type="file" accept="image/*" onChange={handleAlbumImageChange} />
        <input
          type="text"
          placeholder="Album Title"
          value={albumTitle}
          onChange={(e) => setAlbumTitle(e.target.value)}
          className="border p-2 rounded-md"
        />
      </div>

      {/* Songs */}
      {albumTitle && albumImage && (
        <div className="mt-4 w-80 bg-white p-4 shadow-md rounded-md">
          {songs.map((song, index) => (
            <div key={index} className="flex flex-col gap-2 p-2 border-b">
              <input
                type="text"
                placeholder="Song Title"
                value={song.title}
                onChange={(e) =>
                  handleSongChange(index, "title", e.target.value)
                }
                className="border p-2 rounded-md"
              />
              <input
                type="file"
                accept="audio/*"
                onChange={(e) =>
                  handleSongChange(index, "audio", e.target.files?.[0] || null)
                }
              />
              <button
                className="bg-green-500 text-white p-2 rounded-md"
                disabled={!song.title || !song.audio}
              >
                <IoMdCheckmark />
              </button>
            </div>
          ))}

          <button
            className="bg-blue-500 text-white p-2 rounded-md mt-2"
            onClick={handleAddSong}
          >
            <IoMdAdd />
          </button>
        </div>
      )}

      {/* Upload */}
      <button
        onClick={handleUpload}
        className="bg-green-500 text-white p-2 rounded-md mt-4"
      >
        {loading ? "Uploading..." : "Upload Album"}
      </button>

      {/* Navigation */}
      <div className="flex gap-2">
        <button
          onClick={() => router.push("/album")}
          className="bg-blue-500 text-white p-2 rounded-md mt-4"
        >
          View Albums
        </button>

        <button
          onClick={() => router.push("/admin")}
          className="bg-blue-500 text-white p-2 rounded-md mt-4"
        >
          Admin Panel
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
