# Personal Book Reader Web App

A clean, minimalist PDF reader with built-in vocabulary learning features. Perfect for language learners and avid readers who want to expand their vocabulary while reading.

---

## 📸 Screenshots

<!-- Add your screenshots here -->
- ![Screenshot 1](path/to/screenshot1.png)
- ![Screenshot 2](path/to/screenshot2.png)
- ![Screenshot 3](path/to/screenshot3.png)

---

## Features

### 📖 PDF Reading
- Upload and view PDF files with a clean, distraction-free interface
- Navigate pages easily and zoom/rotate the PDF
- Responsive design for desktop and mobile

### 🌙 Day/Night Mode
- Toggle between light and dark reading modes
- Smooth theme transitions optimized for long reading sessions

### 📚 Vocabulary Learning
- **Click any word** to instantly see its meaning and AI-powered context
- **Automatic vocabulary tracking** - saves words you look up
- **Export to Excel** - download your vocabulary list for further study

### 🎯 Smart Features
- **Local storage** - your vocabulary is saved in your browser
- **Word deduplication** - prevents duplicate entries
- **Minimalistic design** - focused on reading without distractions

---

## How to Use

1. **Upload a PDF**: Drag and drop or click to select a PDF file
2. **Start reading**: Navigate pages with the controls
3. **Learn new words**: Click any word to see its meaning and context
4. **Track vocabulary**: Words you click are automatically saved in your sidebar
5. **Export**: Download your vocabulary as an Excel file anytime

---

## API Setup (Optional)

### For Context Analysis
The AI-powered context feature uses the **Gemini API**. This is optional; dictionary meanings work without it.

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an account and generate an API key
3. Enter the API key in the app when prompted

> **Note:** Only context analysis uses the internet. All PDFs and vocabulary data are processed locally.

---

## Technology Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling with a custom design system
- **react-pdf** for PDF rendering
- **Radix UI** components for accessibility
- **Local storage** for vocabulary persistence
- **XLSX** for Excel export functionality

---

## Development

This project is built with Vite and can be run locally:

```bash
npm install
npm run dev
