import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { setAudio, togglePlayPause, setPlaylist, openDrawer } from "../features/audio/audioSlice";
import { albumsData } from "@/arrays/albumsData";
import { Audio } from "../features/audio/types";
import { IoMdPlay, IoMdPause } from "react-icons/io";
import { useEffect } from "react";
import { motion } from "framer-motion";
import AudioPlayer from "./Audioplayer";

const SongDetails = () => {
  const { albumId } = useParams();
  const dispatch = useDispatch();
  const { currentAudio, isPlaying } = useSelector((state: RootState) => state.audio);

  // Find album by ID
  const album = albumsData.find((a) => a.id.toString() === albumId);

  useEffect(() => {
    if (album) {
      dispatch(setPlaylist(album.songs));
    }
  }, [album, dispatch]);

  const handleAlbumClick = (song: Audio, index: number) => {
    if (currentAudio?.name === song.name) {
      dispatch(togglePlayPause());
      dispatch(openDrawer());
    } else {
      dispatch(setAudio({ audio: song, index }));
    }
  };

  if (!album) {
    return <p className="text-white text-center mt-10">Album not found.</p>;
  }

  return (
    <>
      <div className="songlist-container overflow-y-auto">
        <h2 className="text-white text-2xl p-4">{album.name}</h2>
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
                <img className="song-image" src={song.imageSrc} />
                <h1 className="song-name">{song.name}</h1>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <AudioPlayer />
    </>
  );
};

export default SongDetails;
