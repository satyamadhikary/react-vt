import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Audio } from "./types";

interface AudioState {
  currentAudio: Audio | null;
  isPlaying: boolean;
  currentTime: number; // Store current playback time
  duration: number;
}

const initialState: AudioState = {
  currentAudio: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
};

const audioSlice = createSlice({
  name: "audio",
  initialState,
  reducers: {
    setAudio: (state, action: PayloadAction<Audio>) => {
      if (state.currentAudio?.name !== action.payload.name) {
        state.duration =  0; // Set duration
        state.currentTime = 0; // Reset time if switching to a new song
      }
      state.currentAudio = action.payload;
      state.isPlaying = true;
    },
    togglePlayPause: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    stopAudio: (state) => {
      state.isPlaying = false;      
    },
    updateCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload; // Store current playback time
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload; // Store audio duration
    },
    updateSeekbar: (state, action: PayloadAction<{ currentTime: number; duration: number }>) => {
      state.currentTime = action.payload.currentTime;
      state.duration = action.payload.duration;
    },
  },
});

export const { setAudio, togglePlayPause, stopAudio, updateCurrentTime, setDuration, updateSeekbar } = audioSlice.actions;
export default audioSlice.reducer;
