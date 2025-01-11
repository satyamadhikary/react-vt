import { useEffect, useState, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
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
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerDescription,
} from "@/components/ui/drawer";
import { RiPlayList2Line } from "react-icons/ri";
import { MdSkipPrevious, MdSkipNext } from "react-icons/md";
import { IoMdPlay, IoMdPause } from "react-icons/io";
import "../css/drawer.css";

export default function Page() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const seekBarRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (audioRef.current) {
      const updateTime = () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
        updateSeekBar();
      };

      const updateSeekBar = () => {
        if (audioRef.current && seekBarRef.current) {
          const progress =
            (audioRef.current.currentTime / audioRef.current.duration) * 100 || 0;
          seekBarRef.current.value = progress.toString();
          seekBarRef.current.style.background = `linear-gradient(to right,rgb(255, 147, 123) ${progress}%, #8a8a8a ${progress}%)`;
        }
      };
      
  
      audioRef.current.addEventListener("timeupdate", updateTime);
      audioRef.current.addEventListener("loadedmetadata", () => {
        setDuration(audioRef.current?.duration || 0);
      });
  
      return () => {
        audioRef.current?.removeEventListener("timeupdate", updateTime);
      };
    }
  }, []);
  

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
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

        <audio
          ref={audioRef}
          src="https://firebasestorage.googleapis.com/v0/b/storage-bucket-575e1.appspot.com/o/music%2Fin-y2mate.com%20-%20E%20Hawa%20%20Meghdol%20X%20Hawa%20Film%20%20Aluminium%20Er%20Dana.mp3?alt=media&token=3724b578-ea7e-45c9-8ada-9dd5db28fca9"
          preload="auto"
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
              }}
            >
              <RiPlayList2Line />
            </button>
          </DrawerTrigger>

          <DrawerContent>
            <div className="drawer-img">
              <DrawerHeader>
                <img className="album-cover"
                  src="https://c.saavncdn.com/901/E-Hawa-Bengali-2022-20220723033156-500x500.jpg"
                  alt="Album Cover"
                />
              </DrawerHeader>
            </div>

            <DrawerHeader className="pt-0">
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

              {/* <DrawerClose>
                <Button variant="outline">Cancel</Button>
              </DrawerClose> */}
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        <SidebarInset>
          <header
            style={{
              borderBottom: "1px solid rgb(33 33 33)",
              position: "sticky",
              top: "0",
              zIndex: "11",
              background: "rgba( 255, 255, 255, 0.25 )",
              boxShadow: "0px 16px 40px 0px rgba( 31, 38, 135, 0.37 )",
              backdropFilter: "blur( 10px )",
              WebkitBackdropFilter: "blur( 10px )",
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
                      Building Your Application
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
