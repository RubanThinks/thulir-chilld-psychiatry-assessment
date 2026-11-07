/**
 * Cloudinary Upload Service
 * Allows direct browser upload for student photos, signatures, and family tree diagrams.
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
const API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY || '';
const API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET || '';

async function generateSha1(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export interface CloudinaryUploadOptions {
  folder?: string;
  tags?: string[];
}

export async function uploadToCloudinary(
  fileOrBase64: File | Blob | string,
  options: CloudinaryUploadOptions = { folder: 'thulir_assessments' }
): Promise<string> {
  const folder = options.folder || 'thulir_assessments';
  const timestamp = Math.floor(Date.now() / 1000);

  // Cloudinary signature string needs parameters sorted alphabetically: folder=...&timestamp=...<secret>
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}${API_SECRET}`;
  const signature = await generateSha1(paramsToSign);

  const formData = new FormData();
  formData.append('file', fileOrBase64);
  formData.append('api_key', API_KEY);
  formData.append('timestamp', timestamp.toString());
  formData.append('folder', folder);
  formData.append('signature', signature);

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Cloudinary upload failed: ${response.statusText}`);
  }

  const result = await response.json();
  return result.secure_url as string;
}
