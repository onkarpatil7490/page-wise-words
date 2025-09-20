# Personal Book Reader Web App

A beautiful, minimalist PDF reader with vocabulary learning features. Perfect for language learners and avid readers who want to expand their vocabulary while reading.

## Features

### 📖 PDF Reading
- Upload and view PDF files with a clean, distraction-free interface
- Zoom, rotate, and navigate pages easily
- Responsive design that works on desktop and mobile

### 🌙 Day/Night Mode
- Toggle between comfortable light and dark reading modes
- Warm, paper-like colors optimized for long reading sessions
- Smooth theme transitions

### 📚 Vocabulary Learning
- **Click any word** to see instant definitions from a free dictionary API
- **AI-powered context analysis** using Gemini API (requires your own API key)
- **Smart vocabulary tracking** - automatically saves words you look up
- **Export to Excel** - download your vocabulary list for further study

### 🎯 Smart Features
- **Local storage** - your vocabulary is saved in your browser
- **Pronunciation** - hear how words are pronounced
- **Word deduplication** - won't add the same word twice
- **Clean, academic design** - focused on reading without distractions

## How to Use

1. **Upload a PDF**: Drag and drop or click to select a PDF file
2. **Start reading**: Navigate through pages using the controls
3. **Learn new words**: Click on any word to see its definition
4. **Get context**: Use the "Context" button for AI-powered explanations (requires Gemini API key)
5. **Track progress**: Your vocabulary list grows automatically in the sidebar
6. **Export**: Download your vocabulary as an Excel file anytime

## API Setup

### For Context Analysis (Optional)
To use AI-powered context analysis, you'll need a free Gemini API key:

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a free account and generate an API key
3. Enter your API key when prompted in the app

The basic dictionary features work without any API key!

## Technology Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling with custom design system
- **react-pdf** for PDF rendering
- **Radix UI** components for accessibility
- **Local storage** for vocabulary persistence
- **XLSX** for Excel export functionality

## Development

This project is built with Vite and can be run locally:

```bash
npm install
npm run dev
```

## Privacy

- All vocabulary data is stored locally in your browser
- PDF files are processed entirely on your device
- Only context analysis requires internet connection (when using Gemini API)
- No data is sent to external servers except for dictionary lookups and optional AI context

---

Happy reading and learning! 📚✨