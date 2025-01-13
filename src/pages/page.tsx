import { useEffect, useState, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { BsArrowsFullscreen } from "react-icons/bs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerDescription } from "@/components/ui/drawer";
import { RiPlayList2Line } from "react-icons/ri";
import { MdSkipPrevious, MdSkipNext } from "react-icons/md";
import { IoMdPlay, IoMdPause } from "react-icons/io";
import "../css/drawer.css";

export default function Page() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [, setIsFullscreen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const seekBarRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const audio = audioRef.current;
    const video = videoRef.current;
  
    const updateCurrentTime = () => {
      if (audio) {
        const current = audio.currentTime || 0;
        setCurrentTime(current);
        updateSeekBar(current, audio.duration);
  
        if (video && video.readyState >= 5) {
          video.currentTime = current; 
        }
      }
    };
  
    const updateSeekBar = (current: number, duration: number) => {
      if (seekBarRef.current) {
        const progress = (current / (duration || 1)) * 100;
        seekBarRef.current.value = progress.toString();
        seekBarRef.current.style.background = `linear-gradient(to right, rgb(253, 145, 121) ${progress}%, #8a8a8a ${progress}%)`;
      }
    };
  
    const setMediaDuration = () => {
      if (audio) {
        setDuration(audio.duration || 0);
      }
    };
  
    if (audio) {
      audio.addEventListener("timeupdate", updateCurrentTime);
      audio.addEventListener("loadedmetadata", setMediaDuration);
      audio.addEventListener("canplaythrough", setMediaDuration);
  
      return () => {
        audio.removeEventListener("timeupdate", updateCurrentTime);
        audio.removeEventListener("loadedmetadata", setMediaDuration);
        audio.removeEventListener("canplaythrough", setMediaDuration);
      };
    }
  }, []);
  
  

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    const audio = audioRef.current;
    const video = videoRef.current;

    if (audio && video) {
      audio.currentTime = newTime;
      video.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const video = videoRef.current;
      const audio = audioRef.current;
  
      if (!document.fullscreenElement && video) {
        video.pause();
        video.style.display = "none";
        video.currentTime = audio?.currentTime || 0;
        setIsFullscreen(false);
      }
    };
  
    document.addEventListener("fullscreenchange", handleFullscreenChange);
  
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);
  
  


  const togglePlayPause = () => {
    const audio = audioRef.current;
    const video = videoRef.current;

    if (audio && video) {
      if (audio.paused) {
        video.currentTime = audio.currentTime; 
        audio.play();
        video.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    const audio = audioRef.current;
  
    if (video && audio) {
      video.currentTime = audio.currentTime;
  
      if (video.requestFullscreen) {
        video.style.display = "block"; 
        video.requestFullscreen()
          .then(() => {
            setIsPlaying(true);
            video.style.opacity = "1";
            video.play();
            audio.play();
          })
          .catch((err) => {
            console.error("Fullscreen request failed:", err);
            video.style.display = "none"; 
          });
      } else if ((video as any).webkitEnterFullscreen) {
        video.style.display = "block";
        (video as any).webkitEnterFullscreen();
        video.play();
        audio.play();
      } else {
        console.error("Fullscreen is not supported by this browser.");
      }
    }
  };
  
  
  const handleDoubleClick = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen()
        .then(() => {
          setIsFullscreen(false);
          if (videoRef.current) {
            videoRef.current.style.display = "none"; 
            videoRef.current.pause();
          }
        })
        .catch((err) => {
          console.error("Error exiting fullscreen:", err);
        });
    }
  };
  
  

  const handleSingleClick = () => {
    togglePlayPause();
   
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />

        <audio
          ref={audioRef}
          src="https://firebasestorage.googleapis.com/v0/b/storage-bucket-575e1.appspot.com/o/music%2Fin-y2mate.com%20-%20E%20Hawa%20%20Meghdol%20X%20Hawa%20Film%20%20Aluminium%20Er%20Dana.mp3?alt=media&token=3724b578-ea7e-45c9-8ada-9dd5db28fca9"
          style={{ display: "none" }}
        />

        <Drawer>
          <DrawerTrigger>
            <button
              style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
                minWidth: "fit-content",
                background: "Black",
                color: "white",
                padding: "10px",
                borderRadius: "50%",
                zIndex: "50",
                cursor: "pointer",
              }}
            >
              <RiPlayList2Line />
            </button>
          </DrawerTrigger>

          <DrawerContent>        
              <div className="fullscreen-btn" onClick={handleFullscreen}>
                <BsArrowsFullscreen />
              </div>


            <div className="drawer-content">
              <div className="drawer-img">
                <DrawerHeader>
                  <img
                    className="album-cover"
                    src="https://c.saavncdn.com/901/E-Hawa-Bengali-2022-20220723033156-500x500.jpg"
                    alt="Album Cover"
                  />
                </DrawerHeader>
              </div>

              <div className="song-details">
                <video
                  style={{ display: "none" }}
                  ref={videoRef}
                  src="https://firebasestorage.googleapis.com/v0/b/flute-8592b.appspot.com/o/new%2FEhawa.mp4?alt=media&token=644187c2-d4e8-4f5c-a343-377041975704"
                  preload="auto"
                 
                  muted
                  controls={false}
                  playsInline
                  disableRemotePlayback
                  onClick={handleSingleClick}
                  onDoubleClick={handleDoubleClick}
                  onTouchStart={(e) => e.preventDefault()}
                  onTouchEnd={(e) => e.preventDefault()}
                />
                <DrawerHeader>
                  <DrawerTitle className="song-title">E Hawa</DrawerTitle>
                  <DrawerDescription className="song-artist">By Meghdol</DrawerDescription>
                </DrawerHeader>

                <DrawerFooter className="pt-0">
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
                        style={{
                          width: "100%",
                          height: "4px",
                        }}
                      />
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  <div className="control-btns">
                    <div className="previous-btn">
                      <MdSkipPrevious />
                    </div>
                    <div className="play-btn" onClick={togglePlayPause}>
                      {isPlaying ? <IoMdPause /> : <IoMdPlay />}
                    </div>
                    <div className="next-btn">
                      <MdSkipNext />
                    </div>
                  </div>
                </DrawerFooter>
              </div>
            </div>
          </DrawerContent>
        </Drawer>

        <SidebarInset>
          <header
            style={{
              borderBottom: "1px solid rgb(33 33 33)",
              position: "sticky",
              top: "0",
              zIndex: "11",
              background: "rgba(255, 255, 255, 0.25)",
              boxShadow: "0px 16px 40px 0px rgba(31, 38, 135, 0.37)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
            className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
          >
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb className="d-flex align-items-center">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate("/")}>
                      Building Your Application
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate("/About")}>
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
