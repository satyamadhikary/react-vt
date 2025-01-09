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

const EmblaCarousel: React.FC<PropType> = ({ images = [{ imageSrc: '' }], audio = [], options }) => {
  const [emblaRef] = useEmblaCarousel(options);

  return (
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {images.map((image, index) => (
            <div className="embla__slide" key={index}>
              <img src={image.imageSrc} alt={`Slide ${index + 1}`} className="embla-img" />
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
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    audioRef.current.paused ? audioRef.current.play() : audioRef.current.pause();
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

    const onPlayPause = () => setIsPlaying(!audio.paused);
    audio.addEventListener('timeupdate', updateSeekBar);
    audio.addEventListener('play', onPlayPause);
    audio.addEventListener('pause', onPlayPause);

    return () => {
      audio.removeEventListener('timeupdate', updateSeekBar);
      audio.removeEventListener('play', onPlayPause);
      audio.removeEventListener('pause', onPlayPause);
    };
  }, []);

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
      <audio ref={audioRef} src={src} preload="auto" />
    </div>
    </div>
  );
};

export default EmblaCarousel;
