# JS Exam Platform — Interactive Online Assessment System

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-success?style=for-the-badge&logo=vercel)](https://examplatformclient.vercel.app)
[![Tech Stack](https://img.shields.io/badge/Stack-React_18_|_Monaco_|_Zustand_|_Tailwind-blue?style=for-the-badge)](https://github.com/Abhishek-Gharat/exam-platform-client)

A responsive web application for managing and taking technical assessments, multiple-choice questions, and live code-writing examinations.

---

## Key Features

- **Candidate Examination Interface**:
  - Timed examination countdown with automatic submission warnings.
  - Question palette navigation (Answered, Flagged, Unvisited states).
  - In-browser code editing powered by **Monaco Editor** (`@monaco-editor/react`) for programming tasks.
  - Markdown rendering for code snippets and formatted technical questions.
- **Admin Dashboard**:
  - Exam creation, editing, and publishing controls.
  - Question bank management with CSV bulk import.
  - Interactive performance analytics with **Recharts** (score distributions, completion rates).
- **Client Architecture**:
  - Centralized state management with **Zustand**.
  - Secure API integration with Axios interceptors managing JWT authentication.
  - Responsive UI styled with **Tailwind CSS** and Lucide React icons.

---

## Tech Stack

- **Framework**: React 18, Vite 5, React Router 6
- **State Management**: Zustand
- **Code Editor**: Monaco Editor (`@monaco-editor/react`)
- **Styling & UI**: Tailwind CSS, PostCSS, Lucide React, React Hot Toast
- **Data Visualization**: Recharts
- **HTTP Client**: Axios

---

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation & Run
```bash
# Clone the client repository
git clone https://github.com/Abhishek-Gharat/exam-platform-client.git
cd exam-platform-client

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Backend Repository
The Express + PostgreSQL API server powering this client is available at:
[https://github.com/Abhishek-Gharat/exam-platform-server](https://github.com/Abhishek-Gharat/exam-platform-server)

## Live Demo
Experience the live candidate flow deployed at:
[https://examplatformclient.vercel.app](https://examplatformclient.vercel.app)
