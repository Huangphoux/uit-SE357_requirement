import React, { useState, useRef } from 'react';
import { Upload, X, File, CheckCircle, Loader2 } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

interface FileUploadProps {
  onFilesSelected?: (files: File[]) => void;
  onUploadComplete?: (files: UploadedFile[]) => void;
  accept?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
  disabled?: boolean;
}

export default function FileUpload({
  onFilesSelected,
  onUploadComplete,
  accept = '*',
  maxSize = 10,
  multiple = true,
  disabled = false
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    // Filter files by size
    const validFiles = files.filter(file => {
      const sizeInMB = file.size / (1024 * 1024);
      return sizeInMB <= maxSize;
    });

    const invalidFiles = files.filter(file => {
      const sizeInMB = file.size / (1024 * 1024);
      return sizeInMB > maxSize;
    });

    // Show error for invalid files
    if (invalidFiles.length > 0) {
      console.error(`${invalidFiles.length} file(s) exceed ${maxSize}MB limit`);
    }

    if (validFiles.length === 0) return;

    onFilesSelected?.(validFiles);

    // Simulate upload for each file
    const newFiles: UploadedFile[] = validFiles.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'uploading'
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach((uploadFile, index) => {
      simulateUpload(uploadFile.id, validFiles[index]);
    });
  };

  const simulateUpload = (fileId: string, file: File) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { ...f, progress: Math.min(progress, 100) }
            : f
        )
      );

      if (progress >= 100) {
        clearInterval(interval);
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileId 
              ? { ...f, status: 'completed', progress: 100 }
              : f
          )
        );
        
        // Call completion callback
        const completedFiles = uploadedFiles.filter(f => f.status === 'completed');
        onUploadComplete?.(completedFiles);
      }
    }, 200);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div>
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer
          ${isDragging 
            ? 'border-[#0056b3] bg-[#e9f2ff] dark:bg-[#0056b3]/10' 
            : 'border-border hover:border-[#0056b3] hover:bg-muted/50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <Upload className={`w-12 h-12 mx-auto mb-4 transition-colors ${
          isDragging ? 'text-[#0056b3]' : 'text-muted-foreground'
        }`} />
        
        <p className="mb-2">
          {isDragging ? (
            <span className="text-[#0056b3]">Drop files here</span>
          ) : (
            <>
              <span className="text-[#0056b3] hover:underline">Click to upload</span>
              {' '}or drag and drop
            </>
          )}
        </p>
        
        <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
          {accept === '*' ? 'Any file type' : accept} • Max {maxSize}MB
          {multiple && ' • Multiple files allowed'}
        </p>

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileInput}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="hidden"
        />
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="bg-card border border-border rounded-lg p-4 animate-fade-in-up"
            >
              <div className="flex items-center gap-3">
                <File className="w-5 h-5 text-[#0056b3] flex-shrink-0" />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="truncate" style={{ fontSize: '0.875rem' }}>
                      {file.name}
                    </p>
                    <span className="text-muted-foreground ml-2" style={{ fontSize: '0.75rem' }}>
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-[#0056b3] transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                </div>

                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {file.status === 'uploading' && (
                    <Loader2 className="w-5 h-5 text-[#0056b3] animate-spin" />
                  )}
                  {file.status === 'completed' && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  {file.status === 'error' && (
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-1 hover:bg-muted rounded transition-colors"
                    >
                      <X className="w-4 h-4 text-destructive" />
                    </button>
                  )}
                </div>

                {file.status === 'completed' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file.id);
                    }}
                    className="p-1 hover:bg-muted rounded transition-colors flex-shrink-0"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}