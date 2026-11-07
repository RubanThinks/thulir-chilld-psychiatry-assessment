import React, { useRef, useState } from 'react';
import { Upload, Trash2, User, Loader2 } from 'lucide-react';
import { uploadToCloudinary } from '../../services/cloudinary';

interface PhotoUploaderProps {
  photoUrl: string;
  onChange: (url: string) => void;
  label?: string;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  photoUrl,
  onChange,
  label = 'Student Passport Photo',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB. Please choose a smaller image.');
      return;
    }

    setIsUploading(true);
    setUploadStatus('Uploading to Cloudinary...');

    try {
      // Try Cloudinary direct signed upload
      const cloudUrl = await uploadToCloudinary(file, { folder: 'thulir_students' });
      onChange(cloudUrl);
      setUploadStatus('Uploaded to Cloudinary!');
      setTimeout(() => setUploadStatus(null), 3000);
    } catch (err: any) {
      console.warn('Cloudinary upload fallback to local reader:', err);
      // Fallback to local data URL if offline or network error
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange(event.target.result as string);
          setUploadStatus('Saved locally (Offline/Fallback)');
          setTimeout(() => setUploadStatus(null), 3000);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const isCloudImage = photoUrl && (photoUrl.startsWith('http://') || photoUrl.startsWith('https://'));

  return (
    <div className="bg-slate-50 border-2 border-slate-300 rounded p-4 flex flex-col sm:flex-row items-center gap-4">
      {/* Photo frame */}
      <div className="relative w-28 h-36 rounded border-2 border-slate-400 bg-white overflow-hidden flex items-center justify-center shrink-0">
        {isUploading ? (
          <div className="flex flex-col items-center justify-center p-2 text-center text-teal-800">
            <Loader2 className="w-6 h-6 animate-spin mb-1 text-teal-700" />
            <span className="text-[10px] font-bold">Uploading...</span>
          </div>
        ) : photoUrl ? (
          <>
            <img src={photoUrl} alt="Student" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-1 right-1 p-1 bg-red-700 text-white rounded hover:bg-red-800 transition-none"
              title="Remove photo"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            {isCloudImage && (
              <span
                className="absolute bottom-1 left-1 bg-teal-800/90 text-white text-[9px] font-bold px-1 rounded flex items-center gap-0.5"
                title="Hosted on Cloudinary"
              >
                Cloud
              </span>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-500 p-2 text-center">
            <User className="w-8 h-8 text-slate-400 mb-1" />
            <span className="text-[11px] font-bold text-slate-700">Passport Photo</span>
          </div>
        )}
      </div>

      {/* Upload Controls */}
      <div className="space-y-2 text-center sm:text-left flex-1">
        <div>
          <h4 className="text-sm font-bold text-slate-900">{label}</h4>
          <p className="text-xs text-slate-700">
            Select a photo from your phone or computer. Formatted automatically into Page 1 and backed up to Cloudinary.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            disabled={isUploading}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-800 hover:bg-teal-900 disabled:bg-teal-600 text-white text-xs font-bold rounded border border-teal-900 transition-none"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5" />
                Select Photo from Device
              </>
            )}
          </button>

          {photoUrl && !isUploading && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="inline-flex items-center gap-1 px-3 py-2 text-red-700 hover:bg-red-50 rounded border border-red-300 text-xs font-bold transition-none"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove Photo
            </button>
          )}
        </div>

        {uploadStatus && (
          <p className="text-xs font-semibold text-teal-800">
            {uploadStatus}
          </p>
        )}
      </div>
    </div>
  );
};
