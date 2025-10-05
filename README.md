# 🎯 HackHarvard 2025 - AI Mock Interview Platform

> **Bridge the gap between LeetCode success and interview confidence.**

Practice technical interviews with Oscar, an AI interviewer that simulates real interview pressure through voice interaction while you code.

---

## 🌟 What Makes This Different?

Most students can solve LeetCode problems silently but **freeze up when explaining their approach**. We provide:

- ✅ **Voice-First Practice** - Real-time conversation with AI interviewer
- ✅ **Natural Code Sync** - AI sees your code invisibly (no awkward notifications)
- ✅ **Real Interview Pressure** - Timed sessions, hints on request, performance ratings
- ✅ **Multi-User Ready** - Deploy on Devpost, handle concurrent users seamlessly

---

## 🚀 Quick Start

### **Option 1: Try It Now (Dev Server)**

Visit the live dev environment: _(Ask team for URL)_

### **Option 2: Run Locally (5 Minutes)**

```bash
# 1. Clone repo
git clone https://github.com/Smit2553/HackHarvard2025.git
cd HackHarvard2025

# 2. Frontend setup
cd frontend
npm install
cp .env.example .env.local  # Add your Vapi keys
npm run dev  # → http://localhost:3000

# 3. Backend setup (separate terminal)
cd backend
pip install -r requirements.txt
cp .env.example .env  # Add your Gemini API key
uvicorn main:app --reload  # → http://localhost:8000
```

**Get API Keys:**

- [Vapi.ai](https://vapi.ai) - Voice AI (free tier available)
- [Google AI Studio](https://ai.google.dev/) - Gemini API (free tier)

---

## 📚 Documentation

| Document                                                   | Purpose                | Audience                |
| ---------------------------------------------------------- | ---------------------- | ----------------------- |
| **[QUICK_START.md](./QUICK_START.md)**                     | 5-minute setup guide   | New developers          |
| **[PRODUCT_DOCUMENTATION.md](./PRODUCT_DOCUMENTATION.md)** | Complete product specs | Product team, investors |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)**                   | Technical deep dive    | Engineers, architects   |

---

## 🎬 Demo Flow

1. **Landing Page** (`/`) - Hero, features, FAQs
2. **Problem Selection** (`/practice`) - Choose interview problem _(WIP)_
3. **Start Interview** (`/start`) - Launch voice call with Oscar
4. **Interview Session** (`/interview`) - Code + talk simultaneously
   - Oscar introduces problem via voice
   - You explain approach while typing
   - Oscar asks clarifying questions, provides hints
   - Code automatically syncs to AI (invisible)
5. **End Call** - Transcript analyzed by Gemini, rating generated

---

## 🏗️ Tech Stack

### **Frontend**

- **Framework:** Next.js 15 + React 19 + TypeScript
- **Voice AI:** Vapi.ai (WebRTC + custom assistant)
- **Editor:** Monaco Editor (VS Code engine)
- **Styling:** Tailwind CSS + shadcn/ui
- **Hosting:** Vercel (recommended)

### **Backend**

- **Framework:** FastAPI (Python)
- **AI Analysis:** Gemini API (transcript rating)
- **Database:** SQLite (dev) → PostgreSQL (prod)
- **Hosting:** German server (current) → Railway/Render (recommended)

---

## ⚡ Key Features

### **1. Invisible Code Synchronization**

Your code is sent to the AI via **metadata** (not conversation messages):

- AI can reference your code naturally
- No "thanks for the code" interruptions
- Debounced (2s delay) to avoid spam
- Pauses when AI is speaking

### **2. Multi-User Session Isolation**

Each browser tab gets a unique session ID:

- Works for Devpost demos (100+ concurrent users)
- No server-side session management needed
- SessionStorage-based (tab-specific)

### **3. Performance Analytics** _(Backend Complete)_

After each interview:

- Gemini analyzes transcript quality
- Generates ratings (communication, problem-solving, code quality)
- Stores in database for historical tracking

### **4. Smart Problem Database**

Current: 5 hardcoded LeetCode problems  
**In Progress:** URL scraper to fetch any LeetCode problem

---

## 📂 Project Structure

```
HackHarvard2025/
├── frontend/
│   ├── app/
│   │   ├── page.tsx                 # Landing page
│   │   ├── interview/page.tsx       # Main interview UI ⭐
│   │   └── start/page.tsx           # Interview launcher
│   ├── components/
│   │   ├── VapiProvider.tsx         # Voice AI context ⭐
│   │   ├── Editor.tsx               # Monaco code editor
│   │   └── TranscriptPanel.tsx      # Live conversation log
│   └── lib/
│       └── sessionId.ts             # Multi-user isolation
│
├── backend/
│   ├── main.py                      # FastAPI app
│   ├── leetcode_endpoint.py         # Problem database ⭐
│   ├── transcript_endpoint.py       # Gemini analysis ⭐
│   └── vapi_endpoint.py             # Vapi webhooks
│
├── PRODUCT_DOCUMENTATION.md         # Complete product specs
├── ARCHITECTURE.md                  # Technical architecture
└── QUICK_START.md                   # Developer guide
```

---

## 🎯 Roadmap

### **Phase 1: Core Product** ✅ _Complete_

- [x] Voice interview with AI (Oscar)
- [x] Monaco code editor integration
- [x] Invisible code sync via metadata
- [x] Multi-user session isolation
- [x] Transcript analysis + rating

### **Phase 2: Enhanced Problems** 🚧 _In Progress_

- [ ] LeetCode URL scraper
- [ ] Problem selection UI
- [ ] Multi-language support (JS, Java, C++)
- [ ] User authentication

### **Phase 3: Multi-Agent System** 📋 _Planned_

- [ ] Different interviewer personas (friendly, strict, silent)
- [ ] Company-specific styles (Google, Amazon, Meta)
- [ ] Role-specific scenarios (frontend, backend, ML)

### **Phase 4: Advanced Features** 🔮 _Future_

- [ ] System design interview mode
- [ ] Behavioral interview practice
- [ ] Performance dashboard
- [ ] Mock interview marketplace

---

## 🧪 Testing Multi-User Support

**Before Devpost deployment:**

```bash
# Open 3 browser tabs to localhost:3000
# Start interview in each tab
# Check console logs:

Tab 1: Session: session-1728123456-abc123
Tab 2: Session: session-1728123456-def456
Tab 3: Session: session-1728123456-ghi789

# Each should have unique session ID ✓
# Each AI should only see that tab's code ✓
```

---

## 🚀 Deployment

### **Frontend → Vercel (Recommended)**

```bash
cd frontend
vercel --prod

# Add environment variables in Vercel dashboard:
# - NEXT_PUBLIC_VAPI_PUBLIC_KEY
# - NEXT_PUBLIC_VAPI_ASSISTANT_ID
```

### **Backend → Railway/Render**

```bash
railway up
# or
render deploy

# Add environment variable:
# - GEMINI_API_KEY
```

**Expected Performance:**

- ✅ Handles 100+ concurrent users
- ✅ < 3s voice call connection time
- ✅ < 2s code editor load time
- ✅ Global CDN (fast worldwide)

---

## 🤝 Contributing

### **Current Team**

- GitHub: [Smit2553](https://github.com/Smit2553)
- Branch: `vapi-service` (voice features)
- PR #20: Invisible code sync implementation

### **Development Workflow**

```bash
# 1. Create feature branch
git checkout -b feature/your-feature

# 2. Make changes
# ... code ...

# 3. Commit with descriptive message
git commit -m "feat: Add feature description"

# 4. Push and create PR
git push origin feature/your-feature
```

---

## 📊 Current Stats

- **Problems Available:** 5 (Two Sum, Valid Parentheses, etc.)
- **Languages Supported:** Python (primary)
- **Interview Duration:** 45 minutes (soft limit)
- **Multi-User Capacity:** Unlimited (stateless architecture)
- **Production Status:** Ready for Devpost deployment ✅

---

## 🐛 Known Issues

- ⚠️ Problem selection UI incomplete (only companies page)
- ⚠️ Single user account (dummy auth)
- ⚠️ Python-only starter code
- ⚠️ No pause/resume functionality

_See [PRODUCT_DOCUMENTATION.md](./PRODUCT_DOCUMENTATION.md) for full list._

---

## 📝 License

MIT License - See [LICENSE](./LICENSE) for details.

---

## 🆘 Need Help?

### **Quick References**

- **Setup Issues:** [QUICK_START.md](./QUICK_START.md)
- **Product Questions:** [PRODUCT_DOCUMENTATION.md](./PRODUCT_DOCUMENTATION.md)
- **Technical Details:** [ARCHITECTURE.md](./ARCHITECTURE.md)

### **External Resources**

- [Vapi.ai Docs](https://docs.vapi.ai) - Voice AI integration
- [Monaco Editor API](https://microsoft.github.io/monaco-editor/) - Code editor
- [Next.js Docs](https://nextjs.org/docs) - Framework guide

---

## 🎉 Acknowledgments

Built for **HackHarvard 2025** with:

- [Vapi.ai](https://vapi.ai) - Voice AI platform
- [Google Gemini](https://ai.google.dev/) - Transcript analysis
- [Vercel](https://vercel.com) - Hosting platform
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor

---

<div align="center">

**[Try Demo](your-demo-url) • [Documentation](./PRODUCT_DOCUMENTATION.md) • [Report Bug](https://github.com/Smit2553/HackHarvard2025/issues)**

Made with ❤️ by the HackHarvard 2025 Team

</div>
