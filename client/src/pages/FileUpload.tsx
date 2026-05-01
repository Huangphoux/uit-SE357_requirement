import React, { useState, useRef } from "react";
import { Upload, X } from "lucide-react";

interface FileUploadProps {
  onFileSelect?: (file: File) => void;
  onFilesSelect?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  disabled?: boolean;
}

export default function FileUpload({
  onFileSelect,
  onFilesSelect,
  accept = "*",
  multiple = false,
  maxSize,
  disabled = false,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (maxSize) {
      const validFiles = selectedFiles.filter((file) => file.size <= maxSize);
      setFiles(validFiles);
      if (validFiles.length > 0) {
        if (onFileSelect && validFiles.length === 1) {
          onFileSelect(validFiles[0]);
        }
        if (onFilesSelect) {
          onFilesSelect(validFiles);
        }
      }
    } else {
      setFiles(selectedFiles);
      if (onFileSelect && selectedFiles.length === 1) {
        onFileSelect(selectedFiles[0]);
      }
      if (onFilesSelect) {
        onFilesSelect(selectedFiles);
      }
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          disabled
            ? "border-gray-300 bg-gray-100"
            : "border-blue-300 bg-blue-50 hover:border-blue-500 hover:bg-blue-100"
        }`}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-blue-500" />
        <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
        <p className="text-xs text-gray-500">
          {accept !== "*" ? `Accepted formats: ${accept}` : "Any file format accepted"}
          {maxSize ? ` • Max size: ${maxSize / 1024 / 1024}MB` : ""}
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
      />

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-100 p-3 rounded">
              <span className="text-sm text-gray-700 truncate">{file.name}</span>
              <button
                onClick={() => removeFile(index)}
                className="text-gray-500 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
