# 🔧 Environment Variables Guide

## Frontend Environment Variables

All frontend environment variables are stored in `frontend/.env.local` and must be prefixed with `NEXT_PUBLIC_` to be accessible in the browser.

### Required Variables

#### `NEXT_PUBLIC_API_URL`

**Purpose:** Backend API base URL  
**Default:** `https://harvardapi.codestacx.com`  
**Local Development:** `http://127.0.0.1:8001`

**Usage:**

```typescript
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://harvardapi.codestacx.com";
```

**When to change:**

- Set to `http://127.0.0.1:8001` when testing with local backend
- Set to `https://harvardapi.codestacx.com` for production
- Set to your custom domain when deploying to your own server

#### `NEXT_PUBLIC_VAPI_ASSISTANT_ID`

**Purpose:** Vapi AI assistant identifier  
**Required:** Yes  
**Get from:** Vapi.ai dashboard

#### `NEXT_PUBLIC_VAPI_PUBLIC_KEY`

**Purpose:** Vapi public API key  
**Required:** Yes  
**Get from:** Vapi.ai dashboard  
**Note:** Safe to expose in frontend code

---

## Setup Instructions

### For New Developers

1. **Copy the example file:**

   ```bash
   cd frontend
   cp .env.example .env.local
   ```

2. **Fill in your values:**

   - Get Vapi credentials from team lead
   - Keep `NEXT_PUBLIC_API_URL` as default (production)
   - For local testing, change to `http://127.0.0.1:8001`

3. **Restart dev server:**
   ```bash
   npm run dev
   ```
   Changes to `.env.local` require a server restart!

### Switching Between Local and Production

**To use local backend:**

```bash
# In frontend/.env.local
NEXT_PUBLIC_API_URL=http://127.0.0.1:8001
```

**To use production backend:**

```bash
# In frontend/.env.local
NEXT_PUBLIC_API_URL=https://harvardapi.codestacx.com
```

**Remember:** Restart `npm run dev` after changing!

---

## Backend Environment Variables

Backend environment variables are stored in `backend/.env`.

### Optional Variables

#### `GEMINI_API_KEY`

**Purpose:** Google Gemini API for transcript analysis  
**Required:** Only if using transcript rating feature  
**Get from:** [Google AI Studio](https://makersuite.google.com/app/apikey)

#### `DATABASE_URL`

**Purpose:** SQLite database path  
**Default:** `sqlite:///./transcripts.db` (relative path)  
**Note:** Automatically created if doesn't exist

---

## Environment Variable Best Practices

### ✅ Do's

- ✅ Use `NEXT_PUBLIC_` prefix for frontend variables
- ✅ Add fallback values in code: `process.env.VAR || "default"`
- ✅ Document all variables in `.env.example`
- ✅ Keep `.env.local` in `.gitignore`
- ✅ Restart dev server after env changes

### ❌ Don'ts

- ❌ Commit `.env.local` to git (contains secrets!)
- ❌ Use backend env variables in frontend code
- ❌ Forget the `NEXT_PUBLIC_` prefix for frontend vars
- ❌ Hardcode URLs directly in components

---

## Troubleshooting

### "process.env.NEXT_PUBLIC_API_URL is undefined"

**Cause:** Variable not prefixed with `NEXT_PUBLIC_` or dev server not restarted

**Solution:**

```bash
# 1. Check .env.local has correct prefix
NEXT_PUBLIC_API_URL=http://127.0.0.1:8001

# 2. Restart dev server
cd frontend
npm run dev
```

### "API calls failing with CORS errors"

**Cause:** Backend not running or wrong URL in env variable

**Solution:**

```bash
# 1. Check backend is running
curl http://127.0.0.1:8001/health

# 2. Verify .env.local URL matches backend port
NEXT_PUBLIC_API_URL=http://127.0.0.1:8001  # Check port!
```

### "Changes to .env.local not taking effect"

**Cause:** Next.js dev server caches environment variables

**Solution:**

```bash
# Stop dev server (Ctrl+C) and restart
npm run dev
```

---

## Deployment

### Vercel Deployment

Set environment variables in Vercel dashboard:

1. Go to Project Settings → Environment Variables
2. Add:
   - `NEXT_PUBLIC_API_URL` = `https://harvardapi.codestacx.com`
   - `NEXT_PUBLIC_VAPI_ASSISTANT_ID` = (your value)
   - `NEXT_PUBLIC_VAPI_PUBLIC_KEY` = (your value)
3. Redeploy

### Backend Deployment

Create `backend/.env` on server:

```bash
GEMINI_API_KEY=your_gemini_key_here
DATABASE_URL=sqlite:///./transcripts.db
```

---

## Quick Reference

| Variable                        | Scope    | Required | Default                            |
| ------------------------------- | -------- | -------- | ---------------------------------- |
| `NEXT_PUBLIC_API_URL`           | Frontend | Yes      | `https://harvardapi.codestacx.com` |
| `NEXT_PUBLIC_VAPI_ASSISTANT_ID` | Frontend | Yes      | -                                  |
| `NEXT_PUBLIC_VAPI_PUBLIC_KEY`   | Frontend | Yes      | -                                  |
| `GEMINI_API_KEY`                | Backend  | No       | -                                  |
| `DATABASE_URL`                  | Backend  | No       | `sqlite:///./transcripts.db`       |

---

**Need help?** Check the [TESTING_GUIDE.md](./TESTING_GUIDE.md) for detailed setup instructions.
