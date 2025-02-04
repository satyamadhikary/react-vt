import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Audio } from "./types";

interface AudioState {
  currentAudio: Audio | null;
  isPlaying: boolean;
  currentTime: number; // Store current playback time
}

const initialState: AudioState = {
  currentAudio: null,
  isPlaying: false,
  currentTime: 0,
};

const audioSlice = createSlice({
  name: "audio",
  initialState,
  reducers: {
    setAudio: (state, action: PayloadAction<Audio>) => {
      if (state.currentAudio?.name !== action.payload.name) {
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
  },
});

export const { setAudio, togglePlayPause, stopAudio, updateCurrentTime } = audioSlice.actions;
export default audioSlice.reducer;
