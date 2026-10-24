import { v2 as cloudinary } from "cloudinary";

const UPLOAD_FOLDER = "saboaria/produtos";

let configured = false;

function configure() {
  if (configured) return;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary não configurado: defina CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET.",
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  configured = true;
}

/** Envia a imagem para o Cloudinary e devolve a URL https pública. */
export function uploadProductImage(buffer: Buffer): Promise<string> {
  configure();

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: UPLOAD_FOLDER, resource_type: "image" }, (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Resposta vazia do Cloudinary."));
          return;
        }
        resolve(result.secure_url);
      })
      .end(buffer);
  });
}