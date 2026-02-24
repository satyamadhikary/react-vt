import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { getCollectionModel } from "@/lib/models";

interface RouteParams {
  collection: string;
  id: string;
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<RouteParams> }
) {
  await dbConnect();

  // ⬅️ FIX: Await params
  const { collection, id } = await context.params;

  try {
    console.log(`🗑️ Deleting data from collection: ${collection}, ID: ${id}`);

    if (!["urls", "songs", "albums", "artists"].includes(collection)) {
      return NextResponse.json(
        { message: "❌ Invalid collection name" },
        { status: 400 }
      );
    }

    const Model = getCollectionModel(collection);
    const deletedData = await Model.findByIdAndDelete(id);

    if (!deletedData) {
      return NextResponse.json(
        { message: "❌ No matching document found in database" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: `✅ Data deleted successfully from ${collection}` },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting data:", error);
    return NextResponse.json(
      { message: "❌ Error deleting data", error },
      { status: 500 }
    );
  }
}
