import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const folder = (formData.get("folder") as string) || "empireexperts";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const maxSizeBytes = 5 * 1024 * 1024; // 5 MB
  if (file.size > maxSizeBytes) {
    return NextResponse.json({ error: "File too large. Max 5 MB." }, { status: 400 });
  }

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: "Only JPEG, PNG, WebP, or GIF allowed." }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const dataUri = `data:${file.type};base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  });

  return NextResponse.json({ url: result.secure_url });
}
