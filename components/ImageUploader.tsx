
import React, { useState, useRef, useCallback } from 'react';

interface ImageUploaderProps {
  id: string;
  label: string;
  onFileChange: (file: File | null) => void;
}

const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
);


export const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, onFileChange }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
    onFileChange(file);
  }, [onFileChange]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const file = event.dataTransfer.files?.[0] || null;
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        onFileChange(file);
        if (fileInputRef.current) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInputRef.current.files = dataTransfer.files;
        }
      } else {
        alert('Please drop an image file.');
      }
  }, [onFileChange]);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <label
        htmlFor={id}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="cursor-pointer group flex justify-center items-center w-full h-48 border-2 border-dashed border-gray-600 rounded-lg hover:border-indigo-500 transition-colors bg-gray-900/50"
      >
        {preview ? (
          <img src={preview} alt={label + " preview"} className="h-full w-full object-contain rounded-lg p-2" />
        ) : (
          <div className="text-center">
            <UploadIcon className="mx-auto h-12 w-12 text-gray-500 group-hover:text-indigo-400" />
            <p className="mt-2 text-sm text-gray-400">
              <span className="font-semibold text-indigo-400">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        )}
      </label>
      <input
        type="file"
        id={id}
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
};
