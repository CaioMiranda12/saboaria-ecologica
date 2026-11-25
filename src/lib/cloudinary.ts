import { v2 as cloudinary } from "cloudinary";

function configure() {
  const {
    CLOUDINARY_CLOUD_NAME: cloud_name,
    CLOUDINARY_API_KEY: api_key,
    CLOUDINARY_API_SECRET: api_secret,
  } = process.env;
  if (!cloud_name || !api_key || !api_secret)
    throw new Error("Configure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET.");
  cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
}

export type UploadedImage = {
  url: string;
  publicId: string;
  width: number;
  height: number;
  bytes: number;
};
export async function uploadMediaImage(buffer: Buffer): Promise<UploadedImage> {
  configure();
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "saboaria/midia",
          resource_type: "image",
          transformation: [
            { width: 2000, height: 2000, crop: "limit", quality: "auto", fetch_format: "auto" },
          ],
        },
        (error, result) => {
          if (error || !result) return reject(error ?? new Error("Upload sem resposta"));
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            bytes: result.bytes,
          });
        },
      )
      .end(buffer);
  });
}
export async function uploadProductImage(buffer: Buffer): Promise<string> {
  return (await uploadMediaImage(buffer)).url;
}
