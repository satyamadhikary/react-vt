"use client";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { setAudio, togglePlayPause, setPlaylist, openDrawer } from "@/features/audio/audioSlice";
import { Audio } from "@/features/audio/types";
import { IoMdPlay, IoMdPause } from "react-icons/io";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "@/app/css/songlist.css";

const ServerAudioDetails = () => {
    const { audioId } = useParams();
    const dispatch = useDispatch();
    const { currentAudio, isPlaying } = useSelector((state: RootState) => state.audio);

    const [audio, setAudioData] = useState<Audio | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAudio = async () => {
            try {
                const response = await fetch(`/api/get-urls/urls/${audioId}`);
                if (!response.ok) throw new Error("Failed to fetch audio");

                const data = await response.json();
                
                if (data.data) {
                    setAudioData(data.data);
                    dispatch(setPlaylist([data.data])); // Set playlist in Redux
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (audioId) {
            fetchAudio();
        }
    }, [audioId, dispatch]);

    const handleAudioClick = (song: Audio) => {
        if (!audio) return; 
      
        if (currentAudio?.title === song.title) {
          dispatch(togglePlayPause());
          dispatch(openDrawer());
        } else {
          dispatch(setAudio({ audio: song, index: 0 }));
        }
      };

    if (loading) return <p className="text-white text-center mt-10">Loading audio...</p>;
    if (!audio) return <p className="text-white text-center mt-10">Audio not found.</p>;

    return (
        <>
            <div className="songlist-container overflow-y-auto">
                <h2 className="text-2xl p-4 text-center">{audio.title}</h2>

                <motion.div
                    initial={{ opacity: 0, translateY: 50 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ duration: 0.3 }}
                    exit={{ opacity: 0, translateY: 100 }}
                >
                    <div className="flex flex-1 flex-col gap-4 p-2 pt-5">
                        <div className="song-container" onClick={() => handleAudioClick(audio)}>
                            <div className="play-pause-btn">
                                {currentAudio?.title === audio.title && isPlaying ? <IoMdPause /> : <IoMdPlay />}
                            </div>
                            <img className="song-image" src={audio.imageSrc[0]} alt={audio.title} />
                            <h1 className="song-name">{audio.title}</h1>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default ServerAudioDetails;
