import { ThemeProvider } from "@/components/theme-provider";
import { useEffect, useState } from "react";
import "../css/songlist.css";
import { IoMdPlay, IoMdPause } from "react-icons/io";
import { motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { setAudio, togglePlayPause, setPlaylist, openDrawer } from "../features/audio/audioSlice";
import { Audio } from "../features/audio/types";
import AudioPlayer from "./Audioplayer";

const Serveraudio = () => {
  const dispatch = useDispatch();
  const { currentAudio, isPlaying } = useSelector((state: RootState) => state.audio);
  const [songs, setSongs] = useState<Audio[]>([]);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch("https://test-flute.onrender.com/get-urls");
        if (!response.ok) throw new Error("Failed to fetch songs");
        const data = await response.json();

        setSongs(data.urls);
        dispatch(setPlaylist(data.urls));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    fetchSongs();
  }, [dispatch]);

  const togglePlayPauseHandler = (song: Audio, index: number) => {
    if (currentAudio?.title === song.title) {
      dispatch(togglePlayPause());
      dispatch(openDrawer());
    } else {
      dispatch(setAudio({ audio: song, index }));
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <p className="text-white text-lg">Loading songs...</p>
        </div>
      ) : (
        <motion.div
          key={songs.length} // Re-run animation when songs are fetched
          initial={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 0.3 }}
          exit={{ opacity: 0, translateY: 100 }}
        >
          <div className="songlist-container overflow-y-auto">
            <div className="flex flex-1 flex-col gap-4 p-2 pt-5">
              {songs.map((song, index) => (
                <div key={index} className="song-container" onClick={() => togglePlayPauseHandler(song, index)}>
                  <div className="play-pause-btn">
                    {currentAudio?.title === song.title && isPlaying ? <IoMdPause /> : <IoMdPlay />}
                  </div>
                  <img className="song-image" src={song.imageSrc} alt={song.name} />
                  <h1 className="song-name">{song.title}</h1>
                </div>
              ))}
            </div>
          </div>
          <AudioPlayer />
        </motion.div>
      )}
    </ThemeProvider>
  );
};

export default Serveraudio;
