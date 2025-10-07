# 🏗️ Technical Architecture - HackHarvard 2025

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER EXPERIENCE                               │
│  ┌──────────────┐    ┌──────────────┐    ┌─────────────────────────┐  │
│  │   Landing    │ →  │   Problem    │ →  │   Interview Session     │  │
│  │   (/)        │    │   Selection  │    │   (/interview)          │  │
│  │              │    │   (/practice)│    │                         │  │
│  │  - Hero      │    │              │    │  ┌─────────────────┐    │  │
│  │  - FAQs      │    │  - Companies │    │  │   InfoPanel     │    │  │
│  │  - Features  │    │  - Topics    │    │  │   (Problem)     │    │  │
│  └──────────────┘    │  - Difficulty│    │  └─────────────────┘    │  │
│                      └──────────────┘    │                         │  │
│                                          │  ┌─────────────────┐    │  │
│                                          │  │   Monaco Editor │    │  │
│                                          │  │   (Code)        │    │  │
│                                          │  └─────────────────┘    │  │
│                                          │                         │  │
│                                          │  ┌─────────────────┐    │  │
│                                          │  │ TranscriptPanel │    │  │
│                                          │  │ (Live Voice)    │    │  │
│                                          │  └─────────────────┘    │  │
│                                          └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │
            ┌───────────────────────┼───────────────────────┐
            │                       │                       │
            ▼                       ▼                       ▼
┌────────────────────┐  ┌────────────────────┐  ┌─────────────────────┐
│   VapiProvider     │  │  Monaco Editor     │  │  Session Manager    │
│   (Context)        │  │  Integration       │  │  (Multi-User)       │
├────────────────────┤  ├────────────────────┤  ├─────────────────────┤
│ - Call lifecycle   │  │ - Syntax highlight │  │ - generateSessionId │
│ - Voice streaming  │  │ - Auto-complete    │  │ - sessionStorage    │
│ - Code sync        │  │ - Error detection  │  │ - User isolation    │
│ - Speaking state   │  │ - Theme support    │  │                     │
│ - Transcript log   │  │ - useDebounce(2s)  │  │                     │
└────────────────────┘  └────────────────────┘  └─────────────────────┘
            │                       │                       │
            └───────────────────────┼───────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
        ┌───────────────────────┐      ┌──────────────────────┐
        │    Vapi.ai Service    │      │  FastAPI Backend     │
        │    (Voice AI)         │      │  (German Server)     │
        ├───────────────────────┤      ├──────────────────────┤
        │ Speech-to-Text (STT)  │      │ GET /api/random      │
        │ Text-to-Speech (TTS)  │      │     _problem         │
        │ WebSocket Streaming   │      │                      │
        │ Oscar AI Assistant    │      │ POST /api/transcript │
        │ Metadata Processing   │      │                      │
        │ Webhook Callbacks     │      │ POST /api/vapi       │
        └───────────────────────┘      │      _webhook        │
                                       └──────────────────────┘
                                                  │
                                                  │
                                    ┌─────────────┴─────────────┐
                                    │                           │
                                    ▼                           ▼
                        ┌────────────────────┐    ┌────────────────────┐
                        │  Gemini API        │    │  Database          │
                        │  (Google)          │    │  (SQLite)          │
                        ├────────────────────┤    ├────────────────────┤
                        │ - Analyze          │    │ - Transcripts      │
                        │   transcript       │    │ - Ratings          │
                        │ - Generate rating  │    │ - User sessions    │
                        │ - Provide feedback │    │ - Problem cache    │
                        └────────────────────┘    └────────────────────┘
```

---

## Data Flow: Complete Interview Lifecycle

### **Phase 1: Interview Start**

```
User Action: Click "Start Interview"
  ↓
1. Router.push('/interview')
  ↓
2. useEffect → vapi.start(assistantId)
  ↓
3. WebSocket connection established
  ↓
4. Vapi triggers "call-start" event
  ↓
5. Frontend: isCallActive = true
  ↓
6. Backend: GET /api/random_problem
  ↓
7. Problem data rendered in InfoPanel
  ↓
8. Oscar (AI): "Hi! Today we'll work on Two Sum..."
```

### **Phase 2: Coding Session**

```
User Action: Types code in Monaco Editor
  ↓
1. onChange handler captures input
  ↓
2. setEditorCode(newCode)
  ↓
3. useDebounce delays by 2 seconds
  ↓
4. debouncedCode updates
  ↓
5. useEffect checks:
   - isCallActive? ✓
   - isSpeaking? ✗ (wait if true)
   - Code changed? ✓
  ↓
6. sendCodeContext(code, language, problem)
  ↓
7. VapiProvider: (vapi as any).send({
     type: "add-message",
     message: { role: "system", content: "Code context updated" },
     metadata: {
       sessionId: "session-xxx-yyy",
       code: "def twoSum(nums, target):\n  ...",
       language: "python",
       lines: 15
     }
   })
  ↓
8. Vapi SDK → WebSocket → Vapi Server
  ↓
9. Oscar receives metadata (invisible to conversation)
  ↓
10. Oscar can reference code: "I see you're using a hash map..."
```

### **Phase 3: Voice Interaction**

```
User Action: Speaks into microphone
  ↓
1. Browser captures audio
  ↓
2. WebSocket → Vapi Server
  ↓
3. Speech-to-Text (STT) processing
  ↓
4. Vapi triggers "message" event
  ↓
5. Frontend: Transcript updated
  ↓
6. Oscar AI generates response
  ↓
7. Text-to-Speech (TTS) processing
  ↓
8. Vapi triggers "speech-start" event
  ↓
9. Frontend: isSpeaking = true
  ↓
10. Code sync paused (prevents interruption)
  ↓
11. Audio streamed to browser
  ↓
12. Vapi triggers "speech-end" event
  ↓
13. Frontend: isSpeaking = false
  ↓
14. Code sync resumes
```

### **Phase 4: Interview End**

```
User Action: Click "End Interview"
  ↓
1. vapi.stop()
  ↓
2. Vapi triggers "call-end" event
  ↓
3. Frontend: isCallActive = false
  ↓
4. Complete transcript collected
  ↓
5. POST /api/transcript {
     transcript: [...],
     metadata: { sessionId }
   }
  ↓
6. Backend processes:
   - Extract statistics
   - User message count: 12
   - Assistant message count: 13
   - Duration: 1234.56s
  ↓
7. Backend → Gemini API
  ↓
8. Gemini analyzes:
   - Communication clarity: 8/10
   - Problem-solving: 7/10
   - Code quality: 9/10
  ↓
9. Rating generated
  ↓
10. Save to database
  ↓
11. Return rating to frontend
  ↓
12. (Future) Display performance dashboard
```

---

## Component Interaction Map

```
┌─────────────────────────────────────────────────────────────┐
│                      app/interview/page.tsx                 │
│                    (Main Interview Interface)               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  State Management:                                          │
│  ┌────────────────────────────────────────────────────┐    │
│  │ const { vapi, isCallActive, isSpeaking,           │    │
│  │         sendCodeContext, transcript } = useVapi()  │    │
│  │                                                    │    │
│  │ const [editorCode, setEditorCode] = useState("")  │    │
│  │ const debouncedCode = useDebounce(editorCode, 2000)│   │
│  │ const [problem, setProblem] = useState(null)      │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
│  Effects:                                                   │
│  ┌────────────────────────────────────────────────────┐    │
│  │ useEffect #1: Fetch problem on mount              │    │
│  │ useEffect #2: Send initial code 1s after call     │    │
│  │ useEffect #3: Send debounced code updates         │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
│  Child Components:                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  InfoPanel   │  │   Editor     │  │  Transcript  │    │
│  │  (Problem)   │  │  (Monaco)    │  │  (Voice Log) │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│         │                  │                  │            │
│         └──────────────────┼──────────────────┘            │
│                            │                               │
└────────────────────────────┼───────────────────────────────┘
                             │
                             ▼
                ┌────────────────────────┐
                │  VapiProvider Context  │
                └────────────────────────┘
```

---

## State Management Architecture

### **Global State (VapiProvider Context)**

```typescript
VapiContext {
  // Core Vapi Instance
  vapi: Vapi | null                    // WebSocket connection

  // Call State
  isCallActive: boolean                // Is interview running?
  isSpeaking: boolean                  // Is Oscar talking?
  error: string | null                 // Connection errors

  // Transcript State
  transcript: TranscriptSegment[]      // Complete conversation log
  callStartTimeRef: number | null      // Session start timestamp

  // Methods
  startCall: () => Promise<void>       // Begin interview
  endCall: () => void                  // Terminate interview
  sendCodeContext: (code, lang, prob) => void  // Sync code
}
```

### **Local State (Interview Page)**

```typescript
InterviewPage State {
  // Problem State
  problem: LeetCodeProblem | null      // Current problem data
  loading: boolean                     // Fetching problem
  error: string | null                 // Fetch errors

  // Editor State
  editorCode: string                   // Live code input
  debouncedCode: string                // Delayed code (2s)
  lastSentCodeRef: string              // Prevent duplicates

  // UI State
  selectedLanguage: string             // Code language
  theme: "light" | "dark" | "system"   // Editor theme
  showExitDialog: boolean              // Confirmation modal

  // Navigation State
  currentProblemIndex: number          // Problem #1, #2, etc.
}
```

---

## API Contract Specifications

### **Frontend → Backend**

#### **1. Get Random Problem**

```http
GET /api/random_problem

Response 200:
{
  "title": "Two Sum",
  "type": "arrays",
  "description": "Given an array of integers...",
  "example_test_case": {
    "input": "nums = [2,7,11,15], target = 9",
    "output": "[0,1]",
    "explanation": "Because nums[0] + nums[1] == 9..."
  },
  "expected_solution": "Use a hash map...",
  "starter_code": "def twoSum(nums, target):\n  pass",
  "solutions": [
    {
      "approach": "Hash map (optimal)",
      "code": "...",
      "time_complexity": "O(n)",
      "space_complexity": "O(n)"
    }
  ]
}
```

#### **2. Submit Transcript**

```http
POST /api/transcript
Content-Type: application/json

Body:
{
  "transcript": [
    {
      "type": "call-start",
      "timestamp": "2025-10-05T12:00:00.000Z",
      "secondsSinceStart": 0
    },
    {
      "type": "transcript",
      "role": "user",
      "text": "I think I'll use a hash map",
      "timestamp": "2025-10-05T12:00:15.000Z",
      "secondsSinceStart": 15.0
    },
    {
      "type": "call-end",
      "timestamp": "2025-10-05T12:45:00.000Z",
      "secondsSinceStart": 2700.0
    }
  ],
  "metadata": {
    "sessionId": "session-1728123456-abc123"
  }
}

Response 200:
{
  "status": "success",
  "segments_count": 25,
  "call_duration": 2700.0,
  "transcript_summary": {
    "user_messages": 12,
    "assistant_messages": 13
  },
  "rating": {
    "communication": 8,
    "problem_solving": 7,
    "code_quality": 9,
    "overall": 8,
    "feedback": "Great use of hash map..."
  }
}
```

### **Frontend → Vapi**

#### **Code Context (Metadata Approach)**

```typescript
(vapi as any).send({
  type: "add-message",
  message: {
    role: "system",
    content: "Code context updated", // Generic message
  },
  metadata: {
    // Actual data (invisible to conversation)
    sessionId: "session-1728123456-abc123",
    type: "code_update",
    problem: "Two Sum",
    language: "python",
    code: "def twoSum(nums, target):\n  seen = {}\n  ...",
    lines: 15,
    timestamp: "2025-10-05T12:30:00.000Z",
  },
});
```

---

## Security & Performance Considerations

### **Security**

- ✅ API keys in `.env` files (not version controlled)
- ✅ CORS configured for specific origins
- ✅ No sensitive data in metadata
- ✅ SessionStorage isolation (per browser tab)
- ⚠️ **TODO:** Rate limiting on backend endpoints
- ⚠️ **TODO:** Transcript encryption at rest

### **Performance**

- ✅ Monaco Editor lazy-loaded (`dynamic` import)
- ✅ Code sync debounced (2s delay)
- ✅ Speaking state prevents interruptions
- ✅ Stateless architecture (horizontal scaling)
- ⚠️ **Bottleneck:** Vapi account limits (calls/minute)
- ⚠️ **Bottleneck:** Gemini API rate limits

---

## Technology Decision Rationale

### **Why Next.js?**

- ✅ React framework with built-in routing
- ✅ Server-side rendering (SEO benefits)
- ✅ API routes (future backend features)
- ✅ Vercel deployment (zero config)

### **Why Vapi.ai?**

- ✅ WebRTC-based voice (low latency)
- ✅ Built-in STT/TTS (no need for separate services)
- ✅ Custom assistant configuration
- ✅ Metadata support (invisible code sync)
- ❌ **Limitation:** TypeScript types incomplete

### **Why Monaco Editor?**

- ✅ Same engine as VS Code
- ✅ Syntax highlighting for 100+ languages
- ✅ IntelliSense auto-completion
- ✅ Theme customization
- ❌ **Tradeoff:** Large bundle size (lazy load required)

### **Why FastAPI (Backend)?**

- ✅ Modern Python framework
- ✅ Automatic API documentation (Swagger)
- ✅ Pydantic validation (type-safe)
- ✅ Async support (high concurrency)

### **Why Gemini API (not GPT-4)?**

- ✅ Cost-effective for transcript analysis
- ✅ Fast response times
- ✅ Good at structured output (ratings)
- ⚠️ **Alternative:** Could use Claude, GPT-4, etc.

---

## Scalability Considerations

### **Current Capacity**

- **Concurrent Users:** Unlimited (stateless frontend)
- **Vapi Calls:** Limited by account tier
- **Database:** SQLite (dev), upgrade to PostgreSQL (prod)
- **Backend:** Single server (German)

### **Scaling Strategy**

1. **Frontend:** Already scalable (Vercel edge network)
2. **Backend:** Add load balancer + multiple instances
3. **Database:** Migrate to PostgreSQL/MongoDB
4. **Vapi:** Upgrade account tier or implement queuing
5. **Gemini:** Add retry logic + rate limit handling

---

**Architecture Version:** 1.0  
**Last Updated:** October 5, 2025  
**Status:** Production-Ready (Multi-User Supported)
