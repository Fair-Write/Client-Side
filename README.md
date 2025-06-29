# FairWrite (Client-Side)

FairWrite a modern web-based text editor that supports grammar correction and gender-fair language rewriting. The client side built with **SvelteKit** and a carefully curated frontend tech stack, FairWrite offers a clean, responsive, and intuitive editing experience.

---

## ✨ Features

- **Grammar Suggestions** – Instantly see grammar feedback from the backend as you type.
- **Gender-Fair Language Corrections** – View and apply inclusive alternatives for biased terms.
- **PDF Parsing and Annotation** – Upload PDFs and extract editable content using OCR and PDF.js.
- **ProseMirror-Based Editor** – A rich text editor with structured formatting and plugin support.
- **Custom preferred pronouns** -system can apply respectful and inclusive language tailored to you.
- **Admin Dashboard** – UI for managing gender term rules.

---

## 🛠️ Tech Stack

| Technology       | Purpose                                        |
| ---------------- | ---------------------------------------------- |
| **SvelteKit**    | Application framework and routing              |
| **Tailwind CSS** | Utility-first styling for responsive UI        |
| **TypeScript**   | Type safety and DX improvements                |
| **Zod**          | Schema validation for forms and frontend logic |
| **ProseMirror**  | WYSIWYG editor with custom plugin extensions   |
| **Chad Svelte**  | Prebuilt Svelte UI components                  |
| **PDF.js**       | PDF rendering and manipulation                 |
| **Tesseract.js** | OCR for scanned documents or image-based PDFs  |
| **Quasar JS**    | Additional UI component usage                  |
| **Elephant.js**  | Feedback animations and micro-interactions     |

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/fairwrite-client.git
cd fairwrite-client
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Run the Development Server

```bash
npm run dev
```

---

## 🌐 API Integration

This client connects to the FairWrite Backend via REST API for grammar and gender-fair language processing.

You can configure the backend base URL using a `.env` file.

**Example `.env` file:**

```env
VITE_API_BASE_URL=http://localhost:80
ADMIN_PASSWORD=ILOVEGFL
```

---

## Backend Repository

- [FairWrite/Server-Side](https://github.com/Fair-Write/Server-Side.git): The official backend for FairWrite, providing data via REST API for grammar and gender-fair language processing.
