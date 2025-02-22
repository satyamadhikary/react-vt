import { ThemeProvider } from "@/components/theme-provider";
import { useEffect } from "react";
import "../css/songlist.css";
import { IoMdPlay, IoMdPause } from "react-icons/io";
import { motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { setAudio, togglePlayPause, setPlaylist } from "../features/audio/audioSlice";
import { songsData } from "../arrays/songsData";
import { Audio } from "../features/audio/types";
import AudioPlayer from "./Audioplayer";

const Songlist = () => {
  const dispatch = useDispatch();
  const { currentAudio, isPlaying } = useSelector((state: RootState) => state.audio);

  useEffect(() => {
    dispatch(setPlaylist(songsData)); // Set the playlist when the component mounts
  }, [dispatch]);

  const togglePlayPauseHandler = (song: Audio, index: number) => {
    if (currentAudio?.name === song.name) {
      dispatch(togglePlayPause());
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
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <div className="flex flex-1 flex-col gap-4 p-2 pt-5">
            {songsData.map((song, index) => (
              <div key={index} className="song-container" onClick={() => togglePlayPauseHandler(song, index)}>
                <div className="play-pause-btn">
                  {currentAudio?.name === song.name && isPlaying ? <IoMdPause /> : <IoMdPlay />}
                </div>
                <img className="song-image" src={song.imageSrc} alt={song.name} />
                <h1 className="song-name">{song.name}</h1>
              </div>
            ))}
          </div>
        </ThemeProvider>
      </div>
      <AudioPlayer />
    </motion.div>
  );
};

export default Songlist;
