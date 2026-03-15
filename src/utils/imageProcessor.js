import imageCompression from 'browser-image-compression';

/**
 * Normalizes an image file by compressing and resizing it.
 *
 * @param {File} file - The original image file.
 * @param {Object} [customOptions={}] - Optional custom settings to override defaults.
 * @returns {Promise<{file: File, dataUrl: string}>} A promise that resolves to an object containing the compressed File and its Base64 Data URL.
 */
export const normalizeImage = async (file, customOptions = {}) => {
  if (!file) {
    throw new Error('No file provided for normalization.');
  }

  // Default options
  const defaultOptions = {
    maxSizeMB: 1, // Max file size in MB
    maxWidthOrHeight: 800, // Max dimension
    useWebWorker: true, // Use multi-threading for faster compression
    fileType: 'image/jpeg', // Force output format to JPEG
  };

  const options = { ...defaultOptions, ...customOptions };

  try {
    // Compress the image
    const compressedFile = await imageCompression(file, options);

    // Generate a Data URL (Base64) from the compressed file for preview
    const dataUrl = await imageCompression.getDataUrlFromFile(compressedFile);

    return { file: compressedFile, dataUrl };
  } catch (error) {
    console.error('Error normalizing image:', error);
    throw error;
  }
};
