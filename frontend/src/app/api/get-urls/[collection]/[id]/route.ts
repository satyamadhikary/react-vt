import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { getCollectionModel } from "@/lib/models";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ collection: string; id: string }> }
) {
  await dbConnect();

  const { collection, id } = await context.params; // 👈 FIX

  try {
    console.log(`📤 Fetching data from collection: ${collection} with id: ${id}`);

    const Model = getCollectionModel(collection);
    const data = await Model.findById(id);

    if (!data) {
      return NextResponse.json({ message: "❌ No data found" }, { status: 404 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("❌ Error retrieving data:", error);
    return NextResponse.json(
      { message: "❌ Error retrieving data", error },
      { status: 500 }
    );
  }
}
