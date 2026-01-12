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

const AlbumClient = ({ album }: { album: Album }) => {
  const dispatch = useDispatch();
  const { currentAudio, isPlaying } = useSelector(
    (state: RootState) => state.audio
  );

  useEffect(() => {
    const audioSongs: Audio[] = album.songs.map((song) => ({
      ...song,
      id: song.id.toString(),
      title: song.name,
      imageSrc: [song.imageSrc],
    }));

    dispatch(setPlaylist(audioSongs));
  }, [album, dispatch]);

  const handleAlbumClick = (song: Song, index: number) => {
    const audioSong: Audio = {
      ...song,
      id: song.id.toString(),
      title: song.name,
      imageSrc: [song.imageSrc],
    };

    if (currentAudio?.title === audioSong.title) {
      dispatch(togglePlayPause());
      dispatch(openDrawer());
    } else {
      dispatch(setAudio({ audio: audioSong, index }));
      dispatch(openDrawer());
    }
  };

  return (
    <div className="songlist-container overflow-y-auto">
      <h2 className="text-2xl p-4 text-center">{album.name}</h2>

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
                {currentAudio?.title === song.name && isPlaying ? (
                  <IoMdPause />
                ) : (
                  <IoMdPlay />
                )}
              </div>

              <img
                className="song-image"
                src={song.imageSrc}
                alt={song.name}
              />

              <h1 className="song-name">{song.name}</h1>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AlbumClient;
