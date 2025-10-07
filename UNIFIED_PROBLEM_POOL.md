# 🎲 Unified Problem Pool System

## Overview

The app now uses a **unified problem pool** that combines:

- ✅ **5 Original Socratic Problems** (hardcoded → migrated to database)
- ✅ **User-Scraped LeetCode Problems** (added via URL pasting feature)

All problems are stored in the **same SQLite database** and randomly selected together!

---

## 🔄 How It Works

### Before (Old System)

```
❌ Two separate systems:
   • Hardcoded Python list (5 problems) → /api/leetcode endpoint
   • SQLite database → /api/scrape_leetcode endpoint

❌ Random selection ONLY picked from hardcoded list
❌ Scraped problems were saved but never used in randomization
```

### After (New System)

```
✅ Single unified database:
   • problems table with 'source' column ('socratic' or 'leetcode')
   • Both sources stored in same table

✅ Random selection pulls from ENTIRE database
✅ When you scrape a URL → it's added to the randomization pool immediately!
```

---

## 📊 Database Structure

### Problems Table

```sql
CREATE TABLE problems (
    id INTEGER PRIMARY KEY,
    source TEXT NOT NULL,              -- 'socratic' or 'leetcode'
    leetcode_slug TEXT UNIQUE,         -- NULL for socratic, slug for leetcode
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    details TEXT NOT NULL,             -- JSON: examples, constraints, etc.
    difficulty TEXT NOT NULL,          -- 'Easy', 'Medium', 'Hard'
    created_at TEXT NOT NULL,
    last_fetched_at TEXT
)
```

### Example Records

| id  | source   | title                           | difficulty |
| --- | -------- | ------------------------------- | ---------- |
| 1   | socratic | Two Sum                         | Easy       |
| 2   | socratic | Valid Parentheses               | Easy       |
| 3   | socratic | Maximum Depth of Binary Tree    | Easy       |
| 4   | socratic | Reverse Linked List             | Easy       |
| 5   | socratic | Merge Two Sorted Lists          | Easy       |
| 6   | leetcode | Best Time to Buy and Sell Stock | Easy       |
| 7   | leetcode | Climbing Stairs                 | Easy       |

---

## 🚀 Migration Process

### Automatic Migration on Server Startup

When you start the backend server:

```bash
python -m uvicorn main:app --host 127.0.0.1 --port 8001
```

**What happens:**

1. ✅ `init_db()` creates tables if they don't exist
2. ✅ `@app.on_event("startup")` calls `migrate_hardcoded_problems()`
3. ✅ Function checks: "Are there any `source='socratic'` problems?"
   - **If YES**: Skip migration (already done)
   - **If NO**: Insert all 5 hardcoded problems into database
4. ✅ Server logs: `"✅ Socratic problems already migrated (5 found)"`

**This only runs ONCE!** Subsequent server restarts will skip migration.

---

## 🎯 API Endpoint Changes

### GET `/api/leetcode` (Updated)

**Before:**

```python
# Picked from hardcoded list only
random_problem = random.choice(LEETCODE_PROBLEMS)
return random_problem
```

**After:**

```python
# Picks from database (socratic + leetcode)
all_problems = get_all_problems()  # Queries database
random_problem = random.choice(all_problems)
return formatted_problem
```

**Response includes:**

- ✅ `source`: "socratic" or "leetcode" (new field!)
- ✅ `id`: Database ID for tracking
- ✅ All original fields (title, description, starter_code, etc.)

---

## 📝 User Flow Example

### Scenario: User Pastes LeetCode URL

1. **User action**: Paste `https://leetcode.com/problems/climbing-stairs/`
2. **Backend**:
   - Check database for `leetcode_slug='climbing-stairs'`
   - If not found → scrape LeetCode GraphQL API
   - Save to `problems` table with `source='leetcode'`
3. **Result**: Problem added to database with ID `6`

4. **Next random selection**:

   - Database now has: 5 socratic + 1 leetcode = **6 total**
   - Random selection: `random.choice([1,2,3,4,5,6])`
   - User could get any of the 6 problems!

5. **Paste another URL**: `https://leetcode.com/problems/best-time-to-buy-and-sell-stock/`
   - Added as ID `7`
   - Random selection: `random.choice([1,2,3,4,5,6,7])`

**The pool grows with every scraped problem!** 🎉

---

## 🧪 Testing Instructions

### Test 1: Verify Migration

```bash
# Start backend server
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8001

# Look for startup logs:
# 🚀 Starting up server...
# ✅ Socratic problems already migrated (5 found)
# ✅ Server ready!
```

### Test 2: Check Database

```bash
# Open SQLite database
sqlite3 transcripts.db

# Count socratic problems
SELECT COUNT(*) FROM problems WHERE source = 'socratic';
# Expected: 5

# List all problems
SELECT id, source, title FROM problems;
```

### Test 3: Test Random Selection (Before Scraping)

```bash
# Make 5 requests to random endpoint
curl http://127.0.0.1:8001/api/leetcode
curl http://127.0.0.1:8001/api/leetcode
curl http://127.0.0.1:8001/api/leetcode
curl http://127.0.0.1:8001/api/leetcode
curl http://127.0.0.1:8001/api/leetcode

# All should return socratic problems (source: "socratic")
```

### Test 4: Scrape a LeetCode Problem

1. Go to `http://localhost:3000/practice`
2. Paste URL: `https://leetcode.com/problems/two-sum/`
3. Click "Start Interview"
4. Check database:

```sql
SELECT id, source, title FROM problems WHERE source = 'leetcode';
-- Should show the scraped problem
```

### Test 5: Test Random Selection (After Scraping)

```bash
# Make 10 requests
for i in {1..10}; do curl http://127.0.0.1:8001/api/leetcode | jq '.source,.title'; done

# Should see MIX of:
# - "socratic" problems (original 5)
# - "leetcode" problems (user-scraped)
```

---

## 🔍 Troubleshooting

### "Still only getting hardcoded problems"

**Cause**: Server not restarted after code changes

**Solution**:

```bash
# Stop server (Ctrl+C in PowerShell)
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8001
```

### "Database shows 0 problems"

**Cause**: Migration not running

**Check**:

```python
# In database.py, verify init_db() is called
# At bottom of file:
init_db()  # Should be present
```

**Solution**:

```bash
# Delete database and restart server
rm transcripts.db
python -m uvicorn main:app --host 127.0.0.1 --port 8001
```

### "Scraped problems not appearing in random selection"

**Cause**: Frontend still hitting old hardcoded endpoint

**Check**:

```bash
# Verify frontend is calling correct URL
# In frontend/app/practice/page.tsx:
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://harvardapi.codestacx.com";
```

**Solution**: Restart Next.js dev server

```bash
cd frontend
npm run dev
```

---

## 📦 Database Location

**File**: `backend/transcripts.db`

**Persists**: Yes! Problems remain after server restart

**Backup**: Copy `transcripts.db` to back up all problems

---

## 🎓 Key Concepts

### Source Field

- `source='socratic'`: Original 5 problems (migrated from hardcoded list)
- `source='leetcode'`: User-scraped problems (from URL pasting feature)

### LeetCode Slug

- `leetcode_slug=NULL`: Socratic problems (no LeetCode URL)
- `leetcode_slug='two-sum'`: LeetCode problems (used for caching)

### Caching Logic

When user pastes URL:

1. Extract slug from URL: `https://leetcode.com/problems/two-sum/` → `two-sum`
2. Query: `SELECT * FROM problems WHERE leetcode_slug = 'two-sum'`
3. If found → return existing (FAST)
4. If not found → scrape API (SLOW) → save → return

**Avoids duplicate scraping!** ⚡

---

## 🚀 Production Deployment

When deploying to production:

1. **Database persistence**: Ensure `transcripts.db` is NOT deleted on deployment
2. **Migration runs once**: First startup will migrate socratic problems
3. **Volume mounting** (if using Docker):
   ```yaml
   volumes:
     - ./data:/app/backend/data
   ```
4. **Database path**: Update `DB_PATH` if needed

---

## 📊 Monitoring

### Check Pool Size

```bash
# Total problems
curl http://127.0.0.1:8001/api/problem_stats

# Or query database directly
sqlite3 transcripts.db "SELECT source, COUNT(*) FROM problems GROUP BY source"
```

Expected output:

```
socratic|5
leetcode|X  (X = number of scraped problems)
```

---

**Need help?** Check the [TESTING_GUIDE.md](./TESTING_GUIDE.md) for more testing instructions.
