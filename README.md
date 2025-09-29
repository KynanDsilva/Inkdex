# InkDex

[![Vercel Deploy](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://inkdex-studio.vercel.app)  
![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=white)  
![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite&logoColor=white)  
![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white)  
![Firebase](https://img.shields.io/badge/Backend-Firebase-FFCA28?logo=firebase&logoColor=black)  

A **cloud-based notes sharing platform** built for students.  
Upload, explore, and access study materials seamlessly.  

Live Demo: [inkdex-studio.vercel.app](https://inkdex-studio.vercel.app)

---

## Tech Stack
- **Frontend:** React + Vite  
- **Styling:** Tailwind CSS  
- **Backend & Auth:** Firebase (Auth, Firestore, Storage)  
- **Deployment:** Vercel  

---

## Current Features
- **Authentication** – Sign up, log in, and manage profile with Firebase Auth.  
- **Upload Notes** – Upload files with metadata (title, subject, semester, year).  
- **Dynamic Tags** – Create new subject/semester/year tags on the fly.  
- **Explore Notes** – Search by title, filter by subject/semester/year, and download.  
- **Your Notes** – View and manage notes uploaded in the current session.  
- **Profile Page** – See your username/email and log out securely.  
- **Responsive UI** – Minimal, modern design with smooth animations.  

---

## Roadmap
- Google / Microsoft login  
- Community features – ratings, upvotes, comments  
- OCR-powered search for handwritten notes  
- AI summaries for quick revision  
- Gamification – leaderboards, contributor badges  
- LMS integrations (Moodle, Canvas, Blackboard)  
- Cross-campus/global sharing  

---

## Getting Started
```bash
# 1. Clone the repository
git clone https://github.com/KynanDsilva/Inkdex/
cd Inkdex

# 2. Install dependencies
npm install

# 3. Configure Firebase
# Add your Firebase project credentials in src/firebase.js

#4. Manually install remaining dependencies
npm install @google/generative-ai
npm install pdfjs-dist

# 5. Start the development server
npm run dev
```
