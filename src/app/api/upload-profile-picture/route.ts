// app/api/upload-profile-picture/route.ts
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary (replace with your actual credentials)
cloudinary.config({
  cloud_name: "danpmrokt",
  api_key: "248192389666122",
  api_secret: "wq0kSY_rT3syY6HnlCuGB_DlrMg",
  secure: false,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData?.get("profilePicture") as Blob | null;
    const email = formData?.get("email") as string | null;

    if (!file || !email) {
      return NextResponse.json(
        { message: "File or email not provided" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Convert Blob to a format Cloudinary can understand (Buffer)
    const arrayBuffer = await file.arrayBuffer();
    const bufferNew = Buffer?.from(arrayBuffer);

    // Convert buffer to base64
    const bufferBase64 = bufferNew.toString("base64");
    // Prefix with the correct MIME type
    const imageData = `data:${file?.type};base64,${bufferBase64}`;

    // Upload the image to Cloudinary
    const cloudinaryUploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        imageData,
        {
          folder: "profile-pictures", // Optional folder in Cloudinary
          public_id: email, // Using email as public_id to avoid duplicates (optional)
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });

    const imageUrl = (cloudinaryUploadResponse as any)?.secure_url;

    if (!imageUrl) {
      return NextResponse.json(
        { message: "Error uploading image to Cloudinary" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "File uploaded successfully to Cloudinary", imageUrl },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
