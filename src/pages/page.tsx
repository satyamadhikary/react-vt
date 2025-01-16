import ReactPlayer from "react-player";
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State for drawer
  const playerRef = useRef<ReactPlayer | null>(null);
  const seekBarRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    if (playerRef.current) {
      playerRef.current.seekTo(newTime, "seconds");
      setCurrentTime(newTime);
    }
  };

  const handleProgress = (state: { playedSeconds: number; played: number }) => {
    setCurrentTime(state.playedSeconds);
    if (seekBarRef.current) {
      const progress = state.played * 100;
      seekBarRef.current.value = progress.toString();
      seekBarRef.current.style.background = `linear-gradient(to right, rgb(253, 145, 121) ${progress}%, #8a8a8a ${progress}%)`;
    }
  };

  const handleDuration = (dur: number) => {
    setDuration(dur);
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
        setIsFullscreen(false); // Exit fullscreen mode
      }
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />

        {/* ReactPlayer mounted outside the Drawer */}
       <div className="player-wrapper"
                  style={{
                    display: isFullscreen ? "block" : "none", 
                    width: "100%",
                    height: "100vh",
                  }}
                  onDoubleClick={handleFullscreen}
                  onClick={() => isFullscreen && togglePlayPause()}
                >
        <ReactPlayer
          ref={playerRef}
          url="https://firebasestorage.googleapis.com/v0/b/flute-8592b.appspot.com/o/new%2FEhawa.mp4?alt=media&token=644187c2-d4e8-4f5c-a343-377041975704"
          playing={isPlaying}
          controls={false}
          width="0"
          height="0"
          onProgress={handleProgress}
          onDuration={handleDuration}
          style={{ display: isFullscreen ? "block" : "none",}}
        />
        </div>

        <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
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
              onClick={() => setIsDrawerOpen(true)}
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
                      onClick={() => navigate("/")}
                    >
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate("/About")}
                    >
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
