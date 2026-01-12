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
import { Audio } from "@/features/audio/types";
import { IoMdPlay, IoMdPause } from "react-icons/io";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "@/app/css/songlist.css";

const ServeralbumDetails = () => {
  const params = useParams();
  const albumId = Array.isArray(params.albumId)
    ? params.albumId[0]
    : params.albumId;

  const dispatch = useDispatch();
  const { currentAudio, isPlaying } = useSelector(
    (state: RootState) => state.audio
  );

  const [album, setAlbum] = useState<{
    title: string;
    imageSrc: string[];
    songs: Audio[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const response = await fetch(
          `https://test-flute.onrender.com/get-urls/albums`
        );
        if (!response.ok) throw new Error("Failed to fetch album");

        const data = await response.json();

        // Always compare using sanitized ID
        const foundAlbum = data.data.find((a: any) => a._id === albumId);
        const songsWithImageSrc = foundAlbum.songs.map((song: Audio) => ({
          ...song,
          imageSrc: song.imageSrc || foundAlbum.imageSrc || [],
        }));
        if (foundAlbum) {
          setAlbum({
            ...foundAlbum,
            songs: songsWithImageSrc,
          });
          dispatch(setPlaylist(songsWithImageSrc));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [albumId, dispatch]);

  const handleAlbumClick = (song: Audio, index: number) => {
    if (!album) return;

    const updatedSong = {
      ...song,
      imageSrc: album.imageSrc || song.imageSrc || [],
    };

    if (currentAudio?.title === song.title) {
      dispatch(togglePlayPause());
      dispatch(openDrawer());
    } else {
      dispatch(setAudio({ audio: updatedSong, index }));
    }
  };

  if (loading)
    return <p className="text-white text-center mt-10">Loading album...</p>;
  if (!album)
    return <p className="text-white text-center mt-10">song not found.</p>;

  return (
    <>
      <div className="songlist-container overflow-y-auto">
        <h2 className="text-2xl p-4 text-center">{album.title}</h2>

        <motion.div
          initial={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 0.3 }}
          exit={{ opacity: 0, translateY: 100 }}
        >
          <div className="flex flex-1 flex-col gap-4 p-2 pt-5">
            {album.songs.map((song, index) => (
              <div
                key={index}
                className="song-container"
                onClick={() => handleAlbumClick(song, index)}
              >
                <div className="play-pause-btn">
                  {currentAudio?.title === song.title && isPlaying ? (
                    <IoMdPause />
                  ) : (
                    <IoMdPlay />
                  )}
                </div>

                <img
                  className="song-image"
                  src={album.imageSrc[0]}
                  alt={album.title}
                />
                <h1 className="song-name">{song.title}</h1>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ServeralbumDetails;