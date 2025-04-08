# Accessibility Checker

A web-based tool for checking accessibility issues in raw HTML code. Powered by [axe-core](https://github.com/dequelabs/axe-core) and integrated with CodeMirror editor for real-time highlighting and navigation.

## ✨ Features

- Paste your HTML snippet and detect accessibility issues instantly.
- Uses axe-core for WCAG-compliant accessibility analysis.
- Highlights issues directly in the CodeMirror editor.
- Issues are categorized by severity (critical, serious, moderate, minor).
- Clickable issue list — auto-scrolls to problematic HTML tag.
- Built-in dark/light mode toggle.
- Sticky "Check Accessibility" button and responsive layout.

## 🛠️ Tech Stack

- React + TypeScript
- Vite
- CodeMirror 6
- axe-core
- styled-components

## 🚀 How to Run

### Locally

```bash
git clone https://github.com/WioletaKolodziej/accessibility-checker.git
cd accessibility-checker
npm install
npm run dev
```

### Live Demo (Vercel)

🔗 [https://accessibility-web-checker.vercel.app/](https://accessibility-web-checker.vercel.app/)

---

This project was built for learning and portfolio purposes. Feedback and contributions are welcome!
