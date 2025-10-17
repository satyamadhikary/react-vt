import React, { useState } from "react";
import Swal from "sweetalert";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};


const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const Singles: React.FC = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [songTitle, setSongTitle] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [downloadUrls, setDownloadUrls] = useState<{ title: string; audioSrc: string; imageSrc: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

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

    setLoading(true);
    try {
      // Upload Audio
      const audioRef = ref(storage, `audio/${audioFile.name}`);
      await uploadBytes(audioRef, audioFile);
      const audioDownloadUrl = await getDownloadURL(audioRef);
      setAudioUrl(audioDownloadUrl);

      // Upload Image
      const imageRef = ref(storage, `images/${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      const imageDownloadUrl = await getDownloadURL(imageRef);

      // Update list
      const newEntry = { title: songTitle, audioSrc: audioDownloadUrl, imageSrc: imageDownloadUrl };
      setDownloadUrls((prev) => [...prev, newEntry]);

      Swal("Success", "Song uploaded successfully!", "success");
    } catch (error) {
      console.error("Error during upload:", error);
      Swal("Upload Error", "Error during upload!", "error");
    } finally {
      setLoading(false);
    }
  };

  const saveUrlsToServer = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://test-flute.onrender.com/save-urls/urls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(downloadUrls),
      });
      const data = await response.json();
      Swal("Success", `File saved on server: ${data.message}`, "success");
    } catch (error) {
      console.error("Error saving file:", error);
      Swal("Save Error", "Error saving file on server!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Upload Audio</h1>
      <form className=" p-4 shadow-md rounded-md w-80 flex flex-col gap-4" onSubmit={handleUpload}>
        <input type="file" accept="audio/*" onChange={handleAudioChange} />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <input
          type="text"
          placeholder="Enter Song Title"
          value={songTitle}
          onChange={(e) => setSongTitle(e.target.value)}
          className="border p-2 rounded-md"
        />
        <button type="submit" className="bg-green-500 text-white p-2 rounded-md relative">
          {loading ? "Uploading..." : "Upload Audio"}
        </button>
      </form>

      {audioUrl && (
        <audio controls className="mt-4 w-80">
          <source src={audioUrl} type="audio/mp3" />
        </audio>
      )}

      <button
        onClick={saveUrlsToServer}
        className="bg-blue-500 text-white p-2 rounded-md mt-4 relative"
      >
        {loading ? "Saving..." : "Save URLs to Server"}
      </button>


<div style={{display: 'flex', gap: '10px'}}>
      <button
        onClick={() => navigate("/serveraudio")}
        className="bg-blue-500 text-white p-2 rounded-md mt-4 relative"
      >
       View your Added Songs
      </button>

      <button
        onClick={() => navigate("/admin")}
        className="bg-blue-500 text-white p-2 rounded-md mt-4 relative"
      >
        Go to Admin Panel
      </button>
      </div>

      <ul className="mt-4 bg-white p-4 shadow-md w-80 rounded-md">
        {downloadUrls.map((item, index) => (
          <li key={index} className="border-b p-2" style={{color: 'black'}}>
            <p><strong>Audio:</strong> <a href={item.audioSrc} target="_blank" rel="noopener noreferrer">Listen</a></p>
            <p><strong>Image:</strong> <a href={item.imageSrc} target="_blank" rel="noopener noreferrer">View</a></p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Singles;
