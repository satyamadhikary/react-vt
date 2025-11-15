import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { getCollectionModel } from "@/lib/models";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim();
  const collectionName = searchParams.get("collection");

  if (!query) {
    return NextResponse.json(
      { error: "Search query is required" },
      { status: 400 }
    );
  }

  const regexQuery = { title: { $regex: query, $options: "i" } };
  const results: any[] = [];

  try {
    if (collectionName) {
      const Model = getCollectionModel(collectionName);
      if (!Model) {
        return NextResponse.json(
          { error: "Invalid collection" },
          { status: 400 }
        );
      }

      if (collectionName === "albums") {
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

        return NextResponse.json(results, { status: 200 });
      }

      const found = await Model.find(regexQuery).lean();
      return NextResponse.json(found, { status: 200 });
    }

    for (const key of Object.keys(mongoose.models)) {
      const model = mongoose.models[key];

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

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error("❌ Search error:", error);
    return NextResponse.json(
      { error: "Search error" },
      { status: 500 }
    );
  }
}
