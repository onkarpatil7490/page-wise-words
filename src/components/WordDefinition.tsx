import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, BookOpen } from "lucide-react";

export interface AnalysisResult {
  meaning: string;
  context: string;
}

interface WordDefinitionProps {
  word: string;
  fullText: string;
  position: { x: number; y: number };
  onClose: () => void;
  onAddToVocabulary: (word: string, definition: string) => void;
  onShowContext: (word: string, context: string) => void;
}

export function WordDefinition({
  word,
  fullText,
  position,
  onClose,
  onAddToVocabulary,
  onShowContext
}: WordDefinitionProps) {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (word && fullText) {
      fetchAnalysis();
    }
  }, [word, fullText]);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);

      const payload = { word, text: fullText };
      console.log('Sending payload to API:', payload);

      const response = await fetch("http://127.0.0.1:8000/api/analyze-word", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Unknown error" }));
        throw new Error(errorData.detail || "Analysis not found");
      }

      const data = await response.json();
      setResult(data.result);
    } catch (err: any) {
      setError(`Failed to get word analysis: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToVocabulary = () => {
    if (result) {
      onAddToVocabulary(word, result.meaning);
    }
  };

  return (
    <div
      className="fixed z-50 w-80 max-h-96"
      style={{
        left: Math.min(position.x, window.innerWidth - 320),
        top: Math.min(position.y, window.innerHeight - 400),
      }}
    >
      <Card className="bg-definition-background border-border shadow-lg backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold capitalize">{word}</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0 hover:bg-muted">×</Button>
          </div>
        </CardHeader>

        <CardContent>
          {loading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="ml-2 text-sm">Loading analysis...</span>
            </div>
          )}

          {error && <div className="text-sm text-destructive py-4">{error}</div>}

          {result && (
            <div className="space-y-3">
              <div className="space-y-1">
                <Badge variant="secondary" className="text-xs">Word</Badge>
                <p>{word}</p>

                <Badge variant="secondary" className="text-xs">Sent Text</Badge>
                <p>{fullText}</p>

                <Badge variant="secondary" className="text-xs">Meaning</Badge>
                <p>{result.meaning}</p>

                <Badge variant="secondary" className="text-xs">Context</Badge>
                <p>{result.context}</p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" onClick={handleAddToVocabulary} className="flex-1">Add to Vocabulary</Button>
                <Button size="sm" variant="outline" onClick={() => onShowContext(word, result.context)} className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" /> Context
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
