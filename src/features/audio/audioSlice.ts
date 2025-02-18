import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Audio } from "./types";

interface AudioState {
  playlist: Audio[];
  currentAudio: Audio | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  currentIndex: number;
}

const initialState: AudioState = {
  playlist: [], // Store all songs
  currentAudio: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  currentIndex: 0,
};

const audioSlice = createSlice({
  name: "audio",
  initialState,
  reducers: {
    setPlaylist: (state, action: PayloadAction<Audio[]>) => {
      state.playlist = action.payload;
    },
    setAudio: (state, action: PayloadAction<{ audio: Audio; index: number }>) => {
      state.currentAudio = action.payload.audio;
      state.currentIndex = action.payload.index;
      state.isPlaying = true;
      state.currentTime = 0;
      state.duration = 0;
    },
    togglePlayPause: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    stopAudio: (state) => {
      state.isPlaying = false;      
    },
    nextAudio: (state) => {
      if (state.playlist.length > 0) {
        const nextIndex = (state.currentIndex + 1) % state.playlist.length; // Loops back to first song
        state.currentAudio = state.playlist[nextIndex];
        state.currentIndex = nextIndex;
        state.isPlaying = true;
        state.currentTime = 0;
        state.duration = 0;
      }
    },
    updateCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload; // Store current playback time
    },
    setDuration: (state, action: PayloadAction<number>) => {
      if (!isNaN(action.payload) && action.payload > 0) {
        state.duration = action.payload;
      } else {
        state.duration = 0; // Default to 0 if invalid
      }
    },
    updateSeekbar: (state, action: PayloadAction<{ currentTime: number; duration: number }>) => {
      state.currentTime = isNaN(action.payload.currentTime) ? 0 : action.payload.currentTime;
      state.duration = isNaN(action.payload.duration) || action.payload.duration <= 0 ? 0 : action.payload.duration;
    },
    
  },
});

export const { setAudio, togglePlayPause, stopAudio, updateCurrentTime, setDuration, updateSeekbar, nextAudio, setPlaylist } = audioSlice.actions;
export default audioSlice.reducer;
