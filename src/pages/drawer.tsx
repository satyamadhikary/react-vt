import ReactPlayer from "react-player";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { togglePlayPause, updateSeekbar, openDrawer } from "../features/audio/audioSlice";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerDescription, DrawerTrigger } from "@/components/ui/drawer";
import { MdSkipPrevious, MdSkipNext } from "react-icons/md";
import { MdOutlinePauseCircleFilled } from "react-icons/md";
import { IoPlayCircleSharp } from "react-icons/io5";
import { RiPlayList2Line } from "react-icons/ri";
import { Skeleton } from "@/components/ui/skeleton";
import "../css/drawer.css";

const DrawerPage = () => {
    const dispatch = useDispatch();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const playerRef = useRef<ReactPlayer | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const { currentAudio, currentTime, duration, isPlaying } = useSelector((state: RootState) => state.audio);
    const seekBarRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(err => console.error("Playback error:", err));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentAudio]);

    const handlePlayPause = () => {
        if (currentAudio) {
            dispatch(togglePlayPause());
            if (audioRef.current) {
                if (isPlaying) {
                    audioRef.current.pause();
                } else {
                    audioRef.current.play().catch(err => console.error("Playback error:", err));
                }
            }
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPercentage = parseFloat(e.target.value);
        const newTime = (newPercentage / 100) * duration;

        dispatch(updateSeekbar({ currentTime: newTime, duration }));

        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
        }
        if (playerRef.current) {
            playerRef.current.seekTo(newTime, "seconds");
        }
    };


    useEffect(() => {
        if (seekBarRef.current) {
            const progress = (currentTime / duration) * 100;
            seekBarRef.current.value = progress.toString();
            seekBarRef.current.style.background = `linear-gradient(to right, rgb(0, 138, 172) ${progress}%, rgb(210, 210, 210) ${progress}%)`;
        }
    }, [currentTime, duration]);


    useEffect(() => {
        const savedTime = localStorage.getItem("currentTime");
        if (savedTime && playerRef.current) {
            playerRef.current.seekTo(parseFloat(savedTime), "seconds");
        }
    }, []);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    useEffect(() => {
        if (currentAudio && isPlaying) {
            dispatch(openDrawer());
        }
    }, [currentAudio, isPlaying, dispatch]);


    const [isWideScreen, setIsWideScreen] = useState(window.innerWidth < 425);

    useEffect(() => {
        const handleResize = () => setIsWideScreen(window.innerWidth < 425);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    return (
        <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
            <DrawerTrigger>
                {currentAudio ? (
                    <div className="songbar" onClick={() => isWideScreen && setIsDrawerOpen(true)}>
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                            <img className="songbar-cover" src={currentAudio.imageSrc} alt="Album Cover" />
                            <div className="songbar-content">
                                <p className="song-title">{currentAudio.name}</p>
                                <p className="song-artist">{currentAudio.name}</p>
                            </div>
                        </div>
                        <div className="seekbar-container">
                            <div className="songbar-seekbar">

                                <div className="songbar-control">
                                    <MdSkipPrevious />
                                    <div className="play-btn" onClick={handlePlayPause}>
                                        {isPlaying ? <MdOutlinePauseCircleFilled /> : <IoPlayCircleSharp />}
                                    </div>
                                    <MdSkipNext />
                                </div>

                                <div className="time-display">
                                    <span>{formatTime(currentTime)}</span>
                                    <input
                                        ref={seekBarRef}
                                        className="seekbar-drawer"
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={(currentTime / duration) * 100 || 0}
                                        step="0.1"
                                        onChange={handleSeek}
                                        style={{ width: "100%", height: "3px", backgroundColor: "rgb(210, 210, 210)" }}
                                    />
                                    <span>{formatTime(duration)}</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsDrawerOpen(true)}>
                            <RiPlayList2Line />
                        </button>
                    </div>
                ) : (
                    <div style={{ transform: "translateY(15vh)", opacity: "0" }}></div>
                )}

            </DrawerTrigger>

            <DrawerContent>
                <video
                    style={{
                        width: "100vw",
                        height: "100%",
                        objectFit: "fill",
                        position: "absolute",
                        zIndex: "-2",
                        filter: "blur(10px)",
                    }}
                    autoPlay
                    playsInline
                    webkit-playsinline
                    loop
                    preload="auto"
                    src="https://firebasestorage.googleapis.com/v0/b/flute-8592b.appspot.com/o/drawerVideo%2Funwatermark_istockphoto-1317284271-640_adpp_is%20(1)%20(1)%20(1).mp4?alt=media&token=9c3876b5-dcd6-4887-b720-cf530ceef3b5"
                />

                {currentAudio ? (
                    <div className="drawer-content">
                        <DrawerHeader>
                            <img className="album-cover" src={currentAudio.imageSrc} alt="Album Cover" />
                        </DrawerHeader>

                        <div className="song-details">
                            <DrawerHeader>
                                <DrawerTitle className="song-title">{currentAudio.name}</DrawerTitle>
                                <DrawerDescription className="song-artist">Now Playing</DrawerDescription>
                            </DrawerHeader>

                            <DrawerFooter>
                                <div className="seekbar">
                                    <div className="time-display">
                                        <span>{formatTime(currentTime)}</span>
                                        <input
                                            ref={seekBarRef}
                                            className="seekbar-drawer"
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={(currentTime / duration) * 100 || 0}
                                            step="0.1"
                                            onChange={handleSeek}
                                            style={{ width: "100%", height: "4px", backgroundColor: "rgb(210, 210, 210)" }}
                                        />
                                        <span>{formatTime(duration)}</span>
                                    </div>
                                </div>

                                <div className="control-btns">
                                    <MdSkipPrevious />
                                    <div className="play-btn" onClick={handlePlayPause}>
                                        {isPlaying ? <MdOutlinePauseCircleFilled /> : <IoPlayCircleSharp />}
                                    </div>
                                    <MdSkipNext />
                                </div>
                            </DrawerFooter>
                        </div>
                    </div>
                ) : (
                    <div className="drawer-content">
                        <DrawerHeader>
                            <Skeleton className="w-64 h-64 rounded-lg mx-auto" />
                        </DrawerHeader>

                        <div className="song-details">
                            <DrawerHeader>
                                <Skeleton className="w-40 h-6 rounded-md sm:mx-0 : mx-auto" />
                                <Skeleton className="w-24 h-4 mt-2 rounded-md sm:mx-0 : mx-auto" />
                            </DrawerHeader>

                            <DrawerFooter>
                                <div className="control-btns flex gap-4">
                                    <Skeleton className="w-10 h-10 rounded-full" />
                                    <Skeleton className="w-12 h-12 rounded-full" />
                                    <Skeleton className="w-10 h-10 rounded-full" />
                                </div>
                            </DrawerFooter>
                        </div>
                    </div>
                )}
            </DrawerContent>

            {/* SINGLE GLOBAL AUDIO ELEMENT */}
            <audio
                ref={audioRef}
                src={currentAudio?.audioSrc || ""}
                onTimeUpdate={() => {
                    if (audioRef.current && seekBarRef.current) {
                        const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
                        seekBarRef.current.value = progress.toString();
                        seekBarRef.current.style.background = `linear-gradient(to right, rgb(0, 138, 172) ${progress}%, rgb(210, 210, 210) ${progress}%)`;
                    }
                    dispatch(updateSeekbar({ currentTime: audioRef.current?.currentTime || 0, duration: audioRef.current?.duration || 1 }));
                }}
            />
        </Drawer>
    );
};

export default DrawerPage;
