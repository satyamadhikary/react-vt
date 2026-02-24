"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import "../app/css/embla.css";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { IoIosPause, IoIosPlay } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { setAudio, setPlaylist, togglePlayPause, updateSeekbar } from "@/features/audio/audioSlice";
import carouselData from "@/arrays/CarouselData.json";
import songsData from "@/arrays/songsData.json";

type Props = {
  images: { imageSrc: string}[];
  audio: string[];
  name: string[];
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<Props> = ({ options }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [currentIndex, setCurrentIndex] = useState(0);
  const dispatch = useDispatch();
  const { currentAudio, isPlaying, currentTime, duration } = useSelector((state: RootState) => state.audio);


  useEffect(() => {
  const formattedSongs = songsData.map(song => ({
    ...song,
    imageSrc: Array.isArray(song.imageSrc) ? song.imageSrc : [song.imageSrc]
  }));

  dispatch(setPlaylist(formattedSongs));
}, [dispatch]);

  const handleNextSlide = useCallback(() => {
    if (!emblaApi) return;
    const nextIndex = (currentIndex + 1) % songsData.length;
    emblaApi.scrollTo(nextIndex);
    setCurrentIndex(nextIndex);
  }, [emblaApi, currentIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", () => setCurrentIndex(emblaApi.selectedScrollSnap()));
  }, [emblaApi]);

  const togglePlayPauseHandler = (index: number) => {
    const song = songsData[index];

    if (currentAudio?.name === song.name) {
      dispatch(togglePlayPause());
    } else {
      dispatch(setAudio({
        audio: {
          audioSrc: song.audioSrc,
          imageSrc: [song.imageSrc],
          name: song.name
        },
        index
      }));
    }
  };

  return (
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {carouselData.map((item, index) => (
            <div className="embla__slide" key={index}>
              <img src={item.imageSrc} alt={`Slide ${index + 1}`} className="embla-img" />
              {item.audioSrc && (
                <CustomAudioPlayer
                  audioSrc={item.audioSrc}
                  imageSrc={item.imageSrc}
                  name={item.name}
                  onAudioEnd={handleNextSlide}
                  isPlaying={currentAudio?.name === item.name && isPlaying}
                  onTogglePlay={() => togglePlayPauseHandler(index)}
                  currentTime={currentTime}
                  duration={duration}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

type AudioPlayerProps = {
  audioSrc: string;
  imageSrc: string;
  name: string;
  onAudioEnd: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentTime: number;
  duration: number;
};

const CustomAudioPlayer: React.FC<AudioPlayerProps> = ({
  audioSrc,
  name,
  isPlaying,
  onTogglePlay,
  currentTime,
  duration,
}) => {
  const seekBarRef = useRef<HTMLInputElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [localCurrentTime, setLocalCurrentTime] = useState(0);
  const dispatch = useDispatch();
  const { currentAudio } = useSelector((state: RootState) => state.audio);

  // Reset local time when a different audio starts playing
  useEffect(() => {
    if (currentAudio?.name !== name) {
      setLocalCurrentTime(0); // Reset seek bar for other tracks
    }
  }, [currentAudio, name]);

  // Sync local time only if it's the currently playing audio
  useEffect(() => {
    if (isPlaying) {
      setLocalCurrentTime(currentTime);
    }
  }, [currentTime, isPlaying]);

  // Update seek bar background
  useEffect(() => {
    if (seekBarRef.current) {
      const progress = (localCurrentTime / duration) * 100;
      seekBarRef.current.style.background = `linear-gradient(to right, rgb(0, 138, 172) ${progress}%, rgb(210, 210, 210) ${progress}%)`;
    }
  }, [localCurrentTime, duration]);

  // Handle seek bar interaction
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPercentage = parseFloat(e.target.value);
    const newTime = (newPercentage / 100) * duration;

    if (!isPlaying) return; // Prevent seek bar updates when audio is paused

    setLocalCurrentTime(newTime);
    dispatch(updateSeekbar({ currentTime: newTime, duration }));

    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  return (
    <div className="embla-audio">
      <div className="custom-audio-player">
        <button onClick={onTogglePlay} aria-label={isPlaying ? "Pause" : "Play"} className="play-pause-button">
          {isPlaying ? <IoIosPause /> : <IoIosPlay />}
        </button>
        <input
          ref={seekBarRef}
          type="range"
          className="seek-bar"
          min="0"
          max="100"
          step="0.1"
          value={(localCurrentTime / duration) * 100 || 0}
          onChange={handleSeek}
        />
      </div>
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={() => {
          if (audioRef.current && isPlaying) {
            setLocalCurrentTime(audioRef.current.currentTime);
          }
        }}
      />
    </div>
  );
};




export default EmblaCarousel;
