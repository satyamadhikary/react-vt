import React, { useRef, useEffect, useState, useCallback } from "react";
import "../css/embla.css";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { IoIosPause, IoIosPlay } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { setAudio, setPlaylist, togglePlayPause } from "../features/audio/audioSlice";
import { carouselData } from "@/arrays/CarouselData";

type Props = {
  images: { imageSrc: string; albumSrc: string }[];
  audio: string[];
  name: string[];
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<Props> = ({ options }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [currentIndex, setCurrentIndex] = useState(0);
  const dispatch = useDispatch();
  const { currentAudio, isPlaying } = useSelector((state: RootState) => state.audio);

  // Set playlist when component mounts
  useEffect(() => {
    dispatch(setPlaylist(carouselData));
  }, [dispatch]);

  const handleNextSlide = useCallback(() => {
    if (!emblaApi) return;
    const nextIndex = (currentIndex + 1) % carouselData.length;
    emblaApi.scrollTo(nextIndex);
    setCurrentIndex(nextIndex);
  }, [emblaApi, currentIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", () => setCurrentIndex(emblaApi.selectedScrollSnap()));
  }, [emblaApi]);

  const togglePlayPauseHandler = (index: number) => {
    const song = carouselData[index];
    const imageSrcToUse = song.albumSrc ? song.albumSrc : song.imageSrc;
  
    if (currentAudio?.name === song.name) {
      dispatch(togglePlayPause());
    } else {
      dispatch(setAudio({ 
        audio: { 
          audioSrc: song.audioSrc, 
          imageSrc: imageSrcToUse, 
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
                  imageSrc={item.albumSrc || item.imageSrc}
                  name={item.name}
                  onAudioEnd={handleNextSlide}
                  isPlaying={currentAudio?.name === item.name && isPlaying}
                  onTogglePlay={() => togglePlayPauseHandler(index)}
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
};

const CustomAudioPlayer: React.FC<AudioPlayerProps> = ({
  audioSrc,
  onAudioEnd,
  isPlaying,
  onTogglePlay,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const seekBarRef = useRef<HTMLInputElement | null>(null);

  const updateSeekBar = () => {
    if (audioRef.current && seekBarRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100 || 0;
      seekBarRef.current.value = progress.toString();
      seekBarRef.current.style.background = `linear-gradient(to right, #fff ${progress}%, #8a8a8a ${progress}%)`;
    }
  };


  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = (parseFloat(e.target.value) / 100) * (audioRef.current.duration || 1);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => {
      onAudioEnd();
    };

    audio.addEventListener("timeupdate", updateSeekBar);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateSeekBar);
      audio.removeEventListener("ended", onEnded);
    };
  }, [onAudioEnd]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

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
          defaultValue="0"
          onChange={handleSeek}
        />
        <audio ref={audioRef} muted src={audioSrc} preload="auto" />
      </div>
    </div>
  );
};

export default EmblaCarousel;
