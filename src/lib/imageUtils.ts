/**
 * Utility functions for automatic image resizing, aspect ratio fitting, and optimization.
 */

export interface ResizeOptions {
  targetWidth?: number;
  targetHeight?: number;
  quality?: number;
  mimeType?: 'image/webp' | 'image/jpeg' | 'image/png';
}

/**
 * Resizes and crops an image to exact target dimensions and aspect ratio using proportional cover mode,
 * preventing any distortion or stretching.
 */
export async function resizeImageToAspect(
  fileOrUrl: File | string,
  options: ResizeOptions = {}
): Promise<string> {
  const {
    targetWidth = 1920,
    targetHeight = 1080,
    quality = 0.88,
    mimeType = 'image/jpeg',
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const handleLoad = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Could not get 2D canvas context'));
          return;
        }

        // Enable high-quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Fill background with neutral dark fill in case of transparency
        ctx.fillStyle = '#171717';
        ctx.fillRect(0, 0, targetWidth, targetHeight);

        // Proportional "cover" math: scales to completely fill the canvas while maintaining aspect ratio
        const scale = Math.max(targetWidth / img.width, targetHeight / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const offsetX = (targetWidth - scaledWidth) / 2;
        const offsetY = (targetHeight - scaledHeight) / 2;

        // Draw centered and proportionally fitted
        ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);

        // Export as optimized data URL
        const dataUrl = canvas.toDataURL(mimeType, quality);
        resolve(dataUrl);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for processing'));
    };

    if (typeof fileOrUrl === 'string') {
      img.src = fileOrUrl;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          img.src = e.target.result;
        } else {
          reject(new Error('Failed to read file as Data URL'));
        }
      };
      reader.onerror = () => reject(new Error('FileReader error'));
      reader.readAsDataURL(fileOrUrl);
    }
  });
}
