import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Download, BookOpen, Trash2 } from "lucide-react";
import { VocabularyWord } from "@/types/vocabulary";

interface VocabularyListProps {
  words: VocabularyWord[];
  onExport: () => void;
  onRemoveWord: (word: string) => void;
  onShowContext: (word: string) => void;
}

export function VocabularyList({ 
  words, 
  onExport, 
  onRemoveWord,
  onShowContext 
}: VocabularyListProps) {
  const sortedWords = [...words].sort((a, b) => 
    new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
  );

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Vocabulary</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {words.length} words
          </Badge>
        </div>
        {words.length > 0 && (
          <Button
            onClick={onExport}
            size="sm"
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            Export to Excel
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full px-6 pb-6">
          {words.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No words yet</p>
              <p className="text-xs">Click on words in your PDF to add them</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedWords.map((vocabWord, index) => (
                <div key={`${vocabWord.word}-${index}`} className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm capitalize truncate">
                        {vocabWord.word}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                        {vocabWord.definition}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(vocabWord.dateAdded).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onShowContext(vocabWord.word)}
                        className="h-6 w-6 shrink-0"
                      >
                        <BookOpen className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveWord(vocabWord.word)}
                        className="h-6 w-6 shrink-0 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  {index < sortedWords.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}