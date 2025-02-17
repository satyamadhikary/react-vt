import { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store";
import { updateSeekbar, nextAudio } from "../features/audio/audioSlice";


const AudioPlayer = () => {
    const dispatch = useDispatch();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const { currentAudio, isPlaying, currentTime } = useSelector((state: RootState) => state.audio);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch((err) => console.error("Playback error:", err));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentAudio]); // Correct dependencies

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.currentTime = currentTime;
        }
    }, [currentTime]); // Ensure playback resumes from last position

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            dispatch(updateSeekbar({ currentTime: audioRef.current.currentTime, duration: audioRef.current.duration }));
        }
    };

    return (
        <audio
            ref={audioRef}
            src={currentAudio?.audioSrc || ""}
            onEnded={() => dispatch(nextAudio())} 
            onTimeUpdate={handleTimeUpdate}
            muted
        />
    );
};

export default AudioPlayer;
