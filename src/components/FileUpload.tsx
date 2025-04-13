
import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Upload, FilePlus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  isLoading: boolean;
}

const FileUpload = ({ onFileSelected, isLoading }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const validateFile = (file: File): boolean => {
    // Check if the file is a PDF
    if (file.type !== "application/pdf") {
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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onFileSelected(file);
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onFileSelected(file);
      }
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
          isDragging ? "pdf-drop-active" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf"
          className="hidden"
          disabled={isLoading}
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          {isLoading ? (
            <div className="animate-spin">
              <Upload className="h-16 w-16 text-purple opacity-50" />
            </div>
          ) : (
            <div className="bg-purple/10 p-4 rounded-full">
              <FilePlus className="h-16 w-16 text-purple" />
            </div>
          )}
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">
              {isLoading ? "Analyzing your pitch deck..." : "Upload your pitch deck"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              {isLoading
                ? "Please wait while we extract and analyze the key insights from your deck."
                : "Drag and drop a PDF file here, or click to browse"}
            </p>
          </div>

          {error && (
            <div className="flex items-center text-destructive text-sm gap-1 mt-2">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {!isLoading && (
            <Button onClick={handleButtonClick} className="mt-4" variant="outline">
              <Upload className="mr-2 h-4 w-4" /> Select PDF File
            </Button>
          )}
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-center mt-2">
        Supported format: PDF only (max 10MB)
      </p>
    </div>
  );
};

export default FileUpload;
