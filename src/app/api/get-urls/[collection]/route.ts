import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { getCollectionModel } from "@/lib/models";

export async function GET(
  req: NextRequest,
  context: { params: { collection: string } }
) {
  await dbConnect();
  const { collection } = context.params;

  try {
    console.log(`📤 Fetching data from collection: ${collection}`);

    const Model = getCollectionModel(collection);
    const data = await Model.find();

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("❌ Error retrieving data:", error);
    return NextResponse.json(
      { message: "❌ Error retrieving data", error },
      { status: 500 }
    );
  }
}
