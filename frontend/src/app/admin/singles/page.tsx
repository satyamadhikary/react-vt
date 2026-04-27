"use client";
import React, { useState } from "react";
import Swal from "sweetalert";
import { useRouter } from "next/navigation";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";

const Singles: React.FC = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [songTitle, setSongTitle] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [downloadUrls, setDownloadUrls] = useState<
    { title: string; audioSrc: string; imageSrc: string }[]
  >([]);

  const { uploadFile, loading } = useCloudinaryUpload();
  const router = useRouter();

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAudioFile(e.target.files ? e.target.files[0] : null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageFile(e.target.files ? e.target.files[0] : null);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!audioFile || !imageFile || !songTitle.trim()) {
      Swal("Missing Data", "Please select audio, image, and enter a title.", "warning");
      return;
    }

    try {
      // Make folder safe
      const safeTitle = songTitle.replace(/\s+/g, "_").toLowerCase();
      const baseFolder = `singles/${safeTitle}`;

      // Upload audio
      const audioRes = await uploadFile(audioFile, `${baseFolder}/audio`);
      setAudioUrl(audioRes.url);

      // Upload image
      const imageRes = await uploadFile(imageFile, `${baseFolder}/image`);

      const newEntry = {
        title: songTitle,
        audioSrc: audioRes.url,
        imageSrc: imageRes.url,
      };

      setDownloadUrls((prev) => [...prev, newEntry]);

      Swal("Success", "Song uploaded successfully!", "success");

      // Reset form
      setSongTitle("");
      setAudioFile(null);
      setImageFile(null);

    } catch (error) {
      console.error("Upload error:", error);
      Swal("Upload Error", "Error during upload!", "error");
    }
  };

  const saveUrlsToServer = async () => {
    try {
      const response = await fetch(
        "https://flute-backend.onrender.com/save-urls/urls",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(downloadUrls),
        }
      );

      const data = await response.json();

      Swal("Success", `File saved on server: ${data.message}`, "success");
    } catch (error) {
      console.error("Error saving file:", error);
      Swal("Save Error", "Error saving file on server!", "error");
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Upload Audio</h1>

      <form
        className="p-4 shadow-md rounded-md w-80 flex flex-col gap-4"
        onSubmit={handleUpload}
      >
        <input type="file" accept="audio/*" onChange={handleAudioChange} />
        <input type="file" accept="image/*" onChange={handleImageChange} />

        <input
          type="text"
          placeholder="Enter Song Title"
          value={songTitle}
          onChange={(e) => setSongTitle(e.target.value)}
          className="border p-2 rounded-md"
        />

        <button className="bg-green-500 text-white p-2 rounded-md">
          {loading ? "Uploading..." : "Upload Audio"}
        </button>
      </form>

      {/* 🎧 Audio Preview */}
      {audioUrl && (
        <audio controls className="mt-4 w-80">
          <source src={audioUrl} />
        </audio>
      )}

      {/* 💾 Save Button */}
      <button
        onClick={saveUrlsToServer}
        className="bg-blue-500 text-white p-2 rounded-md mt-4"
      >
        Save URLs to Server
      </button>

      {/* 🔁 Navigation */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={() => router.push("/admin/serveraudio")}
          className="bg-blue-500 text-white p-2 rounded-md mt-4"
        >
          View your Added Songs
        </button>

        <button
          onClick={() => router.push("/admin")}
          className="bg-blue-500 text-white p-2 rounded-md mt-4"
        >
          Go to Admin Panel
        </button>
      </div>

      {/* 📜 Uploaded List */}
      <ul className="mt-4 bg-white p-4 shadow-md w-80 rounded-md">
        {downloadUrls.map((item, index) => (
          <li key={index} className="border-b p-2 text-black">
            <p>
              <strong>Audio:</strong>{" "}
              <a href={item.audioSrc} target="_blank">
                Listen
              </a>
            </p>
            <p>
              <strong>Image:</strong>{" "}
              <a href={item.imageSrc} target="_blank">
                View
              </a>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Singles;