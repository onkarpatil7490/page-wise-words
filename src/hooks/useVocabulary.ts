import { useState, useEffect } from "react";
import { VocabularyWord } from "@/types/vocabulary";
import * as XLSX from "xlsx";

const STORAGE_KEY = "book-reader-vocabulary";

export function useVocabulary() {
  const [vocabularyWords, setVocabularyWords] = useState<VocabularyWord[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setVocabularyWords(JSON.parse(stored));
      } catch (error) {
        console.error("Error loading vocabulary from localStorage:", error);
      }
    }
  }, []);

  const saveToStorage = (words: VocabularyWord[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
  };

  const addWord = (word: string, definition: string) => {
    const existingWordIndex = vocabularyWords.findIndex(
      (w) => w.word.toLowerCase() === word.toLowerCase()
    );

    if (existingWordIndex === -1) {
      const newWord: VocabularyWord = {
        word: word.toLowerCase(),
        definition,
        dateAdded: new Date().toISOString(),
      };
      const updatedWords = [...vocabularyWords, newWord];
      setVocabularyWords(updatedWords);
      saveToStorage(updatedWords);
      return true; // Word was added
    }
    return false; // Word already exists
  };

  const removeWord = (word: string) => {
    const updatedWords = vocabularyWords.filter(
      (w) => w.word.toLowerCase() !== word.toLowerCase()
    );
    setVocabularyWords(updatedWords);
    saveToStorage(updatedWords);
  };

  const exportToExcel = () => {
    if (vocabularyWords.length === 0) return;

    const exportData = vocabularyWords.map((word) => ({
      Word: word.word,
      Definition: word.definition,
      "Date Added": new Date(word.dateAdded).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vocabulary");

    // Auto-size columns
    const colWidths = [
      { wch: 15 }, // Word
      { wch: 50 }, // Definition
      { wch: 12 }, // Date Added
    ];
    worksheet["!cols"] = colWidths;

    const fileName = `vocabulary-${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return {
    vocabularyWords,
    addWord,
    removeWord,
    exportToExcel,
  };
}