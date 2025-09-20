import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2, Volume2, BookOpen } from "lucide-react";

export interface Definition {
  word: string;
  phonetic?: string;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
    }>;
  }>;
}

interface WordDefinitionProps {
  word: string;
  position: { x: number; y: number };
  onClose: () => void;
  onAddToVocabulary: (word: string, definition: string) => void;
  onShowContext: (word: string) => void;
}

export function WordDefinition({ 
  word, 
  position, 
  onClose, 
  onAddToVocabulary,
  onShowContext 
}: WordDefinitionProps) {
  const [definition, setDefinition] = useState<Definition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (word) {
      fetchDefinition();
    }
  }, [word]);

  const fetchDefinition = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`
      );
      
      if (!response.ok) {
        throw new Error("Definition not found");
      }
      
      const data = await response.json();
      setDefinition(data[0]);
    } catch (err) {
      setError("Definition not found");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToVocabulary = () => {
    if (definition && definition.meanings.length > 0) {
      const mainDefinition = definition.meanings[0].definitions[0].definition;
      onAddToVocabulary(word, mainDefinition);
    }
  };

  const speakWord = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div 
      className="fixed z-50 w-80 max-h-96"
      style={{ 
        left: Math.min(position.x, window.innerWidth - 320),
        top: Math.min(position.y, window.innerHeight - 400)
      }}
    >
      <Card className="bg-definition-background border-border shadow-lg backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold capitalize">
              {word}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 hover:bg-muted"
            >
              ×
            </Button>
          </div>
          {definition?.phonetic && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{definition.phonetic}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={speakWord}
                className="h-6 w-6"
              >
                <Volume2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          {loading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="ml-2 text-sm">Loading definition...</span>
            </div>
          )}
          
          {error && (
            <div className="text-sm text-destructive py-4">
              {error}
            </div>
          )}
          
          {definition && (
            <div className="space-y-3">
              {definition.meanings.slice(0, 2).map((meaning, idx) => (
                <div key={idx} className="space-y-2">
                  <Badge variant="secondary" className="text-xs">
                    {meaning.partOfSpeech}
                  </Badge>
                  <div className="space-y-1">
                    {meaning.definitions.slice(0, 2).map((def, defIdx) => (
                      <div key={defIdx} className="text-sm">
                        <p className="leading-relaxed">{def.definition}</p>
                        {def.example && (
                          <p className="text-muted-foreground italic text-xs mt-1">
                            "{def.example}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                  {idx < definition.meanings.length - 1 && <Separator />}
                </div>
              ))}
              
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={handleAddToVocabulary}
                  className="flex-1"
                >
                  Add to Vocabulary
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onShowContext(word)}
                  className="flex items-center gap-1"
                >
                  <BookOpen className="h-3 w-3" />
                  Context
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}