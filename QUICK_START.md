# 🚀 Quick Start Guide - HackHarvard 2025

**For developers joining the project or returning after a break.**

---

## ⚡ 5-Minute Setup

### **1. Clone & Install**

```bash
# Clone the repo
git clone https://github.com/Smit2553/HackHarvard2025.git
cd HackHarvard2025

# Frontend setup
cd frontend
npm install

# Backend setup (separate terminal)
cd ../backend
pip install -r requirements.txt
```

### **2. Environment Variables**

**Frontend (`.env.local`):**

```env
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key_here
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_assistant_id_here
```

**Backend (`.env`):**

```env
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=sqlite:///./transcripts.db
```

### **3. Run Development Servers**

```bash
# Terminal 1: Frontend
cd frontend
npm run dev
# → http://localhost:3000

# Terminal 2: Backend
cd backend
uvicorn main:app --reload
# → http://localhost:8000
```

### **4. Test the App**

1. Open `http://localhost:3000`
2. Click "Start Practicing"
3. Click "Start Interview"
4. Grant microphone permissions
5. Say "Hello" to Oscar (AI interviewer)
6. Start typing code in the editor

---

## 📂 File Structure at a Glance

```
HackHarvard2025/
├── PRODUCT_DOCUMENTATION.md    ⭐ Read this first!
├── ARCHITECTURE.md              🏗️ System design details
├── QUICK_START.md              ⚡ This file
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx                    # Landing page
│   │   ├── start/page.tsx              # Interview launcher
│   │   └── interview/page.tsx          # ⭐ Main interview UI
│   ├── components/
│   │   ├── VapiProvider.tsx            # ⭐ Voice AI context
│   │   ├── Editor.tsx                  # Monaco code editor
│   │   ├── InfoPanel.tsx               # Problem display
│   │   └── TranscriptPanel.tsx         # Live transcript
│   ├── hooks/
│   │   └── useDebounce.ts              # Code sync debounce
│   └── lib/
│       └── sessionId.ts                # Multi-user isolation
│
└── backend/
    ├── main.py                         # FastAPI app
    ├── leetcode_endpoint.py            # Problem database
    ├── transcript_endpoint.py          # ⭐ Gemini analysis
    ├── vapi_endpoint.py                # Vapi webhooks
    └── gemini_rating_service.py        # Rating generation
```

---

## 🎯 Common Tasks

### **Add a New LeetCode Problem**

**File:** `backend/leetcode_endpoint.py`

```python
LEETCODE_PROBLEMS.append({
    "title": "Valid Anagram",
    "type": "strings",
    "description": "Given two strings s and t, return true if...",
    "example_test_case": {
        "input": "s = 'anagram', t = 'nagaram'",
        "output": "true",
        "explanation": "..."
    },
    "expected_solution": "Sort both strings or use hash map",
    "starter_code": """
def isAnagram(s, t):
    # TODO: Implement solution
    pass
""",
    "solutions": [
        {
            "approach": "Sorting",
            "code": "return sorted(s) == sorted(t)",
            "time_complexity": "O(n log n)",
            "space_complexity": "O(1)"
        }
    ]
})
```

### **Modify Oscar's System Prompt**

**Location:** Vapi Dashboard (not in code)

1. Go to [vapi.ai](https://vapi.ai) → Dashboard
2. Find your assistant (ID from `.env`)
3. Edit system prompt
4. **Important:** Use positive instructions, avoid "DO NOT" phrases

**Recommended Prompt Structure:**

```
You are Oscar, a friendly technical interviewer...

When you receive code context updates via metadata:
- Reference the code naturally
- Ask clarifying questions about their approach
- Provide hints when requested
- Never mention that you can see their code
```

### **Change Code Sync Debounce Delay**

**File:** `app/interview/page.tsx`

```typescript
// Change from 2000ms to 1000ms (1 second)
const debouncedCode = useDebounce(editorCode, 1000);
```

### **Add Support for JavaScript**

**Step 1:** Update Monaco Editor language

```typescript
// app/interview/page.tsx
const [selectedLanguage, setSelectedLanguage] = useState("javascript");
```

**Step 2:** Add JavaScript starter code to problem

```python
# backend/leetcode_endpoint.py
"starter_code_js": """
function twoSum(nums, target) {
    // TODO: Implement solution
}
"""
```

**Step 3:** Conditional rendering

```typescript
// app/interview/page.tsx
const starterCode =
  selectedLanguage === "python"
    ? problem.starter_code
    : problem.starter_code_js;
```

### **Customize Editor Theme**

**File:** `components/Editor.tsx`

```typescript
// Change from "vs-light" to "vs-dark"
theme = "vs-dark";

// Or create custom theme:
monaco.editor.defineTheme("custom-theme", {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "comment", foreground: "6B7280", fontStyle: "italic" },
    { token: "keyword", foreground: "8B5CF6", fontStyle: "bold" },
    { token: "string", foreground: "059669" },
  ],
  colors: {
    "editor.background": "#0A0A0A",
    "editor.foreground": "#E5E7EB",
  },
});
```

---

## 🐛 Debugging Tips

### **Vapi Call Not Starting**

```bash
# Check browser console for errors
# Common issues:
1. Missing environment variables → Check .env.local
2. Invalid assistant ID → Verify in Vapi dashboard
3. Microphone permission denied → Chrome settings
4. CORS error → Check backend CORS config
```

### **Code Not Syncing to AI**

```typescript
// Add debug logs to VapiProvider.tsx
const sendCodeContext = useCallback((code, lang, prob) => {
  console.log("🔍 sendCodeContext called");
  console.log("   isCallActive:", isCallActive);
  console.log("   isSpeaking:", isSpeaking);
  console.log("   Code length:", code.length);

  // ... rest of function
});
```

### **AI Reading Instructions Out Loud**

**Problem:** Oscar says "Code context updated" or mentions metadata

**Solution:**

1. Check system prompt for "DO NOT" phrases (remove them)
2. Ensure using metadata field (not regular message)
3. Message content should be generic: "Code context updated"

### **Multiple Users Interfering with Each Other**

```typescript
// Check sessionId in console
console.log("Session ID:", getSessionId());

// Each tab should have unique ID:
// Tab 1: session-1728123456-abc123
// Tab 2: session-1728123456-def456
```

### **Backend Not Receiving Transcripts**

```bash
# Check backend logs
uvicorn main:app --reload --log-level debug

# Verify CORS configuration in main.py
allow_origins=["*"]  # Should include your frontend URL
```

---

## 📊 Testing Checklist

### **Before Committing Code**

- [ ] Frontend builds without errors: `npm run build`
- [ ] Backend starts without errors: `uvicorn main:app`
- [ ] No TypeScript errors: `npm run type-check` (if available)
- [ ] Console logs removed (except intentional ones)
- [ ] Environment variables not hardcoded
- [ ] Git commit message is descriptive

### **Before Deploying to Dev**

- [ ] Test interview flow end-to-end
- [ ] Verify code sync works (type → wait 2s → check AI response)
- [ ] Test with 2-3 browser tabs (multi-user)
- [ ] Check mobile responsiveness
- [ ] Verify backend endpoints respond correctly
- [ ] Test microphone permissions in different browsers

### **Before Production/Devpost**

- [ ] Update environment variables in hosting dashboard
- [ ] Test with real users (not just localhost)
- [ ] Verify Gemini API rate limits are sufficient
- [ ] Check Vapi account usage/limits
- [ ] Add error boundaries for production errors
- [ ] Test on multiple devices (desktop, tablet, phone)
- [ ] Verify SSL certificate (HTTPS)
- [ ] Update system prompt in Vapi dashboard

---

## 🔑 Key Concepts to Understand

### **1. Why Metadata for Code Sync?**

```typescript
// ❌ BAD: AI mentions receiving code
vapi.send({
  type: "add-message",
  message: {
    role: "system",
    content: "User's code: def twoSum(nums, target)...",
  },
});
// Oscar says: "Thanks for sharing your code..."

// ✅ GOOD: AI sees code silently
(vapi as any).send({
  message: { role: "system", content: "Code context updated" },
  metadata: { code: "def twoSum..." }, // Invisible to conversation
});
// Oscar says: "I see you're using a hash map..." (natural)
```

### **2. Why Debouncing?**

```typescript
// Without debouncing:
User types: "d" → Send code
User types: "de" → Send code
User types: "def" → Send code  (3 API calls!)

// With 2s debounce:
User types: "d"
User types: "de"
User types: "def"
⏱️ Wait 2 seconds... → Send code  (1 API call!)
```

### **3. Why Check `isSpeaking`?**

```typescript
// ❌ Without check:
Oscar: "So, let me explain the hash map approa—"
*Code sync interrupts*
Oscar: "—Code context updated"  (Broken sentence!)

// ✅ With check:
Oscar: "So, let me explain the hash map approach."
*Code sync waits*
Oscar finishes speaking
*Code sync sends*  (Smooth!)
```

### **4. Why Session IDs?**

```
Without Session IDs:
User A types code → Metadata sent
User B sees User A's code somehow (race condition)

With Session IDs:
User A: sessionId = "session-xxx-aaa"
User B: sessionId = "session-xxx-bbb"
Backend can track/isolate if needed
```

---

## 🔗 Important Links

### **Documentation**

- [PRODUCT_DOCUMENTATION.md](./PRODUCT_DOCUMENTATION.md) - Full product specs
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture
- [context/code-streaming-vapi.md](./frontend/context/code-streaming-vapi.md) - Original implementation plan

### **External Services**

- [Vapi Dashboard](https://vapi.ai) - Manage Oscar AI assistant
- [Gemini API](https://ai.google.dev/) - Transcript analysis
- [Monaco Editor Docs](https://microsoft.github.io/monaco-editor/) - Editor API
- [Next.js Docs](https://nextjs.org/docs) - Framework reference

### **Deployment**

- [Vercel Dashboard](https://vercel.com) - Frontend hosting
- Dev Environment: (Ask team for URL)

---

## 🆘 Need Help?

### **Common Questions**

**Q: How do I get Vapi API keys?**
A: Sign up at [vapi.ai](https://vapi.ai) → Create assistant → Copy public key

**Q: Where is the database file?**
A: `backend/transcripts.db` (SQLite, not committed to git)

**Q: How do I test without microphone?**
A: Can't test voice without mic, but can test code sync with console logs

**Q: Why is Oscar not responding?**
A: Check Vapi dashboard → Assistant logs for errors

**Q: How do I add more problems?**
A: Edit `backend/leetcode_endpoint.py` → Add to `LEETCODE_PROBLEMS` array

**Q: Can I use a different AI model?**
A: Vapi supports GPT-4, Claude, etc. - configure in dashboard

---

## 🎨 Code Style Guidelines

### **TypeScript/React**

```typescript
// ✅ Good: Descriptive names, typed props
interface InterviewPageProps {
  problemId?: string;
}

export default function InterviewPage({ problemId }: InterviewPageProps) {
  const [editorCode, setEditorCode] = useState<string>("");

  // Grouped by related functionality
  useEffect(() => {
    // Effect logic
  }, [dependency]);

  return <div>...</div>;
}

// ❌ Bad: Generic names, untyped
function Page(props) {
  const [data, setData] = useState();
  // ...
}
```

### **Python/FastAPI**

```python
# ✅ Good: Type hints, docstrings
@router.post("/api/transcript")
async def receive_transcript(request: TranscriptRequest):
    """
    Receive and process interview transcript.

    Args:
        request: Validated transcript data

    Returns:
        Transcript summary with rating
    """
    # Logic here
    return {"status": "success"}

# ❌ Bad: No types, no docs
@router.post("/api/transcript")
async def receive_transcript(request):
    return {"status": "success"}
```

---

## 📝 Git Workflow

```bash
# 1. Create feature branch
git checkout -b feature/leetcode-scraper

# 2. Make changes
# ... edit files ...

# 3. Stage changes
git add backend/leetcode_scraper.py

# 4. Commit with descriptive message
git commit -m "feat: Add LeetCode URL scraper endpoint

- Implemented web scraping for problem details
- Added caching layer for rate limiting
- Updated API documentation"

# 5. Push to remote
git push origin feature/leetcode-scraper

# 6. Create pull request on GitHub
# (Use GitHub UI)

# 7. After review, merge to main
git checkout main
git pull origin main
```

---

## 🚀 Deployment Commands

### **Vercel (Frontend)**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
cd frontend
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_VAPI_PUBLIC_KEY
vercel env add NEXT_PUBLIC_VAPI_ASSISTANT_ID
```

### **Backend (Manual)**

```bash
# SSH into server
ssh user@your-server.com

# Pull latest code
cd HackHarvard2025/backend
git pull origin main

# Restart service
sudo systemctl restart hackharvard-backend
```

---

**Quick Start Version:** 1.0  
**Last Updated:** October 5, 2025  
**For Questions:** Check PRODUCT_DOCUMENTATION.md or ask the team!
