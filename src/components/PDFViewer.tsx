// Filename: PDFViewer.tsx

import { useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PDFViewerProps {
  file: File | null;
  onWordClick: (word: string, fullText: string, event: React.MouseEvent) => void;
}

export function PDFViewer({ file, onWordClick }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (err: any) => {
    setError("Failed to load PDF file. Please try again.");
    setLoading(false);
    console.error(err);
  };

  const handleTextClick = (event: React.MouseEvent) => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      const selectedWord = selection.toString().trim();
      const range = selection.getRangeAt(0);

      const surroundingText = range.startContainer.parentElement?.textContent || '';

      onWordClick(selectedWord, surroundingText, event);
    }
  };

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  };

  const prevPage = () => {
    changePage(-1);
  };

  const nextPage = () => {
    changePage(1);
  };

  const zoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.1, 2.0));
  };

  const zoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.1, 0.5));
  };

  const rotate = () => {
    setRotation(prevRotation => (prevRotation + 90) % 360);
  };

  return (
    <div className="h-full w-full flex flex-col items-center">
      <div className="flex flex-col items-center flex-1 w-full">
        <div className="flex items-center justify-between p-2 w-full max-w-4xl sticky top-0 bg-background z-10 border-b border-border">
          <div className="flex items-center gap-2">
            <Button onClick={prevPage} disabled={pageNumber <= 1} size="sm">
              Prev
            </Button>
            <Badge variant="secondary">
              Page {pageNumber} of {numPages || '--'}
            </Badge>
            <Button onClick={nextPage} disabled={pageNumber >= numPages} size="sm">
              Next
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={zoomOut} size="icon" variant="outline">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button onClick={zoomIn} size="icon" variant="outline">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button onClick={rotate} size="icon" variant="outline">
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 w-full p-4">
          <div className="flex justify-center items-start pt-4 pb-20">
            {loading && (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-6 w-6 animate-spin" />
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