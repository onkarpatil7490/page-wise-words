import { useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Import CSS for react-pdf
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up PDF.js worker - serve from local public directory
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PDFViewerProps {
  file: File | null;
  onWordClick: (word: string, event: React.MouseEvent) => void;
}

export function PDFViewer({ file, onWordClick }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  }

  function onDocumentLoadError(error: Error) {
    setError("Failed to load PDF. Please try another file.");
    setLoading(false);
    console.error("PDF load error:", error);
  }

  const handleTextClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    
    // Check if clicked element is part of text layer
    if (target.classList.contains('textLayer') || target.closest('.textLayer')) {
      const selection = window.getSelection();
      let wordToDefine = '';
      
      // Try to get selected text first
      if (selection && selection.toString().trim()) {
        const selectedText = selection.toString().trim();
        const words = selectedText.split(/\s+/);
        
        if (words.length === 1 && words[0].length > 1) {
          wordToDefine = words[0];
        }
      } else if (target.textContent) {
        // If no selection, try to get word from clicked element
        wordToDefine = target.textContent.trim();
      }
      
      if (wordToDefine) {
        const cleanWord = wordToDefine.replace(/[^\w]/g, '');
        if (cleanWord && cleanWord.length > 1) {
          onWordClick(cleanWord, event);
        }
      }
    }
  };

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset;
      return Math.min(Math.max(1, newPageNumber), numPages);
    });
  };

  const changeScale = (delta: number) => {
    setScale(prevScale => {
      const newScale = prevScale + delta;
      return Math.min(Math.max(0.5, newScale), 2.0);
    });
  };

  if (!file) {
    return (
      <Card className="h-full flex items-center justify-center bg-reader-background">
        <div className="text-center space-y-4">
          <FileText className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
          <div>
            <h3 className="text-lg font-medium">No PDF loaded</h3>
            <p className="text-sm text-muted-foreground">
              Upload a PDF file to start reading
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* PDF Controls */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Page {pageNumber} of {numPages}
          </Badge>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => changePage(-1)}
              disabled={pageNumber <= 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => changePage(1)}
              disabled={pageNumber >= numPages}
            >
              Next
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => changeScale(-0.1)}
            disabled={scale <= 0.5}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Badge variant="outline" className="text-xs min-w-12 justify-center">
            {Math.round(scale * 100)}%
          </Badge>
          <Button
            variant="outline"
            size="icon"
            onClick={() => changeScale(0.1)}
            disabled={scale >= 2.0}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setRotation(prev => (prev + 90) % 360)}
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF Document */}
      <div className="flex-1 bg-reader-background">
        <ScrollArea className="h-full reading-scroll">
          <div className="flex justify-center p-6">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Loading PDF...</span>
              </div>
            )}
            
            {error && (
              <Card className="p-6 max-w-md">
                <div className="text-center space-y-2">
                  <p className="text-destructive font-medium">Error loading PDF</p>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>
              </Card>
            )}
            
            {file && !error && (
              <div className="pdf-container">
                <Document
                  file={file}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading={null}
                  className="shadow-lg"
                >
                  <div
                    className="pdf-page-container"
                    onClick={handleTextClick}
                    onMouseUp={handleTextClick}
                    ref={textLayerRef}
                  >
                    <Page
                      pageNumber={pageNumber}
                      scale={scale}
                      rotate={rotation}
                      className="border border-border rounded-lg bg-white"
                      renderTextLayer={true}
                      renderAnnotationLayer={false}
                    />
                  </div>
                </Document>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}