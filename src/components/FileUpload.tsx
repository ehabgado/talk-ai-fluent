
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, File, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onContentExtracted: (content: string) => void;
}

const FileUpload = ({ onContentExtracted }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    const allowedTypes = [
      'text/plain',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/msword',
      'application/vnd.ms-powerpoint'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Unsupported File Type",
        description: "Please upload a PDF, Word document, PowerPoint, or text file.",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    setIsProcessing(true);

    // Simulate file processing - In production, this would extract actual content
    setTimeout(() => {
      const mockContent = `Sample extracted content from ${file.name}

This is a demonstration of how the app would extract content from your uploaded file. In the actual implementation, this would:

1. Extract text from PDF files using PDF parsing libraries
2. Extract content from Word documents using document APIs
3. Extract text from PowerPoint presentations
4. Process text files directly

The extracted content would then be analyzed by the Gemini Flash API to create an optimal presentation structure.

Key points that might be extracted:
- Introduction section with main topic
- Core content areas and supporting details
- Conclusion and call-to-action items
- Speaker notes and timing suggestions

This content would be automatically structured by AI to create the best possible presentation flow.`;

      onContentExtracted(mockContent);
      setIsProcessing(false);
      toast({
        title: "File Processed Successfully",
        description: `Content extracted from ${file.name}`,
      });
    }, 1500);
  };

  const removeFile = () => {
    setUploadedFile(null);
    onContentExtracted('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {!uploadedFile ? (
        <Card
          className={`border-2 border-dashed transition-all duration-200 cursor-pointer ${
            isDragging
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="p-8 text-center">
            <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-blue-600' : 'text-gray-400'}`} />
            <p className="text-lg font-medium text-gray-700 mb-2">
              {isDragging ? 'Drop your file here' : 'Upload your presentation'}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Drag and drop or click to browse
            </p>
            <p className="text-xs text-gray-400">
              Supports: PDF, Word, PowerPoint, Text files
            </p>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
              onChange={handleFileSelect}
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <File className="w-8 h-8 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">{uploadedFile.name}</p>
                  <p className="text-sm text-green-600">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isProcessing && (
                  <div className="text-sm text-green-600">Processing...</div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="text-green-600 hover:text-green-800"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileUpload;
