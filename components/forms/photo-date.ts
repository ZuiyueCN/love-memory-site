"use client";

function readAscii(view: DataView, offset: number, length: number) {
  let value = "";

  for (let index = 0; index < length; index += 1) {
    const code = view.getUint8(offset + index);
    if (code === 0) {
      break;
    }
    value += String.fromCharCode(code);
  }

  return value.trim();
}

function parseExifDate(value: string) {
  const match = value.match(/^(\d{4}):(\d{2}):(\d{2})/);

  if (!match) {
    return null;
  }

  return `${match[1]}-${match[2]}-${match[3]}`;
}

function readTiffValue(view: DataView, tiffStart: number, entryOffset: number, littleEndian: boolean) {
  const type = view.getUint16(entryOffset + 2, littleEndian);
  const count = view.getUint32(entryOffset + 4, littleEndian);
  const valueOffset = entryOffset + 8;

  if (type !== 2 || count === 0) {
    return null;
  }

  const textOffset = count <= 4 ? valueOffset : tiffStart + view.getUint32(valueOffset, littleEndian);

  if (textOffset < 0 || textOffset + count > view.byteLength) {
    return null;
  }

  return readAscii(view, textOffset, count);
}

function findDateInIfd(view: DataView, tiffStart: number, ifdOffset: number, littleEndian: boolean): string | null {
  if (ifdOffset <= 0 || tiffStart + ifdOffset + 2 > view.byteLength) {
    return null;
  }

  const absoluteIfdOffset = tiffStart + ifdOffset;
  const entryCount = view.getUint16(absoluteIfdOffset, littleEndian);

  for (let index = 0; index < entryCount; index += 1) {
    const entryOffset = absoluteIfdOffset + 2 + index * 12;
    if (entryOffset + 12 > view.byteLength) {
      return null;
    }

    const tag = view.getUint16(entryOffset, littleEndian);

    if (tag === 0x9003 || tag === 0x9004 || tag === 0x0132) {
      const date = parseExifDate(readTiffValue(view, tiffStart, entryOffset, littleEndian) || "");
      if (date) {
        return date;
      }
    }

    if (tag === 0x8769) {
      const exifIfdOffset = view.getUint32(entryOffset + 8, littleEndian);
      const date = findDateInIfd(view, tiffStart, exifIfdOffset, littleEndian);
      if (date) {
        return date;
      }
    }
  }

  return null;
}

function readExifDateFromBuffer(buffer: ArrayBuffer) {
  const view = new DataView(buffer);

  if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) {
    return null;
  }

  let offset = 2;
  while (offset + 4 < view.byteLength) {
    if (view.getUint8(offset) !== 0xff) {
      break;
    }

    const marker = view.getUint8(offset + 1);
    const segmentLength = view.getUint16(offset + 2);

    if (marker === 0xe1 && offset + 4 + segmentLength <= view.byteLength) {
      const exifHeader = readAscii(view, offset + 4, 6);

      if (exifHeader === "Exif") {
        const tiffStart = offset + 10;
        const byteOrder = readAscii(view, tiffStart, 2);
        const littleEndian = byteOrder === "II";

        if (!littleEndian && byteOrder !== "MM") {
          return null;
        }

        const firstIfdOffset = view.getUint32(tiffStart + 4, littleEndian);
        return findDateInIfd(view, tiffStart, firstIfdOffset, littleEndian);
      }
    }

    offset += 2 + segmentLength;
  }

  return null;
}

export async function readPhotoTakenDate(file: File) {
  if (!file.type.includes("jpeg") && !file.name.toLowerCase().match(/\.(jpg|jpeg)$/)) {
    return null;
  }

  const buffer = await file.slice(0, Math.min(file.size, 512 * 1024)).arrayBuffer();
  return readExifDateFromBuffer(buffer);
}
