import { ThemeProvider } from "@/components/theme-provider";
import "../css/songlist.css";
import { IoMdPlay, IoMdPause } from "react-icons/io";
import { motion } from "motion/react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { setAudio, stopAudio, updateSeekbar, setDuration } from "../features/audio/audioSlice";
import { songsData } from "../arrays/songsData";
import { Audio } from "../features/audio/types";

const Songlist = () => {
  const dispatch = useDispatch();
  const { currentAudio, isPlaying, currentTime } = useSelector((state: RootState) => state.audio);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);

  const togglePlayPause = (index: number, song: Audio) => {
    const currentAudioElement = audioRefs.current[index];

    if (currentAudioElement) {
      if (currentAudio?.name === song.name && isPlaying) {
        currentAudioElement.pause();
        currentAudioElement.muted = true;
        dispatch(stopAudio());
      } else {
        audioRefs.current.forEach((audio, i) => {
          if (audio && i !== index) {
            audio.pause();
            currentAudioElement.muted = true;
          }
        });
        dispatch(setAudio(song));

        if (currentAudio?.name === song.name) {
          currentAudioElement.currentTime = currentTime;
        }

        currentAudioElement.play();
      }
    }
  };

  const handleLoadedMetadata = (index: number) => {
    const currentAudioElement = audioRefs.current[index];
    if (currentAudioElement) {
      dispatch(setDuration(currentAudioElement.duration));
    }
  };

  const handleTimeUpdate = (index: number) => {
    const currentAudioElement = audioRefs.current[index];
    if (!isPlaying || !currentAudioElement) return; // Stop updates when paused

    dispatch(updateSeekbar({
      currentTime: currentAudioElement.currentTime,
      duration: currentAudioElement.duration
    }));
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
                <div className="play-pause-btn" onClick={() => togglePlayPause(index, song)}>
                  {currentAudio?.name === song.name && isPlaying ? <IoMdPause /> : <IoMdPlay />}
                </div>
                <img className="song-image" src={song.imageSrc} alt={song.name} />
                <audio
                  ref={(el) => (audioRefs.current[index] = el)}
                  src={song.audioSrc}
                  onLoadedMetadata={() => handleLoadedMetadata(index)}
                  onTimeUpdate={() => handleTimeUpdate(index)}
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
