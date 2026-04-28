"use client";
import React, { useMemo, useRef, useState } from "react";
import Swal from "sweetalert";
import {
  IoMdAdd,
  IoMdCheckmark,
  IoMdCloudUpload,
  IoMdClose,
  IoMdImage,
  IoMdMusicalNote,
} from "react-icons/io";
import { useRouter } from "next/navigation";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";

interface Song {
  title: string;
  audio: File | null;
  previewUrl?: string;
}

const AdminPanel: React.FC = () => {
  const [albumTitle, setAlbumTitle] = useState("");
  const [albumImage, setAlbumImage] = useState<File | null>(null);
  const [albumImagePreview, setAlbumImagePreview] = useState<string | null>(
    null,
  );
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "preview">("upload");
  const [dragOver, setDragOver] = useState(false);
  const [playingSongIndex, setPlayingSongIndex] = useState<number | null>(null);
  const [draggedSongIndex, setDraggedSongIndex] = useState<number | null>(null);
  const [dragTargetSongIndex, setDragTargetSongIndex] = useState<number | null>(
    null,
  );

  const previewAudioRefs = useRef<(HTMLAudioElement | null)[]>([]);
  const { uploadFile } = useCloudinaryUpload();
  const router = useRouter();

  const draftReadySongs = useMemo(
    () => songs.filter((song) => song.title.trim() && song.audio),
    [songs],
  );

  const handleAlbumImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAlbumImage(file);
    if (file) {
      setAlbumImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setAlbumImage(file);
      setAlbumImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddSong = () => {
    setSongs([...songs, { title: "", audio: null }]);
  };

  const handleRemoveSong = (index: number) => {
    setSongs((current) => current.filter((_, i) => i !== index));
  };

  const reorderSongs = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    setSongs((current) => {
      const updated = [...current];
      const [movedSong] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, movedSong);
      return updated;
    });

    setPlayingSongIndex((current) => {
      if (current === null) return null;
      if (current === fromIndex) return toIndex;
      if (fromIndex < toIndex && current > fromIndex && current <= toIndex) {
        return current - 1;
      }
      if (fromIndex > toIndex && current >= toIndex && current < fromIndex) {
        return current + 1;
      }
      return current;
    });
  };

  const handleSongChange = (
    index: number,
    field: "title" | "audio",
    value: string | File | null,
  ) => {
    const updated = [...songs];
    if (field === "title") updated[index].title = value as string;
    if (field === "audio") {
      updated[index].audio = value as File | null;
      updated[index].previewUrl = value
        ? URL.createObjectURL(value as File)
        : undefined;
    }
    setSongs(updated);
  };

  const handleUpload = async () => {
    if (!albumTitle.trim() || !albumImage) {
      Swal(
        "Missing Data",
        "Please add album image and title first.",
        "warning",
      );
      return;
    }
    if (songs.length === 0 || songs.some((s) => !s.title || !s.audio)) {
      Swal("Incomplete Songs", "Please add songs properly.", "warning");
      return;
    }

    setLoading(true);
    try {
      const safeAlbum = albumTitle.replace(/\s+/g, "_").toLowerCase();
      const coverRes = await uploadFile(albumImage, `albums/${safeAlbum}`);
      const coverUrl = coverRes.url;

      const uploadedSongs = await Promise.all(
        songs.map(async (song) => {
          if (!song.audio) return null;
          const safeSong = song.title.replace(/\s+/g, "_").toLowerCase();
          const baseFolder = `albums/${safeAlbum}/${safeSong}`;
          const audioRes = await uploadFile(song.audio, baseFolder);
          return { title: song.title, audioSrc: audioRes.url };
        }),
      );

      const finalSongs = uploadedSongs.filter(Boolean) as {
        title: string;
        audioSrc: string;
      }[];

      if (finalSongs.length === 0) throw new Error("Upload failed");

      await saveToServer(albumTitle, coverUrl, finalSongs);
      Swal("Success", "Album uploaded successfully!", "success");

      setAlbumTitle("");
      setAlbumImage(null);
      setAlbumImagePreview(null);
      setSongs([]);
      setActiveTab("upload");
    } catch (error) {
      console.error(error);
      Swal("Error", "Upload failed!", "error");
    } finally {
      setLoading(false);
    }
  };

  const saveToServer = async (
    albumTitle: string,
    albumImage: string,
    songs: { title: string; audioSrc: string }[],
  ) => {
    try {
      await fetch("https://flute-backend.onrender.com/save-urls/albums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ albumTitle, songs, imageSrc: [albumImage] }),
      });
      Swal("Saved", "Album saved to server!", "success");
    } catch {
      Swal("Error", "Failed to save album!", "error");
    }
  };

  const isFormReady =
    albumTitle.trim() &&
    albumImage &&
    songs.length > 0 &&
    songs.every((s) => s.title && s.audio);

  const togglePreviewAudio = async (index: number) => {
    const selectedAudio = previewAudioRefs.current[index];
    if (!selectedAudio) return;

    if (playingSongIndex === index) {
      selectedAudio.pause();
      selectedAudio.currentTime = 0;
      setPlayingSongIndex(null);
      return;
    }

    previewAudioRefs.current.forEach((audio, audioIndex) => {
      if (audio && audioIndex !== index) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    try {
      await selectedAudio.play();
      setPlayingSongIndex(index);
    } catch (error) {
      console.error("Audio preview playback failed", error);
      setPlayingSongIndex(null);
    }
  };

  const handleSongDragStart = (index: number) => {
    setDraggedSongIndex(index);
    setDragTargetSongIndex(index);
  };

  const handleSongDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    index: number,
  ) => {
    e.preventDefault();
    if (draggedSongIndex === null) return;
    if (dragTargetSongIndex !== index) {
      setDragTargetSongIndex(index);
    }
  };

  const handleSongDrop = (index: number) => {
    if (draggedSongIndex === null) return;
    reorderSongs(draggedSongIndex, index);
    setDraggedSongIndex(null);
    setDragTargetSongIndex(null);
  };

  const handleSongDragEnd = () => {
    setDraggedSongIndex(null);
    setDragTargetSongIndex(null);
  };

  return (
    <div className="min-h-screen font-sans text-slate-900 transition-colors duration-300 dark:text-white">
      <div className="relative z-10 mx-auto max-w-5xl md:px-4 px-0 py-10">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-12">
          <div className="flex flex-col text-center md:text-left">
            <h1 className="bg-gradient-to-r from-gray-900 via-purple-600 to-rose-500 bg-clip-text text-5xl font-black tracking-tight text-transparent dark:from-white dark:via-purple-200 dark:to-rose-300">
              Publish your Album
            </h1>
            <p className="mt-3 mb-6 md:mb-0 text-sm text-slate-500 dark:text-white/40">
              Upload, manage and preview your music albums
            </p>
          </div>

          <div className="flex w-fit gap-2 rounded-2xl border border-slate-300 bg-slate-200/50 p-1 dark:border-white/10 dark:bg-white/5">
            {["upload", "preview"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as "upload" | "preview")}
                className={`rounded-xl px-8 py-2.5 text-sm font-semibold capitalize transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-purple-600 to-rose-500 text-white shadow-lg shadow-purple-900/20 dark:shadow-purple-900/50"
                    : "text-slate-500 hover:text-slate-800 dark:text-white/40 dark:hover:text-white/70"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "upload" && (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div className="space-y-5">
              <div
                className={`relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ${
                  dragOver
                    ? "border-purple-400 bg-purple-500/10"
                    : albumImagePreview
                      ? "border-slate-300 bg-transparent dark:border-white/20"
                      : "border-slate-300 bg-transparent hover:border-purple-500/50 hover:bg-purple-500/5 dark:border-white/15"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById("coverInput")?.click()}
                style={{ minHeight: "260px" }}
              >
                {albumImagePreview ? (
                  <>
                    <img
                      src={albumImagePreview}
                      alt="Album cover"
                      className="h-64 w-full object-cover"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity hover:opacity-100">
                      <IoMdImage className="text-3xl text-white" />
                      <span className="text-xs text-white/70">
                        Change cover
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex h-64 flex-col items-center justify-center gap-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/20">
                      <IoMdImage className="text-3xl text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-slate-600 dark:text-white/60">
                        Drop album cover here
                      </p>
                      <p className="mt-1 text-xs text-slate-400 dark:text-white/25">
                        or click to browse - PNG, JPG, WEBP
                      </p>
                    </div>
                  </div>
                )}
                <input
                  id="coverInput"
                  type="file"
                  accept="image/*"
                  onChange={handleAlbumImageChange}
                  className="hidden"
                />
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Album Title"
                  value={albumTitle}
                  onChange={(e) => setAlbumTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200/8 bg-white px-5 py-4 text-sm font-medium text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-purple-500/60 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:bg-white/5 dark:text-white dark:placeholder:text-white/25"
                />
                {albumTitle && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-wider text-green-600 dark:text-green-400">
                    Ready
                  </span>
                )}
              </div>

              <div className="space-y-2 rounded-2xl border border-slate-200/8 bg-transparent p-4 shadow-sm">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-white/30">
                  Upload Status
                </p>
                {[
                  { label: "Album Cover", done: !!albumImage },
                  { label: "Album Title", done: !!albumTitle.trim() },
                  {
                    label: `Songs (${songs.length} added)`,
                    done:
                      songs.length > 0 &&
                      songs.every((s) => s.title && s.audio),
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-xs text-slate-600 dark:text-white/50">
                      {item.label}
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        item.done
                          ? "text-green-600 dark:text-green-400"
                          : "text-slate-300 dark:text-white/20"
                      }`}
                    >
                      {item.done ? "Ready" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-white/60">
                  Tracks
                </h2>
                <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-600 dark:text-purple-400">
                  {songs.length} song{songs.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="custom-scroll max-h-[420px] space-y-3 overflow-y-auto pr-1">
                {songs.length === 0 && (
                  <div className="flex h-36 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 dark:border-white/10">
                    <IoMdMusicalNote className="text-2xl text-slate-300 dark:text-white/20" />
                    <p className="text-xs text-slate-400 dark:text-white/25">
                      No tracks yet. Add your first song!
                    </p>
                  </div>
                )}

                {songs.map((song, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={() => handleSongDragStart(index)}
                    onDragOver={(e) => handleSongDragOver(e, index)}
                    onDrop={() => handleSongDrop(index)}
                    onDragEnd={handleSongDragEnd}
                    className={`space-y-3 rounded-2xl border p-4 transition-all hover:border-purple-500/30 hover:shadow-md dark:hover:bg-white/6 ${
                      draggedSongIndex === index
                        ? "cursor-grabbing border-purple-400/50 opacity-60"
                        : "cursor-grab border-white/8"
                    } ${
                      dragTargetSongIndex === index &&
                      draggedSongIndex !== index
                        ? "border-purple-500 bg-purple-500/5"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-xs font-bold text-purple-600 dark:text-purple-400">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400 dark:text-white/30">
                          Drag
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveSong(index)}
                        className="text-slate-300 transition-colors hover:text-rose-500 dark:text-white/20 dark:hover:text-rose-400"
                      >
                        <IoMdClose />
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Song title..."
                      value={song.title}
                      onChange={(e) =>
                        handleSongChange(index, "title", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-purple-500/50 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/20"
                    />

                    <label
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border border-dashed px-3 py-2.5 text-xs transition-all ${
                        song.audio
                          ? "border-green-500/40 bg-green-500/5 text-green-600 dark:text-green-400"
                          : "border-slate-300 text-slate-400 hover:border-slate-400 hover:text-slate-600 dark:border-white/10 dark:text-white/30 dark:hover:border-white/20 dark:hover:text-white/50"
                      }`}
                    >
                      <IoMdMusicalNote className="shrink-0 text-base" />
                      <span className="truncate">
                        {song.audio ? song.audio.name : "Choose audio file..."}
                      </span>
                      <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={(e) =>
                          handleSongChange(
                            index,
                            "audio",
                            e.target.files?.[0] || null,
                          )
                        }
                      />
                    </label>

                    {song.previewUrl && (
                      <audio
                        controls
                        src={song.previewUrl}
                        className="h-8 w-full opacity-70 transition-opacity hover:opacity-100"
                      />
                    )}

                    {song.title && song.audio && (
                      <div className="flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400">
                        <IoMdCheckmark />
                        <span>Track ready</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={handleAddSong}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-purple-500/40 bg-purple-500/5 py-3 text-sm font-semibold text-purple-600 transition-all hover:border-purple-400/60 hover:bg-purple-500/10 dark:text-purple-400"
              >
                <IoMdAdd className="text-lg" />
                Add Track
              </button>

              <button
                onClick={handleUpload}
                disabled={loading || !isFormReady}
                className={`flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 text-sm font-bold tracking-wide transition-all duration-300 ${
                  isFormReady && !loading
                    ? "bg-gradient-to-r from-purple-600 to-rose-500 text-white shadow-xl shadow-purple-900/20 hover:-translate-y-0.5 hover:from-purple-500 hover:to-rose-400 hover:shadow-purple-700/50 dark:shadow-purple-900/40"
                    : "cursor-not-allowed border border-slate-300 bg-slate-200 text-slate-400 dark:border-white/8 dark:bg-white/5 dark:text-white/20"
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Uploading to Cloud...
                  </>
                ) : (
                  <>
                    <IoMdCloudUpload className="text-lg" />
                    Publish Album
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {activeTab === "preview" && (
          <div className="rounded-3xl border border-slate-300 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.03] sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-white/80">
                  Live Draft Preview
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-white/35">
                  Review the current album before you publish it.
                </p>
              </div>
              <span className="flex-shrink-0 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-600 dark:text-purple-400">
                {draftReadySongs.length}/{songs.length} ready
              </span>
            </div>

            <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 dark:border-white/8">
              <div className="relative h-64 overflow-hidden">
                {albumImagePreview ? (
                  <img
                    src={albumImagePreview}
                    alt={albumTitle || "Album cover preview"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-black">
                    <div className="flex flex-col items-center gap-2 text-white/45">
                      <IoMdImage className="text-5xl" />
                      <span className="text-xs uppercase tracking-[0.18em]">
                        Cover Preview
                      </span>
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-purple-200">
                    Upcoming Album
                  </p>
                  <h3 className="mt-1 text-2xl font-black text-white sm:text-3xl overflow-hidden text-ellipsis">
                    {albumTitle.trim() || "Untitled Album"}
                  </h3>
                  <p className="mt-1 text-xs text-white/65">
                    {songs.length} track{songs.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 dark:bg-black sm:p-5">
                {songs.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-10 text-center dark:border-white/10">
                    <p className="text-sm text-slate-500 dark:text-white/35">
                      Add songs in the Upload tab to see the full album preview
                      here.
                    </p>
                    <button
                      onClick={() => setActiveTab("upload")}
                      className="mt-4 text-sm font-semibold text-purple-600 transition-colors hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
                    >
                      Go to Upload
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {songs.map((song, index) => (
                      <div
                        key={`draft-preview-${index}`}
                        className={`rounded-2xl border p-3 transition-all ${
                          playingSongIndex === index
                            ? "border-purple-400/50 bg-purple-500/5 dark:border-purple-400/40 dark:bg-purple-500/10"
                            : "border-slate-200 bg-white dark:border-white/8 dark:bg-white/[0.02]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => togglePreviewAudio(index)}
                            disabled={!song.previewUrl}
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl transition-all ${
                              song.previewUrl
                                ? playingSongIndex === index
                                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25"
                                  : "bg-slate-900 text-white hover:bg-purple-600 dark:bg-white/10"
                                : "cursor-not-allowed bg-slate-200 text-slate-400 dark:bg-white/5 dark:text-white/20"
                            }`}
                            aria-label={
                              playingSongIndex === index
                                ? "Pause preview"
                                : "Play preview"
                            }
                          >
                            {playingSongIndex === index ? (
                              <svg
                                className="h-4 w-4"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <rect
                                  x="6"
                                  y="4"
                                  width="4"
                                  height="16"
                                  rx="1"
                                />
                                <rect
                                  x="14"
                                  y="4"
                                  width="4"
                                  height="16"
                                  rx="1"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="ml-0.5 h-4 w-4"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            )}
                          </button>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-800 dark:text-white/85">
                              {song.title.trim() || `Track ${index + 1}`}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                              song.title.trim() && song.audio
                                ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                : "bg-amber-500/10 text-amber-600 dark:text-amber-300"
                            }`}
                          >
                            {song.title.trim() && song.audio
                              ? "Ready"
                              : "Draft"}
                          </span>
                        </div>

                        {song.previewUrl && (
                          <audio
                            ref={(element) => {
                              previewAudioRefs.current[index] = element;
                            }}
                            src={song.previewUrl}
                            onEnded={() => setPlayingSongIndex(null)}
                            className="hidden"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 flex items-center justify-center gap-3">
          <button
            onClick={() => router.push("/album")}
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-600 shadow-sm transition-all hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white/90"
          >
            View All Albums
          </button>
          <button
            onClick={() => router.push("/admin")}
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-600 shadow-sm transition-all hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white/90"
          >
            Admin Panel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
