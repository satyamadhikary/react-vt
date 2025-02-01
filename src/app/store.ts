import { configureStore } from "@reduxjs/toolkit";
import audioReducer from "../features/audio/audioSlice";

export const store = configureStore({
  reducer: {
    audio: audioReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
