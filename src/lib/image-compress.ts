'use client';

const MAX_DIMENSION = 1920;
const JPEG_QUALITY = 0.85;
// Por debajo de este tamano no merece la pena recodificar: se evita perder
// calidad en diagramas/PNG con transparencia sin ganar peso real.
const SKIP_THRESHOLD_BYTES = 400_000;

/**
 * Redimensiona y recomprime una imagen (dataURL) antes de guardarla. Las
 * capturas de pantalla sin comprimir pueden pesar varios MB en base64 y se
 * duplican en el estado, el backup y el HTML exportado del informe.
 * Ante cualquier fallo (imagen invalida, sin canvas, etc.) devuelve el
 * dataURL original: nunca bloquea la subida.
 */
export function compressImageDataUrl(
  dataUrl: string,
  options?: { maxDimension?: number; quality?: number }
): Promise<string> {
  const maxDimension = options?.maxDimension ?? MAX_DIMENSION;
  const quality = options?.quality ?? JPEG_QUALITY;

  return new Promise((resolve) => {
    if (typeof document === 'undefined') {
      resolve(dataUrl);
      return;
    }
    const img = new Image();
    img.onload = () => {
      const longestSide = Math.max(img.width, img.height);
      const scale = longestSide > maxDimension ? maxDimension / longestSide : 1;
      if (scale === 1 && dataUrl.length < SKIP_THRESHOLD_BYTES) {
        resolve(dataUrl);
        return;
      }

      const width = Math.max(1, Math.round(img.width * scale));
      const height = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      // El JPEG no soporta transparencia: fondo blanco para evitar bordes
      // negros en capturas con canal alfa.
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      const compressed = canvas.toDataURL('image/jpeg', quality);
      resolve(compressed.length < dataUrl.length ? compressed : dataUrl);
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}
