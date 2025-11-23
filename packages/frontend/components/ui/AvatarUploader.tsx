
import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Loader2, Camera } from 'lucide-react';

interface AvatarUploaderProps {
  currentAvatarUrl?: string;
  onSave: (newUrl: string) => void;
  onClose: () => void;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({ currentAvatarUrl, onSave, onClose }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB Limit for Base64
        alert("File size too large. Max 2MB.");
        return;
      }
      
      // Convert to Base64 for immediate persistence without Storage Buckets
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!previewUrl) return;
    setIsUploading(true);
    
    // Since we converted to Base64, we can pass the string directly
    // In a full production app with Storage, we would upload the Blob here.
    // For this "Final Product", Base64 ensures it works immediately in the text field.
    setTimeout(() => {
      onSave(previewUrl);
      setIsUploading(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <h3 className="font-bold text-slate-900 dark:text-slate-100">Update Profile Photo</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        <div className="p-8 flex flex-col items-center gap-6">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 dark:border-slate-700 relative bg-slate-100 dark:bg-slate-800">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-slate-400" />
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange}
            />
          </div>

          <div className="text-center">
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline"
            >
              Choose a file
            </button>
            <p className="text-xs text-slate-500 mt-1">JPG, GIF or PNG. Max 2MB.</p>
          </div>

          <div className="flex w-full gap-3 mt-2">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={handleSave}
              disabled={isUploading || !previewUrl}
              className="flex-1 py-2.5 rounded-lg bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Photo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
