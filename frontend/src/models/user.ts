import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // hashed
  role: {
    type: String,
    enum: ["listener", "artist"],
    default: "listener",
  },

  // future flexibility 👇
//   likedSongs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
//   uploadedSongs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
});

export default mongoose.models.User || mongoose.model("User", userSchema);