"use client";
import { ThemeProvider } from "@/components/theme-provider";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { IoIosSearch, IoMdPause, IoMdPlay } from "react-icons/io";
import { motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { useEffect, useState } from "react";
import { Audio } from "@/features/audio/types";
import {
  openDrawer,
  setAudio,
  setPlaylist,
  togglePlayPause,
} from "@/features/audio/audioSlice";
import AudioPlayer from "./Audioplayer";

export default function SearchPage() {
  const dispatch = useDispatch();
  const { currentAudio, isPlaying } = useSelector((state: RootState) => state.audio);
  const [songs, setSongs] = useState<Audio[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!query.trim()) {
        setSongs([]);
        return;
      }

      const fetchSongs = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `https://test-flute.onrender.com/api/search?q=${encodeURIComponent(
              query
            )}`
          );

          if (!response.ok) throw new Error("Failed to fetch songs");
          const data = await response.json();

          const results = Array.isArray(data)
            ? data
            : data.data || data.results || [];

          setSongs(results);
          dispatch(setPlaylist(results));
        } catch (error) {
          console.error("Error fetching songs:", error);
          setSongs([]);
        } finally {
          setLoading(false);
        }
      };

      fetchSongs();
    }, 600);

    return () => clearTimeout(delayDebounce);
  }, [query, dispatch]);

  const togglePlayPauseHandler = (song: Audio, index: number) => {
    if (currentAudio?.title === song.title) {
      dispatch(togglePlayPause());
      dispatch(openDrawer());
    } else {
      dispatch(setAudio({ audio: song, index }));
      dispatch(openDrawer());
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <section className="md:px-4">
        <div className="flex flex-col w-full items-center md:px-4 pb-6 sticky top-0 md:pt-10 pt-5 bg-background">
          <h2 className="md:mb-10 mb-5 text-xl text-center sm:text-5xl dark:text-white text-black">
            Search for your Favourite Songs
          </h2>

          <InputGroup className="h-12 w-full">
            <InputGroupAddon align="inline-start">
              <IoIosSearch className="text-xl" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search your favourite song"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <InputGroupAddon align="inline-end">
              {loading && <Spinner />}
            </InputGroupAddon>
          </InputGroup>
        </div>

        <div className="md:px-2">
          {loading ? (
            <div className="flex items-start justify-center h-[40vh]">
              <p className="text-white text-lg">Loading songs...</p>
            </div>
          ) : (
            <motion.div
              key={query}
              initial={{ opacity: 0, translateY: 50 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 0.3 }}
              exit={{ opacity: 0, translateY: 100 }}
            >
              {/* <p className="text-center text-gray-400 mb-4">
                Found {songs.length} song{songs.length !== 1 ? "s" : ""}
              </p> */}

              <div className="songlist-container overflow-y-auto">
                <div className="flex flex-1 flex-col gap-4 md:p-2 pt-5">
                  {songs.map((song, index) => (
                    <div
                      key={index}
                      className="song-container flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer transition"
                      onClick={() => togglePlayPauseHandler(song, index)}
                    >
                      <div className="play-pause-btn text-2xl text-white">
                        {currentAudio?.title === song.title && isPlaying ? (
                          <IoMdPause />
                        ) : (
                          <IoMdPlay />
                        )}
                      </div>
                      <img
                        className="song-image w-14 h-14 object-cover rounded-md"
                        src={song.imageSrc}
                        alt={song.title || song.name || "Unknown Song"}
                      />
                      <h1 className="song-name text-white font-semibold truncate">
                        {song.title || song.name || "Untitled"}
                      </h1>
                    </div>
                  ))}
                  {!loading && songs.length === 0 && query.trim() && (
                    <p className="text-center text-gray-400">
                      No songs found for “{query}”
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
        <AudioPlayer />
      </section>
    </ThemeProvider>
  );
}
