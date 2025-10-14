import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as VideoThumbnails from "expo-video-thumbnails";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function detectMediaType(
  url: string
): Promise<"image" | "video" | "unknown"> {
  // If it's a local file (e.g. from ImagePicker)
  if (typeof url !== "string") return "unknown";

  // Check file extension
  const lowerUrl = url.toLowerCase();
  if (
    lowerUrl.endsWith(".jpg") ||
    lowerUrl.endsWith(".jpeg") ||
    lowerUrl.endsWith(".png") ||
    lowerUrl.endsWith(".gif") ||
    lowerUrl.endsWith(".heic")
  ) {
    return "image";
  }
  if (
    lowerUrl.endsWith(".mp4") ||
    lowerUrl.endsWith(".mov") ||
    lowerUrl.endsWith(".avi") ||
    lowerUrl.endsWith(".mkv")
  ) {
    return "video";
  }

  // Try to fetch content type (for remote URLs)
  try {
    const response = await fetch(url, { method: "HEAD" });
    const contentType = response.headers.get("content-type");
    if (contentType?.startsWith("image")) return "image";
    if (contentType?.startsWith("video")) return "video";
  } catch (e) {
    console.warn("Could not detect media type:", e);
  }

  return "unknown";
}

async function generateVideoFrames(videoUri: string, count = 12) {
  const { duration } = await VideoThumbnails.getThumbnailAsync(videoUri, {
    time: 0,
  });
  const interval = duration / count;
  const frames = [];

  for (let i = 0; i < count; i++) {
    const time = i * interval;
    const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, { time });
    frames.push(uri);
  }
  return frames; // array of local file URIs (image thumbnails)
}
