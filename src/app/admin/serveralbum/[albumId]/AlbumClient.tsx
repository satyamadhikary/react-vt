"use client";
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
import { useEffect } from "react";
import { motion } from "framer-motion";
import "@/app/css/songlist.css";

type AlbumClientProps = {
  album: {
    title: string;
    imageSrc: string[];
    songs: Audio[];
  };
};

const AlbumClient = ({ album }: AlbumClientProps) => {
  const dispatch = useDispatch();
  const { currentAudio, isPlaying } = useSelector(
    (state: RootState) => state.audio
  );

  // Set playlist once when album loads
  useEffect(() => {
    dispatch(setPlaylist(album.songs));
  }, [album.songs, dispatch]);

  const handleAlbumClick = (song: Audio, index: number) => {
    const updatedSong = {
      ...song,
      imageSrc: [album.imageSrc?.[0] || ""],
    };

    if (currentAudio?.title === song.title) {
      dispatch(togglePlayPause());
      dispatch(openDrawer());
    } else {
      dispatch(setAudio({ audio: updatedSong, index }));
      dispatch(openDrawer());
    }
  };

  return (
    <div className="songlist-container overflow-y-auto">
      <h2 className="text-2xl p-4 text-center">{album.title}</h2>

      <motion.div
        initial={{ opacity: 0, translateY: 50 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col gap-4 p-2 pt-5">
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
  );
};

export default AlbumClient;
