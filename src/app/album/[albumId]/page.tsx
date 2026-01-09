"use client";

import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import {
  setAudio,
  togglePlayPause,
  setPlaylist,
  openDrawer,
} from "@/features/audio/audioSlice";
import albumsData from "@/arrays/albumsData.json";
import { Audio } from "@/features/audio/types";
import { IoMdPlay, IoMdPause } from "react-icons/io";
import { useEffect } from "react";
import { motion } from "framer-motion";
import "@/app/css/songlist.css";

interface Song {
  id: number;
  name: string;
  imageSrc: string;
  audioSrc: string;
}

interface Album {
  id: string;
  name: string;
  imageSrc: string;
  songs: Song[];
}

export default function Page() {
  console.log("🔵 SongDetails component mounted");

  const params = useParams();
  console.log("🟡 useParams():", params);

  const { albumId } = params as { albumId?: string };
  console.log("🟠 albumId:", albumId);

  const dispatch = useDispatch();
  const audioState = useSelector((state: RootState) => state.audio);

  console.log("🟢 Redux audio state:", audioState);

  console.log("📀 albumsData:", albumsData);

  const album: Album | undefined = albumsData.find(
    (a) => a.id.toString() === albumId
  );

  console.log("🎵 matched album:", album);

  useEffect(() => {
    console.log("⚙️ useEffect triggered");

    if (!album) {
      console.error("❌ Album not found for albumId:", albumId);
      return;
    }

    const audioSongs: Audio[] = album.songs.map((song) => ({
      ...song,
      id: song.id.toString(),
      title: song.name,
      imageSrc: [song.imageSrc],
    }));

    console.log("🎧 Setting playlist:", audioSongs);

    dispatch(setPlaylist(audioSongs));
  }, [album, albumId, dispatch]);

  const handleAlbumClick = (song: Song, index: number) => {
    console.log("▶️ Song clicked:", song, "Index:", index);

    const audioSong: Audio = {
      ...song,
      id: song.id.toString(),
      title: song.name,
      imageSrc: [song.imageSrc],
    };

    if (audioState.currentAudio?.name === song.name) {
      console.log("⏯️ Toggling play/pause");
      dispatch(togglePlayPause());
      dispatch(openDrawer());
    } else {
      console.log("🎶 Setting new audio");
      dispatch(setAudio({ audio: audioSong, index }));
    }
  };

  if (!albumId) {
    return (
      <p className="text-red-500 text-center mt-10">
        ❌ albumId is undefined — check route name
      </p>
    );
  }

  if (!album) {
    return (
      <p className="text-red-500 text-center mt-10">
        ❌ Album not found for ID: {albumId}
      </p>
    );
  }

  return (
    <div className="songlist-container overflow-y-auto">
      <h2 className="text-2xl p-4 text-center">{album.name}</h2>

      <motion.div
        initial={{ opacity: 0, translateY: 50 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-1 flex-col gap-4 p-2 pt-5">
          {album.songs.map((song, index) => (
            <div
              key={song.id}
              className="song-container"
              onClick={() => handleAlbumClick(song, index)}
            >
              <div className="play-pause-btn">
                {audioState.currentAudio?.name === song.name &&
                audioState.isPlaying ? (
                  <IoMdPause />
                ) : (
                  <IoMdPlay />
                )}
              </div>

              <img
                className="song-image"
                src={song.imageSrc}
                alt={song.name}
                onError={() =>
                  console.error("❌ Image failed to load:", song.imageSrc)
                }
              />

              <h1 className="song-name">{song.name}</h1>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
