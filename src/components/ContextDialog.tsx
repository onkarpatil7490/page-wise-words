import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Brain, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ContextDialogProps {
  word: string;
  isOpen: boolean;
  onClose: () => void;
  apiKey?: string;
  onApiKeyChange?: (key: string) => void;
}

export function ContextDialog({ 
  word, 
  isOpen, 
  onClose,
  apiKey,
  onApiKeyChange 
}: ContextDialogProps) {
  const [context, setContext] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tempApiKey, setTempApiKey] = useState("");

  const analyzeContext = async () => {
    const keyToUse = apiKey || tempApiKey;
    
    if (!keyToUse) {
      setError("Please provide your Gemini API key");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${keyToUse}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Provide a detailed explanation of the word "${word}" including:
1. Its etymology and origin
2. Different meanings and contexts where it's used
3. Common synonyms and antonyms
4. Example sentences showing different usage contexts
5. Any interesting facts or nuances about the word

Please format your response in a clear, educational manner suitable for vocabulary learning.`
              }]
            }]
          })
        }
      );

      if (!response.ok) {
        throw new Error("Failed to analyze context");
      }

      const data = await response.json();
      const generatedContext = data.candidates?.[0]?.content?.parts?.[0]?.text || "No context available";
      setContext(generatedContext);
      
    } catch (err) {
      setError("Failed to analyze word context. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setContext("");
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Context Analysis for "{word}"
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 space-y-4 overflow-hidden">
          {!apiKey && (
            <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-3 flex-1">
                    <div>
                      <h4 className="font-medium text-amber-800 dark:text-amber-200">
                        Gemini API Key Required
                      </h4>
                      <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                        To use context analysis, please enter your Gemini API key below:
                      </p>
                    </div>
                    <Textarea
                      placeholder="Enter your Gemini API key..."
                      value={tempApiKey}
                      onChange={(e) => setTempApiKey(e.target.value)}
                      className="bg-background"
                      rows={2}
                    />
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      Get your free API key from{" "}
                      <a 
                        href="https://makersuite.google.com/app/apikey" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="underline hover:no-underline"
                      >
                        Google AI Studio
                      </a>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between items-center">
            <Badge variant="secondary" className="capitalize">
              {word}
            </Badge>
            <Button
              onClick={analyzeContext}
              disabled={loading || (!apiKey && !tempApiKey)}
              size="sm"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Context"
              )}
            </Button>
          </div>

          {error && (
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="p-4">
                <p className="text-sm text-destructive">{error}</p>
              </CardContent>
            </Card>
          )}

          {context && (
            <Card className="flex-1 overflow-hidden">
              <CardContent className="p-0 h-full">
                <div className="h-full overflow-y-auto p-4 reading-scroll">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {context}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}