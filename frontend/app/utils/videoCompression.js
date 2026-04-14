// src/menu/utils/videoCompression.js

/**
 * "Compress" a video file – for now, this only validates size
 * and returns the original file so the UI stays responsive.
 *
 * We keep the same API so we can swap in a real FFmpeg-based
 * implementation later (ideally in a worker or on the backend).
 *
 * @param {File} file
 * @returns {Promise<File>}
 */
export async function compressVideoFile(file) {
  if (!file) return null;

  // Match backend max size (100 MB)
  const MAX_SIZE_MB = 100;
  const sizeInMB = file.size / (1024 * 1024);

  if (sizeInMB > MAX_SIZE_MB) {
    const err = new Error(
      `Video is too large (${sizeInMB.toFixed(
        1
      )} MB). Max allowed is ${MAX_SIZE_MB} MB`
    );
    // Optional: add a code for easier handling
    // @ts-ignore
    err.code = "FILE_TOO_LARGE";
    throw err;
  }

  // No actual compression yet – just return original file
  return file;
}
