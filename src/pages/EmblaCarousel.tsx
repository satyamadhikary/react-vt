import React, { useRef, useEffect, useState, useCallback } from "react";
import "../css/embla.css";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { IoIosPause, IoIosPlay } from "react-icons/io";
import { setAudio } from "../features/audio/audioSlice";
import { useDispatch } from "react-redux";

type Props = {
  images: { imageSrc: string }[];
  audio: string[];
  name: string[];
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<Props> = ({ images = [], audio = [], name = [],options }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [currentIndex, setCurrentIndex] = useState(0);
  const dispatch = useDispatch();

  const handleNextSlide = useCallback(() => {
    if (!emblaApi) return;
    const nextIndex = (currentIndex + 1) % images.length;
    emblaApi.scrollTo(nextIndex);
    setCurrentIndex(nextIndex);
  }, [emblaApi, currentIndex, images.length]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", () => setCurrentIndex(emblaApi.selectedScrollSnap()));
  }, [emblaApi]);

  return (
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {images.map((image, index) => (
            <div className="embla__slide" key={index}>
              <img src={image.imageSrc} alt={`Slide ${index + 1}`} className="embla-img" />
              {audio[index] && (
                <CustomAudioPlayer
                  audioSrc={audio[index]}
                  imageSrc={image.imageSrc}
                  name={name[index]} // Replace with actual song name if available
                  onAudioEnd={handleNextSlide}
                  onPlay={() =>
                    dispatch(
                      setAudio({
                        audio: {
                          audioSrc: audio[index],
                          imageSrc: image.imageSrc,
                          name: name[index],
                        },
                        index,
                      })
                    )
                  }
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
  onPlay: () => void;
};

const CustomAudioPlayer: React.FC<AudioPlayerProps> = ({ audioSrc, onAudioEnd, onPlay }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const seekBarRef = useRef<HTMLInputElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play();
      onPlay(); // Dispatch Redux action
    } else {
      audioRef.current.pause();
    }
    setIsPlaying(!audioRef.current.paused);
  };

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
      setIsPlaying(false);
      onAudioEnd(); // Move to next slide when audio ends
    };

    audio.addEventListener("timeupdate", updateSeekBar);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateSeekBar);
      audio.removeEventListener("ended", onEnded);
    };
  }, [onAudioEnd]);

  return (
    <div className="embla-audio">
      <div className="custom-audio-player">
        <button onClick={togglePlayPause} aria-label={isPlaying ? "Pause" : "Play"} className="play-pause-button">
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
