/**
 * Universal Mobile-Optimized Client-Side Image Compressor
 * Resizes large camera photos (5-15MB) into lightweight, crystal-clear 
 * Data URLs (~40-80KB) in milliseconds using HTML5 Canvas.
 */

export const compressImage = (fileOrBlob, maxWidth = 800, maxHeight = 800, quality = 0.82) => {
  return new Promise((resolve, reject) => {
    if (!fileOrBlob) {
      resolve(null);
      return;
    }

    // If already a small string or remote URL, pass through
    if (typeof fileOrBlob === 'string' && (fileOrBlob.startsWith('http://') || fileOrBlob.startsWith('https://'))) {
      resolve(fileOrBlob);
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          let { width, height } = img;

          // Maintain aspect ratio
          if (width > maxWidth || height > maxHeight) {
            if (width / maxWidth > height / maxHeight) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = Math.max(width, 1);
          canvas.height = Math.max(height, 1);

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target.result); // Fallback to raw data url
            return;
          }

          // Use smooth rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Export compressed JPEG
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch (err) {
          console.warn('Canvas compression failed, returning original:', err);
          resolve(e.target.result);
        }
      };

      img.onerror = () => {
        resolve(e.target.result);
      };

      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error('Failed to read image file'));

    if (fileOrBlob instanceof Blob || fileOrBlob instanceof File) {
      reader.readAsDataURL(fileOrBlob);
    } else if (typeof fileOrBlob === 'string' && fileOrBlob.startsWith('data:')) {
      const img = new Image();
      img.onload = () => {
        // Reuse canvas compression
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          if (width / maxWidth > height / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = fileOrBlob;
    } else {
      resolve(null);
    }
  });
};
