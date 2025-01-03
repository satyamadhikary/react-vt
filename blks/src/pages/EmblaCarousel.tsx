import React, { useRef, useEffect, useState } from 'react';
import "../css/embla.css";
import { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { IoIosPause, IoIosPlay } from "react-icons/io";

type PropType = {
  images: { imageSrc: string }[];
  audio: string[];
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { images = [{ imageSrc: '' }], audio = [], options } = props;
  const [emblaRef] = useEmblaCarousel(options);

  return (
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {images.map((image, index) => (
            <div className="embla__slide" key={index}>
              {/* Image */}
              <img
                src={image.imageSrc}
                alt={`Slide ${index + 1}`}
                className="embla-img"
              />

              {/* Custom Audio Player */}
              {audio[index] && <CustomAudioPlayer src={audio[index]} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CustomAudioPlayer: React.FC<{ src: string }> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const seekBarRef = useRef<HTMLInputElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false); // State to toggle play/pause

  const updateSeekBarBackground = (percentage: number) => {
    if (seekBarRef.current) {
      seekBarRef.current.style.background = `linear-gradient(to right, #fff ${percentage}%, #8a8a8a ${percentage}%)`;
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    const seekBar = seekBarRef.current;

    if (audio && seekBar) {
      const handleTimeUpdate = () => {
        const percentage = (audio.currentTime / audio.duration) * 100;
        seekBar.value = percentage.toString();
        updateSeekBarBackground(percentage);
      };

      const handleSeek = () => {
        const newTime = (parseFloat(seekBar.value) / 100) * audio.duration;
        audio.currentTime = newTime;
        updateSeekBarBackground(parseFloat(seekBar.value));
      };

      const handlePlayPause = () => setIsPlaying(!audio.paused);

      // Add event listeners
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('play', handlePlayPause);
      audio.addEventListener('pause', handlePlayPause);
      seekBar.addEventListener('input', handleSeek);

      // Cleanup event listeners
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('play', handlePlayPause);
        audio.removeEventListener('pause', handlePlayPause);
        seekBar.removeEventListener('input', handleSeek);
      };
    }
  }, []);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  };

  return (
    <div className="embla-audio">
      <div className="custom-audio-player">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          className="play-pause-button"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <IoIosPause /> : <IoIosPlay />}
        </button>

        {/* Seek Bar */}
        <input
          ref={seekBarRef}
          type="range"
          className="seek-bar"
          min="0"
          max="100"
          step="0.1"
          defaultValue="0"
        />

        {/* Hidden Audio Element */}
        <audio ref={audioRef} src={src} preload="auto"></audio>
      </div>
    </div>
  );
};

export default EmblaCarousel;
