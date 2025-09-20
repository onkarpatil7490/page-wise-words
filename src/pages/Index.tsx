import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { BookReaderSidebar } from "@/components/BookReaderSidebar";
import { FileUpload } from "@/components/FileUpload";
import { PDFViewer } from "@/components/PDFViewer";
import { WordDefinition } from "@/components/WordDefinition";
import { ContextDialog } from "@/components/ContextDialog";
import { useVocabulary } from "@/hooks/useVocabulary";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedWord, setSelectedWord] = useState<string>("");
  const [wordPosition, setWordPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showDefinition, setShowDefinition] = useState(false);
  const [showContext, setShowContext] = useState(false);
  const [contextWord, setContextWord] = useState("");
  const [geminiApiKey, setGeminiApiKey] = useState("");

  const { vocabularyWords, addWord, removeWord, exportToExcel } = useVocabulary();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    toast({
      title: "PDF loaded",
      description: `Successfully loaded ${file.name}`,
    });
  };

  const handleWordClick = (word: string, event: React.MouseEvent) => {
    setSelectedWord(word);
    setWordPosition({ x: event.clientX, y: event.clientY });
    setShowDefinition(true);
  };

  const handleAddToVocabulary = (word: string, definition: string) => {
    const added = addWord(word, definition);
    if (added) {
      toast({
        title: "Word added",
        description: `"${word}" has been added to your vocabulary`,
      });
    } else {
      toast({
        title: "Word already exists",
        description: `"${word}" is already in your vocabulary`,
        variant: "destructive",
      });
    }
    setShowDefinition(false);
  };

  const handleShowContext = (word: string) => {
    setContextWord(word);
    setShowContext(true);
    setShowDefinition(false);
  };

  const handleRemoveWord = (word: string) => {
    removeWord(word);
    toast({
      title: "Word removed",
      description: `"${word}" has been removed from your vocabulary`,
    });
  };

  const handleExportVocabulary = () => {
    exportToExcel();
    toast({
      title: "Export complete",
      description: "Your vocabulary has been exported to Excel",
    });
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background">
        <BookReaderSidebar
          vocabularyWords={vocabularyWords}
          onExportVocabulary={handleExportVocabulary}
          onRemoveWord={handleRemoveWord}
          onShowContext={handleShowContext}
        />
        
        <main className="flex-1 flex flex-col">
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
            <div className="flex h-14 items-center px-4 gap-3">
              <SidebarTrigger />
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold">
                  {selectedFile ? selectedFile.name : "Personal Book Reader"}
                </h1>
              </div>
            </div>
          </header>
          
          <div className="flex-1 p-4">
            {selectedFile ? (
              <PDFViewer file={selectedFile} onWordClick={handleWordClick} />
            ) : (
              <FileUpload onFileSelect={handleFileSelect} />
            )}
          </div>
        </main>

        {showDefinition && (
          <WordDefinition
            word={selectedWord}
            position={wordPosition}
            onClose={() => setShowDefinition(false)}
            onAddToVocabulary={handleAddToVocabulary}
            onShowContext={handleShowContext}
          />
        )}

        <ContextDialog
          word={contextWord}
          isOpen={showContext}
          onClose={() => setShowContext(false)}
          apiKey={geminiApiKey}
          onApiKeyChange={setGeminiApiKey}
        />
      </div>
    </SidebarProvider>
  );
};

export default Index;