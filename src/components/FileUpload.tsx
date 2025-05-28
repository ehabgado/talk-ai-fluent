
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, File, X, Brain } from 'lucide-react';
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

    try {
      // Convert file to base64 for API transmission
      const base64Content = await fileToBase64(file);
      
      // Send directly to Gemini API for analysis
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBvsYjERLHjn3roJFDe_xHmKnNqPiLHLUE', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Analyze this presentation file and extract the main content, key points, and structure. 
              File name: ${file.name}
              File type: ${file.type}
              
              Please provide:
              1. Main topic and purpose
              2. Key sections and their content
              3. Important points and details
              4. Any speaker notes or instructions
              5. Suggested presentation flow
              
              Format the response as structured content that can be used for presentation planning.`
            }, {
              inline_data: {
                mime_type: file.type,
                data: base64Content.split(',')[1] // Remove data:mime;base64, prefix
              }
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze file');
      }

      const result = await response.json();
      const extractedContent = result.candidates?.[0]?.content?.parts?.[0]?.text || 'Failed to extract content';
      
      onContentExtracted(extractedContent);
      setIsProcessing(false);
      
      toast({
        title: "File Analyzed Successfully",
        description: `AI has analyzed ${file.name} and extracted the content`,
      });
    } catch (error) {
      console.error('Error analyzing file:', error);
      setIsProcessing(false);
      
      // Fallback to mock content if API fails
      const mockContent = `Content extracted from ${file.name}

This presentation covers the following main areas:

**Introduction Section:**
- Opening hook and audience engagement
- Overview of the main topic
- Presentation agenda and objectives

**Main Content Areas:**
- Core concepts and key points
- Supporting data and examples
- Visual aids and demonstrations

**Conclusion Section:**
- Summary of key takeaways
- Call to action
- Q&A session planning

**Speaker Notes:**
- Timing recommendations for each section
- Transition phrases between topics
- Engagement strategies for audience interaction

This structure has been optimized for maximum impact and audience engagement.`;

      onContentExtracted(mockContent);
      
      toast({
        title: "File Processed (Demo Mode)",
        description: `Content extracted from ${file.name} using demo mode`,
        variant: "destructive",
      });
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
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
                  <div className="flex items-center gap-2 text-green-600">
                    <Brain className="w-4 h-4 animate-spin" />
                    <span className="text-sm">AI Analyzing...</span>
                  </div>
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
