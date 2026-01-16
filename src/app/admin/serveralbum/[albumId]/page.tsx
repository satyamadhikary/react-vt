"use client";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import {
  setAudio,
  togglePlayPause,
  setPlaylist,
  openDrawer,
} from "@/features/audio/audioSlice";
import { Audio } from "@/features/audio/types";
import { IoMdPlay, IoMdPause } from "react-icons/io";
import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import "@/app/css/songlist.css";
import { useAlbums } from "@/hooks/tanstack-query-hook";

const ServeralbumDetails = () => {
  const params = useParams();
  const albumId = Array.isArray(params.albumId)
    ? params.albumId[0]
    : params.albumId;
  const { data: albums, isLoading, error } = useAlbums();

  // Memoize albumsData to prevent recalculation on every render
  const albumsData = useMemo(() => {
    return albums?.find((a: any) => a._id === albumId);
  }, [albums, albumId]);

  const dispatch = useDispatch();
  // Use a more selective selector to only subscribe to what we need
  const currentAudio = useSelector(
    (state: RootState) => state.audio.currentAudio
  );
  const isPlaying = useSelector(
    (state: RootState) => state.audio.isPlaying
  );

  useEffect(() => {
    if (!albumsData) return;

    const songsWithImageSrc = albumsData.songs.map((song: Audio) => ({
      ...song,
      imageSrc: song.imageSrc || albumsData.imageSrc || [],
    }));

    dispatch(setPlaylist(songsWithImageSrc));
  }, [albumsData, dispatch]);

  const handleAlbumClick = (song: Audio, index: number) => {
    if (!albumsData) return;

    const updatedSong = {
      ...song,
      imageSrc: albumsData.imageSrc || song.imageSrc || [],
    };

    if (currentAudio?.title === song.title) {
      dispatch(togglePlayPause());
      dispatch(openDrawer());
    } else {
      dispatch(setAudio({ audio: updatedSong, index }));
    }
  };
  if (isLoading)
    return <p className="text-white text-center mt-10">Loading album...</p>;
  if (!albumsData)
    return <p className="text-white text-center mt-10">song not found.</p>;
  if (error)
    return (
      <p className="text-white text-center mt-10">Error: {error.message}</p>
    );
  return (
    <>
      <div className="songlist-container overflow-y-auto">
        <h2 className="text-2xl p-4 text-center">{albumsData.title}</h2>

        <motion.div
          initial={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 0.3 }}
          exit={{ opacity: 0, translateY: 100 }}
        >
          <div className="flex flex-1 flex-col gap-4 p-2 pt-5">
            {albumsData.songs.map((song: Audio, index: number) => (
              <div
                key={index}
                className="song-container"
                onClick={() => handleAlbumClick(song, index)}
              >
                <div className="play-pause-btn">
                  {currentAudio?.title === song.title && isPlaying ? (
                    <IoMdPause />
                  ) : (
                    <IoMdPlay />
                  )}
                </div>

                <img
                  className="song-image"
                  src={albumsData.imageSrc[0]}
                  alt={albumsData.title}
                />
                <h1 className="song-name">{song.title}</h1>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ServeralbumDetails;
