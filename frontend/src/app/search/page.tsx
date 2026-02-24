"use client";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../../components/ui/input-group";
import { Spinner } from "../../components/ui/spinner";
import { IoIosSearch, IoMdPause, IoMdPlay } from "react-icons/io";
import { motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { Audio } from "../../features/audio/types";
import {
  openDrawer,
  setAudio,
  setPlaylist,
  togglePlayPause,
} from "../../features/audio/audioSlice";
import { useSearch } from "@/hooks/tanstack-query-hook";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function SearchPage() {
  const dispatch = useDispatch();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const { currentAudio, isPlaying } = useSelector(
    (state: RootState) => state.audio,
  );

  useEffect(() => {
    setIsDebouncing(true);

    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setIsDebouncing(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const { data: searchResults = [], isLoading } = useSearch(debouncedQuery);

  const normalizedQuery = debouncedQuery.trim().toLowerCase();

  const songs: Audio[] = Array.from(
    new Map(
      searchResults.map((song: Audio) => [
        song.audioSrc || song.id || song.title, // unique key
        {
          ...song,
          imageSrc: Array.isArray(song.imageSrc)
            ? song.imageSrc
            : song.imageSrc
              ? [song.imageSrc]
              : [],
        },
      ]),
    ).values(),
  ).sort((a, b) => {
    if (!normalizedQuery) return 0;

    const titleA = (a.title || a.name || "").toLowerCase();
    const titleB = (b.title || b.name || "").toLowerCase();

    const aStarts = titleA.startsWith(normalizedQuery);
    const bStarts = titleB.startsWith(normalizedQuery);

    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;

    return 0;
  });

  const togglePlayPauseHandler = (song: Audio, index: number) => {
    dispatch(setPlaylist(songs));
    if (currentAudio?.title === song.title) {
      dispatch(togglePlayPause());
    } else {
      dispatch(setAudio({ audio: song, index }));
    }
    dispatch(openDrawer());
  };

  return (
    <section>
      {/* SEARCH BAR */}
      <div className="flex flex-col w-full items-center md:px-4 pb-6 sticky top-0 md:pt-10 pt-5 bg-background z-10">
        <h2 className="md:mb-10 mb-5 text-xl text-center sm:text-5xl ">
          Search for your Favourite Songs
        </h2>

        <InputGroup className="h-12 w-full bg-muted">
          <InputGroupAddon align="inline-start">
            <IoIosSearch className="text-xl" />
          </InputGroupAddon>

          <InputGroupInput
            placeholder="Search your favourite song"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <InputGroupAddon align="inline-end">
            {isLoading || (isDebouncing && <Spinner />)}
          </InputGroupAddon>
        </InputGroup>
      </div>

      {/* RESULTS */}
      <div className="md:px-2">
        {/* EMPTY STATE */}
        {!isLoading && query.trim() && songs.length === 0 && debouncedQuery && (
          <p className="text-center">No songs found for "{query}"</p>
        )}

        {/* LIST */}
        {!isLoading && songs.length > 0 && query.trim() && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="songlist-container overflow-y-auto">
              <div className="flex flex-col gap-4 md:p-2 pt-5">
                {songs.map((song, index) => (
                  <div
                    key={`${song.title}-${index}`}
                    className="flex items-center gap-4 px-4 py-2 rounded-lg bg-muted hover:bg-black/10 dark:hover:bg-muted/70 cursor-pointer transition"
                    onClick={() => togglePlayPauseHandler(song, index)}
                  >
                    <div className="text-xl">
                      {currentAudio?.title === song.title && isPlaying ? (
                        <IoMdPause />
                      ) : (
                        <IoMdPlay />
                      )}
                    </div>

                    {!imgLoaded && (
                      <Skeleton className="w-12 h-12 rounded-md" />
                    )}
                    {/* {song.albumTitle} */}
                    <img
                      className={`w-12 h-12 object-cover rounded-md ${
                        !imgLoaded ? "hidden" : "block"
                      }`}
                      src={song.imageSrc[0] || ""}
                      alt={song.title || song.name || "Unknown Song"}
                      onLoad={() => setImgLoaded(true)}
                      onError={() => setImgLoaded(true)} // prevent infinite skeleton
                    />
                    <div className="flex flex-col gap-0">
                      <h1 className=" font-semibold truncate">
                        {song.title || song.name || "Untitled"}
                      </h1>
                      {song.albumTitle && <Link href={`/album/${song.albumId}`} className="hover:underline w-fit">{song.albumTitle}</Link>}
                      {!song.albumTitle && <p>Song</p>}
                      {/* <p>Song</p>
                      <p>Album</p> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
