// utils/videoPrefetch.ts
import * as FileSystem from "expo-file-system";

const CACHE_DIR = `${FileSystem.cacheDirectory}videos/`;

// Ensure cache directory exists
export const initCacheDirectory = async () => {
  try {
    const dirInfo = await FileSystem.getInfoAsync(CACHE_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
    }
  } catch (e) {
    console.log("Cache dir error:", e);
  }
};

// Get cache key from URL
const getCacheKey = (url: string): string => {
  return url.split("/").pop()?.split("?")[0] || `video_${Date.now()}`;
};

// Check if video is cached
export const isVideoCached = async (url: string): Promise<string | null> => {
  try {
    const cacheKey = getCacheKey(url);
    const filePath = `${CACHE_DIR}${cacheKey}`;
    const fileInfo = await FileSystem.getInfoAsync(filePath);

    if (fileInfo.exists) {
      console.log("✅ Video cached:", cacheKey);
      return filePath;
    }
    return null;
  } catch (e) {
    return null;
  }
};

// 🔥 NEW: Download and cache video with partial download support
export const cacheVideo = async (
  url: string,
  onProgress?: (progress: number) => void,
  partialPercent?: number // Download only X% of the video (e.g., 30)
): Promise<string> => {
  try {
    await initCacheDirectory();

    const cacheKey = getCacheKey(url);
    const filePath = `${CACHE_DIR}${cacheKey}`;

    // Check if already cached
    const cached = await isVideoCached(url);
    if (cached) {
      console.log("⚡ Using cached video");
      return cached;
    }

    console.log(
      `📥 Downloading ${
        partialPercent ? `${partialPercent}%` : "100%"
      } of video:`,
      cacheKey
    );

    // 🔥 Partial download using Range header
    if (partialPercent && partialPercent < 100) {
      try {
        // First, get the total file size
        const headResponse = await fetch(url, { method: "HEAD" });
        const contentLength = headResponse.headers.get("content-length");
        const totalSize = contentLength ? parseInt(contentLength) : 0;

        if (totalSize > 0) {
          const bytesToDownload = Math.floor(
            totalSize * (partialPercent / 100)
          );

          console.log(
            `📊 Total: ${(totalSize / 1024 / 1024).toFixed(
              1
            )}MB, downloading: ${(bytesToDownload / 1024 / 1024).toFixed(1)}MB`
          );

          // Download partial content with Range header
          const downloadResumable = FileSystem.createDownloadResumable(
            url,
            filePath,
            {
              headers: {
                Range: `bytes=0-${bytesToDownload - 1}`, // 👈 Only download first X%
              },
            },
            (downloadProgress) => {
              const progress =
                downloadProgress.totalBytesWritten / bytesToDownload;
              onProgress?.(Math.min(progress, 1));
            }
          );

          const result = await downloadResumable.downloadAsync();

          if (result?.uri) {
            console.log(`✅ Cached ${partialPercent}% of video:`, cacheKey);
            return result.uri;
          }
        }
      } catch (rangeError) {
        console.log(
          "⚠️ Server does not support Range requests, streaming instead"
        );
        return url; // Fallback to streaming
      }
    }

    // Full download (if partialPercent not specified or failed)
    const downloadResumable = FileSystem.createDownloadResumable(
      url,
      filePath,
      {},
      (downloadProgress) => {
        const progress =
          downloadProgress.totalBytesWritten /
          downloadProgress.totalBytesExpectedToWrite;
        onProgress?.(progress);
      }
    );

    const result = await downloadResumable.downloadAsync();

    if (result?.uri) {
      console.log("✅ Video fully cached:", cacheKey);
      return result.uri;
    }

    return url;
  } catch (e) {
    console.log("❌ Cache error:", e);
    return url; // Fallback to streaming
  }
};

// 🔥 UPDATED: Prefetch multiple videos with partial download support
export const prefetchVideos = async (
  urls: string[],
  onProgress?: (index: number, progress: number) => void,
  partialPercent: number = 30 // 👈 Default to 30%
): Promise<void> => {
  console.log(`🚀 Prefetching ${urls.length} videos at ${partialPercent}%...`);

  for (let i = 0; i < urls.length; i++) {
    try {
      await cacheVideo(
        urls[i],
        (progress) => {
          onProgress?.(i, progress);
        },
        partialPercent // 👈 Pass partial percentage
      );
    } catch (e) {
      console.log(`Failed to cache video ${i}:`, e);
    }
  }

  console.log("✅ All videos prefetched!");
};

// Clear cache (optional - for memory management)
export const clearVideoCache = async (): Promise<void> => {
  try {
    const dirInfo = await FileSystem.getInfoAsync(CACHE_DIR);
    if (dirInfo.exists) {
      await FileSystem.deleteAsync(CACHE_DIR, { idempotent: true });
      await initCacheDirectory();
      console.log("🧹 Cache cleared");
    }
  } catch (e) {
    console.log("Cache clear error:", e);
  }
};

// Get cache size (optional - for monitoring)
export const getCacheSize = async (): Promise<number> => {
  try {
    const dirInfo = await FileSystem.getInfoAsync(CACHE_DIR);
    if (dirInfo.exists && "size" in dirInfo) {
      return dirInfo.size || 0;
    }
    return 0;
  } catch (e) {
    return 0;
  }
};
