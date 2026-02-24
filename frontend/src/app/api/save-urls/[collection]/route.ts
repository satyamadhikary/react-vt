import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { getCollectionModel } from "@/lib/models";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ collection: string }> }
) {
  await dbConnect();
  const { collection } = await context.params;

  try {
    const body = await req.json();
    console.log(`📥 Saving data to collection: ${collection}`);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { message: "❌ Invalid data format. Expected an object." },
        { status: 400 }
      );
    }

    // Adjusted for the client-side logic that now sends `songs` and `imageSrc` correctly
    const { title, songs, imageSrc } = body;

    if (!title || !Array.isArray(songs) || !Array.isArray(imageSrc)) {
      return NextResponse.json(
        {
          message: "❌ Missing title, songs (array), or imageSrc (array).",
        },
        { status: 400 }
      );
    }

    const dataToSave = {
      title,
      imageSrc,
      songs,
      timestamp: new Date(),
    };

    const Model = getCollectionModel(collection);
    await Model.create(dataToSave);

    return NextResponse.json(
      { message: `✅ Data saved successfully to ${collection}` },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error saving data:", error);
    return NextResponse.json(
      { message: "❌ Error saving data", error },
      { status: 500 }
    );
  }
}
