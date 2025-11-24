"use client";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { setAudio, togglePlayPause, setPlaylist, openDrawer } from "@/features/audio/audioSlice";
import albumsData from "@/arrays/albumsData.json";
import { Audio } from "@/features/audio/types";
import { IoMdPlay, IoMdPause } from "react-icons/io";
import { useEffect } from "react";
import { motion } from "framer-motion";
import "@/app/css/songlist.css";

// Local interfaces for the JSON data structure
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

const SongDetails = () => {
  const { albumId } = useParams();
  const dispatch = useDispatch();
  const { currentAudio, isPlaying } = useSelector((state: RootState) => state.audio);

  // Find album by ID
  const album: Album | undefined = albumsData.find((a) => a.id.toString() === albumId);

  useEffect(() => {
    if (album) {
      const audioSongs: Audio[] = album.songs.map((song) => ({
        ...song,
        id: song.id.toString(),
        title: song.name,
        imageSrc: [song.imageSrc],
      }));
      dispatch(setPlaylist(audioSongs));
    }
  }, [album, dispatch]);

  const handleAlbumClick = (song: Song, index: number) => {
    const audioSong: Audio = {
      ...song,
      id: song.id.toString(),
      title: song.name,
      imageSrc: [song.imageSrc],
    };

    if (currentAudio?.name === song.name) {
      dispatch(togglePlayPause());
      dispatch(openDrawer());
    } else {
      dispatch(setAudio({ audio: audioSong, index }));
    }
  };

  if (!album) {
    return <p className="text-white text-center mt-10">Album not found.</p>;
  }

  return (
    <>
      <div className="songlist-container overflow-y-auto">
        <h2 className="text-2xl p-4 text-center">{album.name}</h2>
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
                  {currentAudio?.name === song.name && isPlaying ? <IoMdPause /> : <IoMdPlay />}
                </div>
                <img className="song-image" src={song.imageSrc} alt={song.name} />
                <h1 className="song-name">{song.name}</h1>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default SongDetails;
