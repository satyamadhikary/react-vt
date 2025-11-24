"use client";
import { useEffect, useState } from "react";
import "@/app/css/songlist.css";
import { IoMdPlay, IoMdPause } from "react-icons/io";
import { motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { setAudio, togglePlayPause, setPlaylist, openDrawer } from "@/features/audio/audioSlice";
import rawSongsData from "@/arrays/songsData.json";
import { Audio } from "@/features/audio/types";

const Songlist = () => {
  const dispatch = useDispatch();
  const { currentAudio, isPlaying } = useSelector((state: RootState) => state.audio);

  const [songs, setSongs] = useState<Audio[]>([]);

  useEffect(() => {
    // Convert string → array so it matches the Audio type
    const formattedSongs: Audio[] = rawSongsData.map(song => ({
      ...song,
      imageSrc: [song.imageSrc], // important
    }));

    setSongs(formattedSongs);
    dispatch(setPlaylist(formattedSongs));
  }, [dispatch]);

  const togglePlayPauseHandler = (song: Audio, index: number) => {
    if (currentAudio?.name === song.name) {
      dispatch(togglePlayPause());
      dispatch(openDrawer());
    } else {
      dispatch(setAudio({ audio: song, index }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 50 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.3 }}
      exit={{ opacity: 0, translateY: 100 }}
    >
      <div className="songlist-container overflow-y-auto">
        <div className="flex flex-1 flex-col gap-4 p-2 pt-5">

          {songs.map((song, index) => (
            <div
              key={index}
              className="song-container"
              onClick={() => togglePlayPauseHandler(song, index)}
            >
              <div className="play-pause-btn">
                {currentAudio?.name === song.name && isPlaying ? <IoMdPause /> : <IoMdPlay />}
              </div>

              {/* now song.imageSrc is ALWAYS an array */}
              <img className="song-image" src={song.imageSrc[0]} alt={song.name} />

              <h1 className="song-name">{song.name}</h1>
            </div>
          ))}

        </div>
      </div>
    </motion.div>
  );
};

export default Songlist;
