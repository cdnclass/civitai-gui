export async function fetchBlob(src: string | Blob | File) {
  let blob: Blob | File | null;
  if (typeof src === 'string')
    blob = await fetch(src)
      .then((response) => response.blob())
      .catch(() => null);
  else blob = src;
  return blob;
}

export async function fetchBlobAsFile(src: string | Blob | File, fileName: string) {
  const blob = await fetchBlob(src);
  if (!blob) return null;
  return new File([blob], fileName, { type: blob.type });
}

export async function fetchBlobAsBase64(src: string | Blob | File) {
  const blob = await fetchBlob(src);
  if (!blob) return null;
  return getBase64(blob);
}

export const getBase64 = (blob: Blob | File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (!reader.result) throw new Error('failed to read blob');
      const base64 =
        typeof reader.result === 'string' ? reader.result : new TextDecoder().decode(reader.result);
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
