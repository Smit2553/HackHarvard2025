# Offscript

> *Voice-based technical interview simulator powered by AI*

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://offscript.codestacx.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Built at HackHarvard 2025](https://img.shields.io/badge/Built%20at-HackHarvard%202025-red)](https://hackharvard.io/)

🔗 **[Try it Live](https://offscript.codestacx.com/)**

---

## Introduction

The idea for **Offscript** came from a painful realization: talented engineers were failing interviews not because they couldn't solve problems, but because they couldn't explain their solutions. Traditional coding practice platforms like LeetCode train you to write code, but they don't prepare you for the most critical part of the interview — *the conversation*.

Offscript bridges that gap. It's a voice-based technical interview simulator that helps engineers practice real interview scenarios through live conversation. By integrating voice AI, real-time code analysis, and intelligent feedback, Offscript creates a realistic interview environment where you can practice explaining your thought process, defending your approach, and thinking out loud — just like in a real interview.

## ✨ Features

- **🎙️ Voice-First Interviewing** - Practice explaining your approach naturally through conversation, powered by Vapi AI
- **💻 Live Code Editor** - Write code in real-time with syntax highlighting and multi-language support (Python, JavaScript, Java, C++, Go)
- **🤖 AI-Powered Feedback** - Get detailed performance ratings on communication, problem-solving, and implementation using Google Gemini
- **📊 Structured Evaluation** - Receive letter grades (A+ to F) across three key categories with actionable feedback
- **📝 Full Transcript Recording** - Review complete conversation transcripts with timestamps
- **🎯 Real LeetCode Problems** - Practice with authentic coding challenges covering arrays, strings, trees, and linked lists
- **⏱️ Interview Timer** - Built-in 45-minute timer to simulate real interview time constraints
- **🌓 Dark/Light Mode** - Comfortable coding interface with theme support
- **📱 Responsive Design** - Optimized desktop experience for focused practice

## 🏗️ Architecture Overview

Offscript is built as a modern full-stack application with separate frontend and backend services:

### Frontend (Next.js)
- **Framework**: Next.js 15 with React 19 and TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS for beautiful, accessible interfaces
- **Code Editor**: Monaco Editor (VS Code's editor) for professional code editing experience
- **Voice Integration**: Vapi AI Web SDK for real-time voice communication
- **State Management**: React hooks and context for managing interview state
- **Routing**: Next.js App Router for seamless navigation

### Backend (FastAPI)
- **Framework**: FastAPI for high-performance Python API
- **Database**: SQLite for storing interview transcripts and ratings
- **AI Integration**: 
  - **Vapi AI**: Handles voice-to-text conversion and natural language processing
  - **Google Gemini 2.5**: Powers intelligent transcript analysis and grading
- **Endpoints**:
  - `/api/leetcode` - Serves random coding problems with solutions
  - `/api/vapi_webhook` - Receives real-time voice data during interviews
  - `/api/transcript` - Stores and retrieves interview transcripts
  - `/api/rate` - Generates AI-powered performance ratings

### Data Flow
```
User Voice → Vapi AI → Backend Webhook → Real-time Transcript
                           ↓
User Code → Monaco Editor → Code Context → AI Interviewer
                           ↓
Interview End → Transcript Storage → Gemini AI Analysis → Performance Report
```

## 🛠️ Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first styling
- **[shadcn/ui](https://ui.shadcn.com/)** - Component library
- **[Monaco Editor](https://microsoft.github.io/monaco-editor/)** - Code editor
- **[Vapi AI Web SDK](https://vapi.ai/)** - Voice AI integration
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Theme management

### Backend
- **[FastAPI](https://fastapi.tiangolo.com/)** - Modern Python web framework
- **[Google Gemini AI](https://ai.google.dev/)** - Advanced language model for analysis
- **[SQLite](https://www.sqlite.org/)** - Lightweight database
- **[Pydantic](https://pydantic-docs.helpmanual.io/)** - Data validation
- **[Uvicorn](https://www.uvicorn.org/)** - ASGI server
- **[python-dotenv](https://pypi.org/project/python-dotenv/)** - Environment management

## 🚀 Installation and Setup

### Prerequisites
- **Node.js** 20+ and npm/yarn
- **Python** 3.11+
- **Vapi AI Account** - [Sign up here](https://vapi.ai/)
- **Google Gemini API Key** - [Get it here](https://makersuite.google.com/app/apikey)

### Backend Setup

1. **Navigate to the backend directory**
   ```bash
   cd backend
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create `.env` file**
   ```bash
   touch .env
   ```

5. **Add your environment variables**
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

6. **Run the backend server**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to the frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env.local` file**
   ```bash
   touch .env.local
   ```

4. **Add your environment variables**
   ```env
   NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_vapi_assistant_id
   NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

**Backend:**
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 📖 Usage Instructions

### Starting an Interview

1. **Visit the Homepage** - Navigate to `http://localhost:3000` or [offscript.codestacx.com](https://offscript.codestacx.com/)

2. **Click "Start Practicing"** - Choose your practice path

3. **Grant Microphone Permission** - Allow browser access to your microphone

4. **Click "Start Interview"** - The AI interviewer will begin

### During the Interview

- **Speak naturally** - Explain your thought process as you would in a real interview
- **Write code** - Use the Monaco editor to implement your solution
- **Ask questions** - The AI interviewer responds to clarifying questions
- **Track time** - Keep an eye on the 45-minute countdown timer
- **Review transcript** - See real-time transcription of the conversation

### Ending the Interview

1. **Click "End Interview"** - Confirm you want to finish

2. **Wait for Analysis** - Gemini AI processes your transcript (takes ~10-20 seconds)

3. **Review Feedback** - Get detailed grades and suggestions:
   - **Communication Grade** - How clearly you explained your approach
   - **Problem-Solving Grade** - Your analytical and algorithmic thinking
   - **Implementation Grade** - Code quality and correctness
   - **Overall Assessment** - Key strengths and 3 improvement points

## 🎯 Key Challenges and Solutions

### Challenge 1: Real-Time Voice Synchronization
**Problem**: Keeping the voice conversation synchronized with code changes without lag.
**Solution**: Implemented debounced code context updates and WebSocket-based communication through Vapi AI's SDK, ensuring smooth real-time interaction without overwhelming the backend.

### Challenge 2: Intelligent Feedback Generation
**Problem**: Providing meaningful, specific feedback that goes beyond generic advice.
**Solution**: Engineered detailed prompts for Gemini AI with structured output schemas (Pydantic models), ensuring consistent, actionable feedback across three evaluation dimensions with letter grades and specific examples.

### Challenge 3: Natural Conversation Flow
**Problem**: Making the AI interviewer feel like a real person, not a robotic questioner.
**Solution**: Integrated Vapi AI's conversational AI capabilities with custom assistant configuration, allowing for natural follow-up questions, clarifications, and adaptive responses based on candidate input.

### Challenge 4: Database Architecture for Transcripts
**Problem**: Storing complex interview data (transcripts, metadata, ratings) efficiently.
**Solution**: Designed a SQLite schema with JSON serialization for flexible transcript storage, supporting both raw conversation data and structured evaluation results with timestamps.

## 🏆 Accomplishments and Learnings

### What We're Proud Of
- **Seamless Voice Integration** - Built a production-ready voice interview system in 48 hours
- **AI-Powered Analysis** - Created an intelligent evaluation system that provides genuinely helpful feedback
- **Developer Experience** - Crafted a polished, professional interface that engineers actually want to use
- **End-to-End Solution** - Delivered a complete product from voice input to detailed performance reports

### What We Learned
- **Voice AI Complexity** - Working with real-time voice requires careful state management and error handling
- **Prompt Engineering** - Structured outputs from LLMs need precise prompt design and schema definition
- **Full-Stack Integration** - Coordinating TypeScript/React frontend with Python/FastAPI backend taught us valuable lessons about API design
- **User-Centric Design** - Interview practice is deeply personal — the UI must be calming and focused, not distracting

## 🗺️ Roadmap / What's Next

### Near Term (Next 3 Months)
- **Company-Specific Modes** - Practice interviews styled after Google, Meta, Amazon, etc.
- **Video Recording** - Record yourself for body language analysis
- **Progress Tracking** - Dashboard showing improvement over time
- **Custom Problems** - Allow users to upload their own coding challenges

### Future Vision
- **Behavioral Interview Practice** - Expand beyond technical to STAR-method behavioral questions
- **System Design Interviews** - Voice-guided architecture discussions with diagramming
- **Mock Interview Matching** - Connect users for peer-to-peer practice sessions
- **Mobile App** - iOS/Android apps for practice on the go
- **Multi-Language Support** - Interface and AI interviewer in multiple languages

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

Please ensure your code follows the existing style and includes appropriate tests.

### Development Guidelines
- Follow TypeScript/Python best practices
- Write clear commit messages
- Update documentation for new features
- Test voice features manually before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- **HackHarvard 2025** - For providing the platform and inspiration
- **Vapi AI** - For powerful voice AI infrastructure
- **Google Gemini** - For intelligent transcript analysis
- **Vercel** - For seamless frontend deployment
- **All Open Source Contributors** - For the amazing tools that made this possible

---

**Built with ❤️ by the Offscript Team at HackHarvard 2025**

*Questions or feedback? Open an issue or reach out!*
