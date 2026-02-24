"use client";
import React, { useState } from "react";
import Swal from "sweetalert";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { IoMdAdd, IoMdCheckmark } from "react-icons/io";
import { useRouter } from "next/navigation";

// 🔹 Firebase Config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const AdminPanel: React.FC = () => {
  const [albumTitle, setAlbumTitle] = useState<string>("");
  const [albumImage, setAlbumImage] = useState<File | null>(null);
  const [songs, setSongs] = useState<{ title: string; audio: File | null; audioUrl: string | null }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleAlbumImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlbumImage(e.target.files ? e.target.files[0] : null);
  };

  const handleAddSong = () => {
    setSongs([...songs, { title: "", audio: null, audioUrl: null }]);
  };

  const handleSongChange = (index: number, field: "title" | "audio", value: string | File | null) => {
    const updatedSongs = [...songs];
    if (field === "title") updatedSongs[index].title = value as string;
    if (field === "audio") updatedSongs[index].audio = value as File;
    setSongs(updatedSongs);
  };

  const handleUpload = async () => {
    if (!albumTitle.trim() || !albumImage) {
      Swal("Missing Data", "Please add album image and title first.", "warning");
      return;
    }
    if (songs.length === 0 || songs.some((song) => !song.title || !song.audio)) {
      Swal("Incomplete Songs", "Please add at least one song with title and audio.", "warning");
      return;
    }

    setLoading(true);
    try {
      console.log("🚀 Uploading album image...");

      // 🔹 Upload Album Image
      const imageRef = ref(storage, `albums/${Date.now()}_${albumImage.name}`);
      await uploadBytes(imageRef, albumImage);
      const imageUrl = await getDownloadURL(imageRef);
      console.log("✅ Image uploaded:", imageUrl);

      // 🔹 Upload Songs and Collect URLs
      const uploadedSongs = await Promise.all(
        songs.map(async (song) => {
          if (!song.audio) return null;
          const audioRef = ref(storage, `songs/${Date.now()}_${song.audio.name}`);
          await uploadBytes(audioRef, song.audio);
          const audioUrl = await getDownloadURL(audioRef);
          console.log(`✅ Uploaded song: ${song.title} -> ${audioUrl}`);
          return { title: song.title, audioSrc: audioUrl };
        })
      );

      // 🔹 Remove failed uploads
      const finalSongs = uploadedSongs.filter((s) => s !== null) as { title: string; audioSrc: string }[];

      // 🔹 Ensure all URLs are valid before saving
      if (!imageUrl || finalSongs.length === 0) {
        Swal("Error", "Failed to upload album image or songs!", "error");
        return;
      }

      Swal("Success", "Album and songs uploaded successfully!", "success");

      // 🔹 Save to Server with Correct Data Format
      saveToServer(albumTitle, imageUrl, finalSongs);
    } catch (error) {
      console.error("❌ Upload Error:", error);
      Swal("Error", "Failed to upload album and songs!", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fix saveToServer to match backend format
  const saveToServer = async (albumTitle: string, albumImage: string, songs: { title: string; audioSrc: string }[]) => {
    setLoading(true);
    try {
      const formattedData = {
        albumTitle: albumTitle,
        songs, // ✅ Songs are now an array of objects with title & audioSrc
        imageSrc: [albumImage], // ✅ Sent as an array
      };

      console.log("📤 Sending data to server:", JSON.stringify(formattedData, null, 2));

      const response = await fetch("https://flute-backend.onrender.com/save-urls/albums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      Swal("Success", "Album saved to server!", "success");
      setAlbumTitle("");
      setAlbumImage(null);
      setSongs([]);
    } catch (error) {
      console.error("❌ Save Error:", error);
      Swal("Error", "Failed to save album!", "error");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Upload Album</h1>

      {/* Album Image and Title */}
      <div className="p-4 shadow-md rounded-md w-80 flex flex-col gap-4">
        <input type="file" accept="image/*" onChange={handleAlbumImageChange} />
        <input
          type="text"
          placeholder="Enter Album Title"
          value={albumTitle}
          onChange={(e) => setAlbumTitle(e.target.value)}
          className="border p-2 rounded-md"
        />
      </div>

      {/* Add Songs Section */}
      {albumTitle && albumImage && (
        <div className="songlist-container mt-4 w-80 bg-white p-4 shadow-md rounded-md">
          {songs.map((song, index) => (
            <div key={index} className="flex flex-col gap-2 p-2 border-b">
              <input
                type="text"
                placeholder="Enter Song Title"
                value={song.title}
                onChange={(e) => handleSongChange(index, "title", e.target.value)}
                className="border p-2 rounded-md"
              />
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => {
                  const file = e.target.files ? e.target.files[0] : null;
                  handleSongChange(index, "audio", file);
                  if (file) alert(`🎵 Selected: ${file.name}`); // ✅ Show filename
                }}
              />
              <button className="bg-green-500 text-white p-2 rounded-md flex items-center justify-center" disabled={!song.title || !song.audio}>
                <IoMdCheckmark className="text-white text-xl" />
              </button>
            </div>
          ))}

          {/* Add Song Button */}
          <button className="bg-blue-500 text-white p-2 rounded-md flex items-center justify-center mt-2" onClick={handleAddSong}>
            <IoMdAdd className="text-white text-xl" />
          </button>
        </div>
      )}

      {/* Upload & Save Buttons */}
      <button onClick={handleUpload} className="bg-green-500 text-white p-2 rounded-md mt-4" disabled={loading}>
        {loading ? "Uploading..." : "Upload Details"}
      </button>

      <div className="flex gap-[10px]">
        <button
          onClick={() => router.push("/album")}
          className="bg-blue-500 text-white p-2 rounded-md mt-4 relative"
        >
          View your Added Albums
        </button>

        <button
          onClick={() => router.push("/admin")}
          className="bg-blue-500 text-white p-2 rounded-md mt-4 relative"
        >
          Go to Admin Panel
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
