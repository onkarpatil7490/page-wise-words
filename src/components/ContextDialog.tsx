// Filename: ContextDialog.tsx

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Brain } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ContextDialogProps {
  word: string;
  isOpen: boolean;
  onClose: () => void;
  context: string;
}

export function ContextDialog({
  word,
  isOpen,
  onClose,
  context
}: ContextDialogProps) {
  const handleClose = () => {
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
          <div className="flex justify-between items-center">
            <Badge variant="secondary" className="capitalize">
              {word}
            </Badge>
          </div>

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