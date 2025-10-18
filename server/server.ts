import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import mongoose, { Document, models, Schema } from "mongoose";

dotenv.config({ path: "./.env" });

const app = express();
const PORT: string = process.env.PORT;
const APPURL: string | undefined = process.env.APPURL;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// 🔹 MongoDB Connection
const mongoURI: string = process.env.MONGO_URI;

mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err: Error) =>
    console.error("❌ Failed to connect to MongoDB:", err)
  );

// Define Interface for Album & Songs
interface IAlbum extends Document {
  title: string;
  imageSrc: string[];
  songs: { title: string; audioSrc: string }[]; // Array of song objects
  timestamp?: Date;
}

// Function to Get a Collection Model Dynamically
const getCollectionModel = (collectionName: string) => {
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

// Serve the HTML Upload Page
app.get("/", (_req: Request, res: Response): void => {
  res.sendFile(path.join(__dirname, "public", "songupload.html"));
});

// 🔹 Save Album Data
app.post(
  "/save-urls/:collection",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { collection } = req.params;
      console.log(`📥 Saving data to collection: ${collection}`);

      if (!req.body || typeof req.body !== "object") {
        res
          .status(400)
          .json({ message: "❌ Invalid data format. Expected an object." });
        return;
      }

      const { title, audioSrc, imageSrc } = req.body;

      if (!title || !Array.isArray(audioSrc) || !Array.isArray(imageSrc)) {
        res
          .status(400)
          .json({
            message: "❌ Missing title, audioSrc, or imageSrc must be arrays.",
          });
        return;
      }

      // 🛠 Format `audioSrc` into an array of song objects with title and URL
      const songs = audioSrc.map((url, index) => ({
        title: `Track ${index + 1}`, // Placeholder titles, modify as needed
        audioSrc: url,
      }));

      // 🛠 Ensure `imageSrc` is stored correctly
      const dataToSave = {
        title,
        imageSrc, // Already an array, no need to modify
        songs, // Now includes song titles along with URLs
        timestamp: new Date(),
      };

      const Model = getCollectionModel(collection);
      await Model.create(dataToSave);

      res
        .status(200)
        .json({ message: `✅ Data saved successfully to ${collection}` });
    } catch (error) {
      console.error("❌ Error saving data:", error);
      res.status(500).json({ message: "❌ Error saving data", error });
    }
  }
);

// 🔹 Get Data from a Specific Collection
app.get(
  "/get-urls/:collection",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { collection } = req.params;
      console.log(`📤 Fetching data from collection: ${collection}`);

      const Model = getCollectionModel(collection);
      const data = await Model.find();

      res.status(200).json({ data });
    } catch (error) {
      console.error("❌ Error retrieving data:", error);
      res.status(500).json({ message: "❌ Error retrieving data", error });
    }
  }
);

// 🔹 Delete Album/Song by ID
app.delete(
  "/delete-url-by-id/:collection/:id",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { collection, id } = req.params;
      console.log(`🗑️ Deleting data from collection: ${collection}, ID: ${id}`);

      if (!["urls", "songs", "albums", "artists"].includes(collection)) {
        res.status(400).json({ message: "❌ Invalid collection name" });
        return;
      }

      const Model = getCollectionModel(collection);
      const deletedData = await Model.findByIdAndDelete(id);

      if (!deletedData) {
        res
          .status(404)
          .json({ message: "❌ No matching document found in database" });
        return;
      }

      res
        .status(200)
        .json({ message: `✅ Data deleted successfully from ${collection}` });
    } catch (error) {
      console.error("❌ Error deleting data:", error);
      res.status(500).json({ message: "❌ Error deleting data", error });
    }
  }
);

app.get("/api/search", async (req: Request, res: Response) => {
  const query = (req.query.q as string)?.trim();
  const collectionName = req.query.collection as string | undefined;

  if (!query) {
    return res.status(400).json({ error: "Search query is required" });
  }

  const regexQuery = { title: { $regex: query, $options: "i" } }; // partial + case-insensitive
  const results: any[] = []; // ✅ initialize correctly

  try {
    if (collectionName) {
      const Model = getCollectionModel(collectionName);
      if (!Model) {
        return res.status(400).json({ error: "Invalid collection" });
      }

      if (collectionName === "albums") {
        // Search for albums matching the query
        const albums = await Model.find(regexQuery).lean();

        albums.forEach((album: any) => {
          album.songs.forEach((song: any) => {
            results.push({
              albumTitle: album.title,
              albumId: album._id,
              imageSrc: album.imageSrc?.[0] || "",
              ...song,
            });
          });
        });

        // Also search inside songs of albums
        const nestedAlbums = await Model.find({
          "songs.title": { $regex: query, $options: "i" },
        }).lean();

        nestedAlbums.forEach((album: any) => {
          const matchedSongs = album.songs.filter((song: any) =>
            song.title.toLowerCase().includes(query.toLowerCase())
          );

          matchedSongs.forEach((song: any) => {
            results.push({
              albumTitle: album.title,
              albumId: album._id,
              imageSrc: album.imageSrc?.[0] || "",
              ...song,
            });
          });
        });

        return res.json(results);
      }

      // For non-album collections
      const found = await Model.find(regexQuery).lean();
      return res.json(found);
    }

    // 🔍 Search across all collections
    for (const key of Object.keys(models)) {
      const model = models[key];

      if (key === "albums") {
        const albums = await model.find(regexQuery).lean();

        albums.forEach((album: any) => {
          album.songs.forEach((song: any) => {
            results.push({
              albumTitle: album.title,
              albumId: album._id,
              imageSrc: album.imageSrc?.[0] || "",
              ...song,
            });
          });
        });

        const nestedAlbums = await model
          .find({ "songs.title": { $regex: query, $options: "i" } })
          .lean();

        nestedAlbums.forEach((album: any) => {
          const matchedSongs = album.songs.filter((song: any) =>
            song.title.toLowerCase().includes(query.toLowerCase())
          );
          matchedSongs.forEach((song: any) => {
            results.push({
              albumTitle: album.title,
              albumId: album._id,
              imageSrc: album.imageSrc?.[0] || "",
              ...song,
            });
          });
        });
      } else {
        const found = await model.find(regexQuery).lean();
        results.push(...found);
      }
    }

    res.json(results);
  } catch (error) {
    console.error("❌ Search error:", error);
    res.status(500).json({ error: "Search error" });
  }
});

// 🔹 Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on ${APPURL}`);
});
