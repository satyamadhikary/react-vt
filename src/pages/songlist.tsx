import { ThemeProvider } from "@/components/theme-provider";
import "../css/songlist.css";
import { IoMdPlay, IoMdPause } from "react-icons/io";
import { motion } from "motion/react";
import { useState, useRef } from "react";
import { songsData } from "../arrays/songsData";

const Songlist = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null); // Track the current playing song index
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]); // Reference to all audio elements

  const togglePlayPause = (index: number) => {
    // Pause all other audios
    audioRefs.current.forEach((audio, i) => {
      if (audio && i !== index) {
        audio.pause();
      }
    });

    // Toggle play/pause for the selected audio
    const currentAudio = audioRefs.current[index];
    if (currentAudio) {
      if (currentSongIndex === index && !currentAudio.paused) {
        currentAudio.pause();
        setCurrentSongIndex(null);
      } else {
        currentAudio.play();
        setCurrentSongIndex(index);
      }
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
              <div key={index} className="song-container">
                <div
                  className="play-pause-btn"
                  onClick={() => togglePlayPause(index)}
                >
                  {currentSongIndex === index && audioRefs.current[index] && !audioRefs.current[index]?.paused ? (
                    <IoMdPause />
                  ) : (
                    <IoMdPlay />
                  )}
                </div>
                <img className="song-image" src={song.imageSrc} alt={song.name} />
                <audio
                  ref={(el) => (audioRefs.current[index] = el)}
                  src={song.audioSrc}
                ></audio>
                <h1 className="song-name">{song.name}</h1>
              </div>
            ))}
          </div>
        </ThemeProvider>
      </div>
    </motion.div>
  );
};

export default Songlist;
