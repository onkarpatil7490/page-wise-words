import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

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
}

export function WordDefinition({
  word,
  fullText,
  position,
  onClose,
  onAddToVocabulary
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

      const response = await fetch("http://127.0.0.1:8000/api/analyze-word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  const cardWidth = 520; // wider for better visibility
  const cardMaxHeight = 380; // max height, scroll if needed
  const left = Math.min(position.x, window.innerWidth - cardWidth - 20);
  const top = Math.min(position.y, window.innerHeight - cardMaxHeight - 20);

  return (
    <div
      className="fixed z-50"
      style={{ left, top, width: cardWidth, maxHeight: cardMaxHeight, overflowY: "auto" }}
    >
      <Card className="bg-background border border-border rounded-xl text-sm">
        <CardHeader className="pb-3 border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold capitalize text-foreground">
              {word}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 hover:bg-muted rounded"
            >
              ×
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 p-4">
          {loading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="ml-2 text-sm text-foreground">Loading analysis...</span>
            </div>
          )}

          {error && (
            <div className="text-sm text-destructive py-2">{error}</div>
          )}

          {result && (
            <>
              <div className="space-y-1">
                <Badge variant="secondary" className="text-xs">Meaning</Badge>
                <p className="text-sm leading-relaxed text-foreground">{result.meaning}</p>
              </div>

              <div className="space-y-1">
                <Badge variant="secondary" className="text-xs">Context</Badge>
                <p className="text-sm leading-relaxed text-foreground">{result.context}</p>
              </div>

              <div className="pt-2">
                <Button
                  size="sm"
                  onClick={handleAddToVocabulary}
                  className="w-full"
                >
                  Add to Vocabulary
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
