# Vapi Integration - Setup Instructions

## 🎯 What We Built

A voice-enabled mock interview platform that connects to your Vapi AI assistant. Users can:

1. Click "Start Interview" to initiate a voice call with the AI interviewer
2. Get automatically routed to a code editor page
3. Code while speaking with the AI interviewer
4. End the interview when done

## 📁 Files Created

- `components/VapiProvider.tsx` - React Context for managing Vapi state
- `app/start/page.tsx` - Landing page with "Start Interview" button
- `app/interview/page.tsx` - Interview session page with editor and "End Call" button
- `.env.local` - Environment variables (needs your public key)

## 🔧 Setup Steps

### 1. Get Your Vapi Public Key

1. Go to https://dashboard.vapi.ai
2. Navigate to **Account** → **API Keys**
3. Copy your **Public Key** (starts with `pk_`)

### 2. Update Environment Variables

Edit `insertnamehere-frontend/.env.local`:

```env
NEXT_PUBLIC_VAPI_PUBLIC_KEY=pk_your-actual-public-key-here
```

**Important**: Replace `your-public-key-here` with your actual Vapi public key!

### 3. Start the Development Server

```bash
cd insertnamehere-frontend
npm run dev
```

The app will be available at http://localhost:3000

## 🚀 How It Works

### Flow:

1. **Home (`/`)** → Redirects to `/start`
2. **Start Page (`/start`)** → User clicks "Start Interview"
   - Calls `vapi.start(assistantId)`
   - Routes to `/interview`
3. **Interview Page (`/interview`)** → Active interview session
   - Shows Monaco editor for coding
   - Displays "End Interview" button
   - Calls `vapi.stop()` when ending

### Key Components:

**VapiProvider**:

- Manages Vapi instance lifecycle
- Provides `startCall()` and `endCall()` functions
- Tracks call status with `isCallActive`

**Start Page**:

- Beautiful landing page with call-to-action
- Handles microphone permissions
- Error handling for failed connections

**Interview Page**:

- Full-screen code editor
- Live call indicator
- End call button with navigation

## 🔐 Security Note

The `.env.local` file is already in `.gitignore`, so your keys are safe!

## 📝 Testing Checklist

- [ ] Add your Vapi public key to `.env.local`
- [ ] Run `npm run dev`
- [ ] Visit http://localhost:3000
- [ ] Click "Start Interview"
- [ ] Verify microphone permissions dialog appears
- [ ] Confirm voice call connects
- [ ] Test speaking with the AI assistant
- [ ] Verify you're routed to the editor page
- [ ] Code in the editor
- [ ] Click "End Interview"
- [ ] Verify you're routed back to start page

## 🐛 Troubleshooting

**"Assistant ID not configured"**:

- Check that `NEXT_PUBLIC_VAPI_ASSISTANT_ID` is set in `.env.local`

**"Failed to start call"**:

- Verify your public key is correct
- Check browser console for specific errors
- Ensure microphone permissions are granted

**Call doesn't connect**:

- Verify the assistant ID `85ebee7e-de9f-40e2-8dad-d06870d697db` exists in your Vapi dashboard
- Check that the assistant is published (not in draft mode)

## 🎨 Next Steps

- [ ] Add code context transmission to Vapi (future feature from spec)
- [ ] Implement transcript storage in backend
- [ ] Add interview history/review page
- [ ] Enhance UI with more visual feedback
