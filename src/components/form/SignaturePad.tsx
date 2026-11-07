import React, { useRef, useState } from 'react';
import { Upload, Check, Trash2, FileCheck, Loader2 } from 'lucide-react';
import { uploadToCloudinary } from '../../services/cloudinary';

interface SignaturePadProps {
  signatureImage: string;
  onSave: (dataUrl: string) => void;
  consultantName?: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  signatureImage,
  onSave,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB. Please choose a smaller image.');
      return;
    }

    setIsUploading(true);
    try {
      const cloudUrl = await uploadToCloudinary(file, { folder: 'thulir_signatures' });
      onSave(cloudUrl);
    } catch (err) {
      console.warn('Cloudinary upload fallback to local reader:', err);
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          onSave(ev.target.result as string);
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

  return (
    <div className="bg-slate-50 border-2 border-slate-300 rounded p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-teal-800" />
            Consultant Signature Image (File Upload)
          </h4>
          <p className="text-xs text-slate-700">
            Upload a scanned or saved signature image (PNG or JPG). If not uploaded, the document leaves clean space for manual pen signature.
          </p>
        </div>

        {signatureImage && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-400">
            <Check className="w-3.5 h-3.5" /> Signature Uploaded
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
          disabled={isUploading}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-800 hover:bg-teal-900 disabled:bg-teal-600 text-white text-xs sm:text-sm font-bold rounded border border-teal-900 transition-none shadow-sm"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Upload Signature File
            </>
          )}
        </button>

        {signatureImage && !isUploading && (
          <div className="flex items-center gap-3 p-2 bg-white rounded border-2 border-slate-300">
            <img
              src={signatureImage}
              alt="Signature Preview"
              className="h-12 max-w-[180px] object-contain border border-slate-200 rounded p-1"
            />
            <button
              type="button"
              onClick={() => onSave('')}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-red-700 hover:bg-red-50 rounded border border-red-300 text-xs font-bold transition-none"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
