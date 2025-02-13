import ReactPlayer from "react-player";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { togglePlayPause } from "../features/audio/audioSlice";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerDescription } from "@/components/ui/drawer";
import { RiPlayList2Line } from "react-icons/ri";
import { MdSkipPrevious, MdSkipNext, MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { IoMdPlay, IoMdPause } from "react-icons/io";
import { Skeleton } from "@/components/ui/skeleton";
import "../css/drawer.css";
import { updateSeekbar } from "../features/audio/audioSlice";

export default function Page() {
  const dispatch = useDispatch();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef<ReactPlayer | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const audioRefs = useRef<HTMLAudioElement[]>([]);
  const { currentAudio, currentTime, duration, isPlaying } = useSelector((state: RootState) => state.audio);
  const seekBarRef = useRef<HTMLInputElement | null>(null);


  const handlePlayPause = () => {
    if (currentAudio) {
      dispatch(togglePlayPause());
  
      if (!isPlaying) {
        dispatch(updateSeekbar({ currentTime, duration }));
      }
    }
  };
  

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPlaying) return; // Prevent seeking when paused
  
    const newPercentage = parseFloat(e.target.value);
    const newTime = (newPercentage / 100) * duration;
  
    dispatch(updateSeekbar({ currentTime: newTime, duration }));
  
    const currentAudioElement = audioRefs.current.find(
      (audio) => audio?.src === currentAudio?.audioSrc
    );
  
    if (currentAudioElement) {
      currentAudioElement.currentTime = newTime;
    }
  
    if (playerRef.current) {
      playerRef.current.seekTo(newTime, "seconds");
    }
  };
  
  
  useEffect(() => {
    if (!isPlaying && playerRef.current) {
      playerRef.current.seekTo(currentTime, "seconds"); // Keep seek bar in place when paused
    }
  }, [isPlaying]);
  


  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };


  useEffect(() => {
    const homeButton = document.getElementById("home");
    if (homeButton) {
      if (location.pathname === "/") {
        homeButton.style.color = "#8a8a8a";
      } else {
        homeButton.style.color = "";
      }
    }
  }, [location.pathname]);

  const handleBack = () => {
    if (location.pathname === "/") {
      console.log("You are at the homepage")
      return;
    } else {
      navigate(-1);
    }
  };

  const handleFullscreen = () => {
    const videoContainer = playerRef.current?.getInternalPlayer();
    if (!isFullscreen) {
      if (videoContainer?.requestFullscreen) {
        videoContainer.requestFullscreen().then(() => setIsFullscreen(true));
      } else {
        console.error("Fullscreen API is not supported in this browser.");
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false));
      } else {
        console.error("Fullscreen exit is not supported in this browser.");
      }
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />

        {/* Drawer Button */}
        <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
          <DrawerTrigger>
            <button
              style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
                background: "black",
                color: "white",
                padding: "10px",
                borderRadius: "50%",
                zIndex: "50",
                cursor: "pointer",
              }}
              onClick={() => setIsDrawerOpen(true)}
            >
              <RiPlayList2Line />
            </button>
          </DrawerTrigger>

          <DrawerContent>
         <video style={{width: "100vw",objectFit: "fill", height: "100%", position: "absolute", zIndex: "-2", filter: "blur(10px)", pointerEvents: "none" }} autoPlay={true} playsInline={false} webkit-playsinline="none" loop src="https://firebasestorage.googleapis.com/v0/b/flute-8592b.appspot.com/o/drawerVideo%2Funwatermark_istockphoto-1317284271-640_adpp_is.mp4?alt=media&token=44d5a9af-59b0-41a6-8b6c-0d96e1c4e6d5"></video>
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
                          onChange={(handleSeek)}
                          style={{
                            width: "100%",
                            height: "4px",
                          }}
                        />
                        <span>{formatTime(duration)}</span>
                      </div> 
                    </div>

                    <div className="control-btns">
                      <MdSkipPrevious />
                      <div className="play-btn" onClick={handlePlayPause}>
                        {isPlaying ? <IoMdPause /> : <IoMdPlay />}
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
        </Drawer>

        {/* React Player - Fullscreen Mode */}
        <div
          className="player-wrapper"
          style={{
            display: isFullscreen ? "block" : "none",
            width: "100%",
            height: "100vh",
          }}
          onDoubleClick={handleFullscreen}
          onClick={() => isFullscreen && dispatch(togglePlayPause())}
        >
          <ReactPlayer
            ref={playerRef}
            url={currentAudio?.audioSrc}
            playing={isPlaying}
            controls={false}
            width="100%"
            height="100%"
            style={{ display: isFullscreen ? "block" : "none" }}
          />
        </div>

        <SidebarInset>
          <header
            style={{
              borderBottom: "1px solid rgb(33 33 33)",
              position: "sticky",
              top: "0",
              zIndex: "11",
              background: "rgba(255, 255, 255, 0.25)",
              boxShadow: "0px 16px 40px 0px rgba(68, 70, 94, 0.37)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              padding: "10px 0px",
            }}
          >
            <div className="flex items-center gap-2 px-4">
              <button
                id="home"
                style={{ cursor: "pointer", color: "#fff", fontSize: "20px" }}
                onClick={handleBack}
              >
                <MdKeyboardDoubleArrowLeft />
              </button>
              <Separator orientation="vertical" className="mr-2 h-4" />
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb className="d-flex align-items-center">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage style={{ cursor: "pointer" }} onClick={() => navigate("/About")}>
                      Data Fetching
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          <div className="flex flex-1 flex-col p-4 pt-0 overflow-y-hidden w-full">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
