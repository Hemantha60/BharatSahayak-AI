# 🇮🇳 BharatSahayak AI

### Intelligence in Your Language

🌐 **Live Demo:** https://bharatsahayak-ai-1.onrender.com
BharatSahayak AI is a multilingual AI assistant designed to make useful information and digital guidance more accessible to people across India.

It allows users to ask questions naturally in English, Hindi, and Kannada and receive AI-generated responses in their preferred language.

## ✨ Features

- 🌐 Multilingual AI assistance
- 🇮🇳 English, Hindi and Kannada support
- 💬 Natural text conversation
- 🎤 Voice input
- 🔊 Voice response
- 🔎 Trusted-source references
- 🧠 Context-aware follow-up questions
- 📚 Conversation history
- 🔐 Login, Sign Up and Guest Mode
- 🌾 Agriculture information
- 🎓 Education guidance
- 💼 Jobs and career information
- 🏛️ Government services information
- 🚌 Public services information
- 🇮🇳 General information about India
- 📱 Responsive design for mobile, tablet and desktop
- ⚡ Fast AI-powered responses

## 🏗️ Technology Stack

### Frontend
- React
- Vite
- JavaScript
- CSS
- Lucide React

### Backend
- Python
- FastAPI
- Google Gemini API
- Pydantic
- Python-dotenv

### AI
- Google Gemini
- Multilingual response generation
- Context-aware conversations

### Voice
- Browser Speech Recognition
- Browser Speech Synthesis

## 📂 Project Structure

```text
BharatSahayak-AI/
│
├── backend/
│   ├── main.py
│   ├── .env
│   ├── .gitignore
│   └── venv/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md

## ⚙️ Setup & Installation

### Prerequisites

- Node.js
- Python 3
- Git
- Google Gemini API key

### Clone the Repository

```bash
git clone https://github.com/Hemantha60/BharatSahayak-AI.git
cd BharatSahayak-AI

### Frontend Setup

```bash
cd frontend
npm install

### Backend Setup

Open another terminal:

```bash
cd backend
python -m venv venv

```bash
venv\Scripts\activate

### Start the Backend

Open a terminal and run:

```bash
cd backend
venv\Scripts\activate
uvicorn main:app --reload

The backend will run at:

http://127.0.0.1:8000

### Start the Frontend

Open another terminal:

```bash
cd frontend
npm run dev
