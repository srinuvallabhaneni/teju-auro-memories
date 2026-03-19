/**
 * Image compression and utility functions using the Canvas API.
 * No external dependencies required.
 */

/**
 * Generate a UUID-like string for photo/resource IDs.
 * @returns {string}
 */
export const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Load a File/Blob into an HTMLImageElement.
 * @param {File|Blob} file
 * @returns {Promise<HTMLImageElement>}
 */
const loadImage = (file) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });

/**
 * Resize an image using a canvas and return the result as a JPEG Blob.
 * Maintains aspect ratio based on maxWidth.
 *
 * @param {HTMLImageElement} img
 * @param {number} maxWidth
 * @param {number} quality — JPEG quality 0-1
 * @returns {Promise<Blob>}
 */
const resizeToBlob = (img, maxWidth, quality) =>
  new Promise((resolve, reject) => {
    let { width, height } = img;

    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas toBlob returned null'));
        }
      },
      'image/jpeg',
      quality
    );
  });

/**
 * Compress an image file to a JPEG Blob, scaling down to maxWidth while
 * preserving aspect ratio.
 *
 * @param {File} file — input image File
 * @param {number} [maxWidth=1920] — maximum width in pixels
 * @param {number} [quality=0.8] — JPEG quality (0-1)
 * @returns {Promise<Blob>}
 */
export const compressImage = async (file, maxWidth = 1920, quality = 0.8) => {
  const img = await loadImage(file);
  return resizeToBlob(img, maxWidth, quality);
};

/**
 * Create a small thumbnail JPEG Blob from an image file.
 *
 * @param {File} file — input image File
 * @param {number} [maxWidth=300] — maximum thumbnail width in pixels
 * @param {number} [quality=0.7] — JPEG quality (0-1)
 * @returns {Promise<Blob>}
 */
export const createThumbnail = async (file, maxWidth = 300, quality = 0.7) => {
  const img = await loadImage(file);
  return resizeToBlob(img, maxWidth, quality);
};

/**
 * Convert a Blob to a data URL string (base64-encoded).
 *
 * @param {Blob} blob
 * @returns {Promise<string>}
 */
export const blobToDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
