const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { Schema } = mongoose;

dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 5000;
const APPURL = process.env.APP_URL;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// 🔹 MongoDB Connection
const mongoURI = process.env.MONGO_URI;

mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// 🔹 Define Schemas for Different Collections
const schemas = {
  albums: new Schema({
    title: { type: String, required: true },
    imageSrc: [{ type: String, required: true }],
    songs: [
      {
        title: { type: String, required: true },
        audioSrc: { type: String, required: true },
      },
    ],
    timestamp: { type: Date, default: Date.now },
  }),
  songs: new Schema({
    title: { type: String, required: true },
    album: { type: String },
    audioSrc: { type: String, required: true },
    imageSrc: { type: String },
    timestamp: { type: Date, default: Date.now },
  }),
  artists: new Schema({
    name: { type: String, required: true },
    imageSrc: { type: String },
    albums: [{ type: String }],
    timestamp: { type: Date, default: Date.now },
  }),
  urls: new Schema({
    audioSrc: { type: [String], required: true },  
    imageSrc: { type: [String], required: true },
    title: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  }),
};

const models = {
  albums: mongoose.model("albums", schemas.albums),
  songs: mongoose.model("songs", schemas.songs),
  artists: mongoose.model("artists", schemas.artists),
  urls: mongoose.model("urls", schemas.urls),
};

// 🔹 Save Data Endpoint
app.post("/save-urls/:collection", async (req, res) => {
  try {
    const { collection } = req.params;
    if (!models[collection]) {
      return res.status(400).json({ message: "❌ Invalid collection name" });
    }

    await models[collection].create(req.body);
    res.status(200).json({ message: `✅ Data saved successfully to ${collection}` });
  } catch (error) {
    res.status(500).json({ message: "❌ Error saving data", error });
  }
});app.post("/save-urls/:collection", async (req, res) => {
  try {
    const { collection } = req.params;
    if (!models[collection]) {
      return res.status(400).json({ message: "❌ Invalid collection name" });
    }

    const data = req.body;

    // Validate based on collection type
    if (collection === "albums") {
      if (!data.title || !Array.isArray(data.imageSrc) || !Array.isArray(data.songs)) {
        return res.status(400).json({
          message: "❌ Missing title, imageSrc (array), or songs (array).",
        });
      }
    } else if (collection === "songs") {
      if (!data.title || !data.audioSrc) {
        return res.status(400).json({
          message: "❌ Missing title or audioSrc.",
        });
      }
    } else if (collection === "artists") {
      if (!data.name) {
        return res.status(400).json({
          message: "❌ Missing artist name.",
        });
      }
    } else if (collection === "urls") {
      if (!data.title || !data.url) {
        return res.status(400).json({
          message: "❌ Missing title or URL.",
        });
      }
    }

    // Save to MongoDB
    await models[collection].create(data);

    res.status(200).json({ message: `✅ Data saved successfully to ${collection}` });
  } catch (error) {
    console.error("❌ Error saving data:", error);
    res.status(500).json({ message: "❌ Error saving data", error });
  }
});


// 🔹 Get Data Endpoint
app.get("/get-urls/:collection", async (req, res) => {
  try {
    const { collection } = req.params;
    if (!models[collection]) {
      return res.status(400).json({ message: "❌ Invalid collection name" });
    }

    const data = await models[collection].find();
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching data", error });
  }
});

// 🔹 Delete Endpoint
app.delete("/delete/:collection/:id", async (req, res) => {
  try {
    const { collection, id } = req.params;
    if (!models[collection]) {
      return res.status(400).json({ message: "❌ Invalid collection" });
    }

    const deleted = await models[collection].findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "❌ No matching document found" });
    }
    res.status(200).json({ message: `✅ Deleted from ${collection}` });
  } catch (error) {
    res.status(500).json({ message: "❌ Error deleting data", error });
  }
});

app.get("/api/all-data", async (req, res) => {
  try {
    const data = {};
    await Promise.all(
      Object.keys(models).map(async (key) => {
        data[key] = await models[key].find();
      })
    );
    res.status(200).json(data);
  } catch (err) {
    console.error("❌ Error fetching all data:", err);
    res.status(500).json({ message: "❌ Error fetching all data" });
  }
});

// Route to search data
app.get('/api/search', async (req, res) => {
  const query = req.query.q?.trim();
  const collectionName = req.query.collection;

  if (!query) {
    return res.status(400).json({ error: "Search query is required" });
  }

  const regexQuery = { title: { $regex: query, $options: 'i' } }; // ✅ partial + case-insensitive
  const results = [];

  try {
    if (collectionName) {
      const model = models[collectionName];
      if (!model) return res.status(400).json({ error: 'Invalid collection' });

      if (collectionName === 'albums') {
        // 🔍 Match album titles partially
        const albums = await model.find(regexQuery).lean();

        albums.forEach(album => {
          album.songs.forEach(song => {
            results.push({
              albumTitle: album.albumTitle,
              albumId: album._id,
              imageSrc: album.imageSrc?.[0] || "",
              ...song
            });
          });
        });

        // Also search inside song titles in albums
        const nestedAlbums = await model.find({ "songs.title": { $regex: query, $options: 'i' } }).lean();

        nestedAlbums.forEach(album => {
          const matchedSongs = album.songs.filter(song =>
            song.title.toLowerCase().includes(query.toLowerCase())
          );
          matchedSongs.forEach(song => {
            results.push({
              albumTitle: album.albumTitle,
              albumId: album._id,
              imageSrc: album.imageSrc?.[0] || "",
              ...song
            });
          });
        });

        return res.json(results);
      }

      const found = await model.find(regexQuery).lean();
      return res.json(found);
    }

    // Search across all collections
    for (const key of Object.keys(models)) {
      const model = models[key];

      if (key === 'albums') {
        const albums = await model.find(regexQuery).lean();

        albums.forEach(album => {
          album.songs.forEach(song => {
            results.push({
              albumTitle: album.albumTitle,
              albumId: album._id,
              imageSrc: album.imageSrc?.[0] || "",
              ...song
            });
          });
        });

        const nestedAlbums = await model.find({ "songs.title": { $regex: query, $options: 'i' } }).lean();

        nestedAlbums.forEach(album => {
          const matchedSongs = album.songs.filter(song =>
            song.title.toLowerCase().includes(query.toLowerCase())
          );
          matchedSongs.forEach(song => {
            results.push({
              albumTitle: album.albumTitle,
              albumId: album._id,
              imageSrc: album.imageSrc?.[0] || "",
              ...song
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
    res.status(500).json({ error: 'Search error' });
  }
});


app.get("/", (req, res) => {
  res.send("Backend is running");
});
// 🔹 Start Server
app.listen(PORT, () => {
  console.log(`Server is running on ${APPURL || `http://localhost:${PORT}`}`);
});
