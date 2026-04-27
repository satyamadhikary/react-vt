import { useState } from "react";

interface UploadResult {
  url: string;
  public_id: string;
}

interface UseCloudinaryUploadReturn {
  uploadFile: (file: File, folder?: string) => Promise<UploadResult>;
  loading: boolean;
  error: string | null;
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_UPLOAD_PRESET;

export const useCloudinaryUpload = (): UseCloudinaryUploadReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (
    file: File,
    folder: string = "uploads"
  ): Promise<UploadResult> => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET as string);
      formData.append("folder", folder);

      // 🔥 Use "video/upload" for audio support
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!data.secure_url) {
        throw new Error(data.error?.message || "Upload failed");
      }

      return {
        url: data.secure_url,
        public_id: data.public_id,
      };
    } catch (err: any) {
      setError(err.message || "Upload error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { uploadFile, loading, error };
};