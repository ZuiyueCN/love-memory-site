"use client";

const maxCompressedImageSize = 4 * 1024 * 1024;
const targetCompressedImageSize = Math.floor(maxCompressedImageSize * 0.92);
const maxImageDimension = 2200;

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("图片压缩失败，请换一张照片再试。"));
        }
      },
      type,
      quality
    );
  });
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("图片读取失败，请换一张照片再试。"));
    };
    image.src = objectUrl;
  });
}

function jpegName(fileName: string) {
  const baseName = fileName.replace(/\.[^.]+$/, "") || "photo";
  return `${baseName}.jpg`;
}

export async function compressImageFile(file: File) {
  if (!file.type.startsWith("image/") || file.size <= maxCompressedImageSize) {
    return file;
  }

  const image = await loadImage(file);
  const originalWidth = image.naturalWidth || image.width;
  const originalHeight = image.naturalHeight || image.height;
  const baseScale = Math.min(1, maxImageDimension / Math.max(originalWidth, originalHeight));
  const qualities = [0.86, 0.78, 0.7, 0.62, 0.54, 0.46];

  let scale = baseScale;
  for (let attempt = 0; attempt < 7; attempt += 1) {
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(originalWidth * scale));
    canvas.height = Math.max(1, Math.round(originalHeight * scale));

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("浏览器不支持图片压缩，请换一个浏览器再试。");
    }

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    for (const quality of qualities) {
      const blob = await canvasToBlob(canvas, "image/jpeg", quality);

      if (blob.size <= targetCompressedImageSize) {
        return new File([blob], jpegName(file.name), {
          type: "image/jpeg",
          lastModified: Date.now()
        });
      }
    }

    scale *= 0.82;
  }

  throw new Error("图片压缩后仍然超过 4MB，请先裁剪或换一张照片。");
}

export async function compressImageFiles(files: FileList) {
  const compressedFiles: File[] = [];

  for (const file of Array.from(files)) {
    compressedFiles.push(await compressImageFile(file));
  }

  return compressedFiles;
}
