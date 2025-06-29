import React, { useState, useRef } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // MB
  loading?: boolean;
  className?: string;
}

export default function FileUpload({ 
  onFileSelect, 
  accept = "image/*", 
  maxSize = 5,
  loading = false,
  className = ''
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setError('');
    
    // File type check
    if (!file.type.startsWith('image/')) {
      setError('Sadece resim dosyaları yükleyebilirsiniz.');
      return;
    }

    // File size check
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Dosya boyutu ${maxSize}MB'dan büyük olamaz.`);
      return;
    }

    onFileSelect(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer
                   ${dragActive 
                     ? 'border-indigo-400 bg-indigo-900/20' 
                     : 'border-indigo-900/50 hover:border-indigo-400 hover:bg-indigo-900/10'
                   }
                   ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!loading ? onButtonClick : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
          disabled={loading}
        />
        
        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <LoadingSpinner size="md" text="İşleniyor..." />
            <p className="text-sm text-gray-400">Dosyanız işleniyor, lütfen bekleyin...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="text-4xl">📸</div>
            <div>
              <p className="text-lg font-medium text-white mb-1">
                Fotoğrafınızı buraya sürükleyin veya tıklayın
              </p>
              <p className="text-sm text-gray-400">
                PNG, JPG dosyaları, maksimum {maxSize}MB
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
} 