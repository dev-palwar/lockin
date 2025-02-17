import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/firebaseAdmin";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, fileName } = await req.json();

    if (!imageBase64 || !fileName) {
      return NextResponse.json(
        { error: "Missing image or filename" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(imageBase64, "base64");
    const uniqueFileName = `${uuidv4()}-${fileName}`;
    const file = storage.file(`uploads/${uniqueFileName}`);

    await file.save(buffer, { contentType: "image/jpeg" });

    const [url] = await file.getSignedUrl({
      action: "read",
      expires: "01-01-2030",
    });

    return NextResponse.json({ imageUrl: url }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
