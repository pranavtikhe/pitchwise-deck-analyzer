import { useState, useRef, DragEvent, ChangeEvent, forwardRef } from "react";
import { Upload, FilePlus, AlertCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  isLoading?: boolean;
}

const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(({ onFileSelected, isLoading }, ref) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const validateFile = (file: File): boolean => {
    // Check if the file is a PDF
    if (!file.type.includes('pdf')) {
      setError("Please upload a PDF file.");
      toast.error("Please upload a PDF file.");
      return false;
    }

    // Check file size (limit to 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      setError("File size must be less than 10MB.");
      toast.error("File size must be less than 10MB.");
      return false;
    }

    setError(null);
    return true;
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length) {
      const file = files[0];
      if (validateFile(file)) {
        onFileSelected(file);
        setFile(file);
      }
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      const file = files[0];
      if (validateFile(file)) {
        onFileSelected(file);
        setFile(file);
      }
    }
  };

  return (
    <div
      className={`relative rounded-lg p-8 transition-colors
        ${isDragging ? 'bg-primary/5' : ''}
        ${error ? 'border-red-500/50' : ''}
      `}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={ref}
        onChange={handleFileInput}
        accept=".pdf"
        className="hidden"
      />

      <div className="flex flex-col items-center justify-center space-y-4">
        <img src="/images/upload.svg" alt="Upload" className="h-16 w-16" />

        <div className="space-y-2">
          {file ? (
            <div className="text-white flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <span>{file.name}</span>
            </div>
          ) : (
            <>
              Drag & drop your file here, or{" "}
              <span className="text-primary cursor-pointer">Choose File..</span>
            </>
          )}
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
});

FileUpload.displayName = "FileUpload";

export default FileUpload;
