import mongoose, { Document, models, Schema } from "mongoose";

// Define Interface for Album & Songs
export interface IAlbum extends Document {
  title: string;
  imageSrc: string[];
  songs: { title: string; audioSrc: string }[]; // Array of song objects
  timestamp?: Date;
}

// Function to Get a Collection Model Dynamically
export const getCollectionModel = (collectionName: string) => {
  const allowedCollections = ["urls", "songs", "albums", "artists"];
  if (!allowedCollections.includes(collectionName)) {
    throw new Error("❌ Invalid collection");
  }

  const commonSchema = new Schema({
    title: { type: String, required: true },
    imageSrc: [{ type: String, required: true }], // Array of image URLs
    songs: [
      {
        title: { type: String, required: true },
        audioSrc: { type: String, required: true },
      },
    ],
    timestamp: { type: Date, default: Date.now },
  });

  return (
    mongoose.models[collectionName] ||
    mongoose.model(collectionName, commonSchema)
  );
};
