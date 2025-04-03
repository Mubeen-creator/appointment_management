import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process?.env?.CLOUDINARY_CLOUD_NAME,
  api_key: process?.env?.CLOUDINARY_API_KEY,
  api_secret: process?.env?.CLOUDINARY_API_SECRET,
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

    const arrayBuffer = await file.arrayBuffer();
    const bufferNew = Buffer?.from(arrayBuffer);

    const bufferBase64 = bufferNew.toString("base64");
    const imageData = `data:${file?.type};base64,${bufferBase64}`;

    const cloudinaryUploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        imageData,
        {
          folder: "profile-pictures",
          public_id: email,
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
