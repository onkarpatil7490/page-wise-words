import { BookOpen, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { VocabularyList } from "@/components/VocabularyList";
import { VocabularyWord } from "@/types/vocabulary";

interface BookReaderSidebarProps {
  vocabularyWords: VocabularyWord[];
  onExportVocabulary: () => void;
  onRemoveWord: (word: string) => void;
  onShowContext: (word: string) => void;
}

export function BookReaderSidebar({ 
  vocabularyWords, 
  onExportVocabulary, 
  onRemoveWord,
  onShowContext 
}: BookReaderSidebarProps) {
  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-sidebar-primary" />
            <span className="font-semibold">Book Reader</span>
          </div>
          <ThemeToggle />
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel>Reading Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <div className="mt-6 flex-1">
          <VocabularyList
            words={vocabularyWords}
            onExport={onExportVocabulary}
            onRemoveWord={onRemoveWord}
            onShowContext={onShowContext}
          />
        </div>
      </SidebarContent>
    </Sidebar>
  );
}