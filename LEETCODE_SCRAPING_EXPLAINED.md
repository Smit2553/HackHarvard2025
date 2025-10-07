# 🔍 How LeetCode Scraping Works (No API Key Required!)

## TL;DR

**We use LeetCode's unofficial public GraphQL API** - no authentication or API key needed! 🎉

---

## 🤔 Why No API Key?

### LeetCode's Public GraphQL Endpoint

LeetCode has a **public GraphQL API** at `https://leetcode.com/graphql` that anyone can use without authentication for:

- ✅ Reading problem details
- ✅ Getting starter code
- ✅ Viewing tags and difficulty
- ✅ Accessing examples (from problem descriptions)

**What you CAN'T do without auth:**

- ❌ Submit solutions
- ❌ View submission history
- ❌ Access premium problems
- ❌ View user-specific data

Since we only need to **read public problem information**, no API key is required!

---

## 🛠️ How Our Scraper Works

### Architecture

```
User pastes URL → Backend extracts slug → GraphQL query → Parse HTML → Save to DB
```

### Step-by-Step Process

#### 1. **Extract Problem Slug from URL**

```python
# User pastes: https://leetcode.com/problems/two-sum/
# We extract: "two-sum"

pattern = r'leetcode\.com/problems/([a-zA-Z0-9-]+)'
slug = extract_leetcode_slug(url)  # Returns: "two-sum"
```

#### 2. **Query LeetCode GraphQL API**

```python
LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql"

query = """
query getQuestionDetail($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    questionId
    title
    titleSlug
    content              # HTML description
    difficulty           # Easy/Medium/Hard
    topicTags {         # Array, Hash Table, etc.
      name
    }
    codeSnippets {      # Starter code in multiple languages
      lang
      langSlug
      code
    }
  }
}
"""

# Make POST request (NO AUTH REQUIRED!)
response = requests.post(
    LEETCODE_GRAPHQL_URL,
    json={"query": query, "variables": {"titleSlug": "two-sum"}},
    headers={"Content-Type": "application/json"}
)
```

#### 3. **Parse Response**

```python
data = response.json()

question = data["data"]["question"]
# {
#   "title": "Two Sum",
#   "difficulty": "Easy",
#   "content": "<p>Given an array...</p>",  # HTML
#   "topicTags": [{"name": "Array"}, {"name": "Hash Table"}],
#   "codeSnippets": [
#     {"langSlug": "python3", "code": "class Solution:\n    def twoSum..."}
#   ]
# }
```

#### 4. **Extract Examples and Constraints from HTML**

```python
# The 'content' field contains HTML like:
# <p><strong>Example 1:</strong></p>
# <pre>Input: nums = [2,7,11,15], target = 9
# Output: [0,1]</pre>

def parse_problem_content(html: str):
    # Use regex to extract examples
    example_pattern = r'<strong[^>]*>Example \d+:?</strong>.*?(?=<strong[^>]*>Example \d+|<strong[^>]*>Constraints|$)'

    # Extract constraints
    constraints_pattern = r'<strong[^>]*>Constraints:?</strong>(.*?)(?=</?ul>|<strong|$)'

    return {
        "examples": [...],      # Parsed examples
        "constraints": [...]    # Parsed constraints
    }
```

#### 5. **Map Languages to Our Format**

```python
language_map = {
    "python3": "python",
    "javascript": "javascript",
    "java": "java",
    "cpp": "cpp",
    "golang": "go",
    "rust": "rust"
}

# LeetCode returns "python3" → we store as "python"
starter_codes = {
    "python": "def twoSum(nums, target):\n    pass",
    "javascript": "var twoSum = function(nums, target) {\n    \n};",
    "java": "class Solution {\n    public int[] twoSum...",
    # etc.
}
```

#### 6. **Save to Database**

```python
save_problem(
    title="Two Sum",
    description="Given an array of integers...",
    difficulty="Easy",
    details={
        "examples": [...],
        "constraints": [...]
    },
    source="leetcode",
    leetcode_slug="two-sum",
    starter_codes=starter_codes,
    tags=["Array", "Hash Table"]
)
```

---

## 📋 What Data We Extract

| Field            | Source                                           | Example                                 |
| ---------------- | ------------------------------------------------ | --------------------------------------- |
| **Title**        | `question.title`                                 | "Two Sum"                               |
| **Description**  | `question.content` (HTML)                        | "Given an array of integers nums..."    |
| **Difficulty**   | `question.difficulty`                            | "Easy" / "Medium" / "Hard"              |
| **Examples**     | Parsed from HTML `<strong>Example 1:</strong>`   | Input/Output/Explanation                |
| **Constraints**  | Parsed from HTML `<strong>Constraints:</strong>` | "2 <= nums.length <= 10^4"              |
| **Starter Code** | `question.codeSnippets[].code`                   | Python, JavaScript, Java, C++, Go, Rust |
| **Tags**         | `question.topicTags[].name`                      | ["Array", "Hash Table"]                 |
| **Slug**         | `question.titleSlug`                             | "two-sum" (for caching)                 |

---

## 🔒 Is This Legal/Allowed?

### ✅ YES - Here's Why:

1. **Public API**: LeetCode's GraphQL endpoint is publicly accessible
2. **No Auth Required**: We're not bypassing any authentication
3. **Read-Only**: We're only reading public problem information
4. **Similar to Web Scraping**: Like viewing the website, just automated
5. **Educational Use**: Used for practice/learning (fair use)

### What We DON'T Do:

- ❌ Submit solutions programmatically
- ❌ Access premium/locked problems
- ❌ Bypass paywalls
- ❌ Store proprietary test cases
- ❌ Redistribute copyrighted content commercially

**Note**: LeetCode could block or rate-limit this API in the future, but currently it's widely used by the community.

---

## 🚦 Rate Limiting & Best Practices

### Our Implementation:

```python
# 1. Database caching (avoid re-scraping)
existing = get_problem_by_leetcode_slug(slug)
if existing:
    return existing  # Use cached version!

# 2. Timeout protection
response = requests.post(..., timeout=10)

# 3. User-Agent header (be a good citizen)
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
}
```

### Recommendations:

- ✅ **Cache aggressively**: We store in database to avoid repeated requests
- ✅ **Add delays**: If scraping many URLs in bulk (not implemented yet)
- ✅ **Handle errors gracefully**: Catch 429 rate limit errors
- ✅ **Respect robots.txt**: LeetCode allows GraphQL access

---

## 🆚 Alternatives (Why We Chose This)

### Option 1: Official LeetCode API (Doesn't Exist)

- ❌ LeetCode has no official public API
- ❌ Would require partnership/enterprise account

### Option 2: Web Scraping with BeautifulSoup

- ❌ More fragile (HTML structure changes)
- ❌ Slower (need to load full page)
- ❌ More likely to be blocked

### Option 3: GraphQL API (Our Choice) ✅

- ✅ Structured data (JSON)
- ✅ Fast and reliable
- ✅ Used by LeetCode's own frontend
- ✅ Less likely to break
- ✅ No authentication needed

---

## 🧪 Testing the Scraper

### Manual Test:

```bash
# Start Python REPL
cd backend
python

# Test scraping
from leetcode_scraper import scrape_leetcode_problem

problem = scrape_leetcode_problem("two-sum")
print(problem["title"])          # "Two Sum"
print(problem["difficulty"])     # "Easy"
print(problem["tags"])           # ["Array", "Hash Table"]
print(len(problem["starter_codes"]))  # 6+ languages
```

### Via API:

```bash
# Start backend
python -m uvicorn main:app --host 127.0.0.1 --port 8001

# Test scraping endpoint
curl -X POST http://127.0.0.1:8001/api/scrape_leetcode \
  -H "Content-Type: application/json" \
  -d '{"leetcode_url": "https://leetcode.com/problems/two-sum/"}'

# Response:
# {
#   "problem_id": 6,
#   "message": "Problem scraped and saved successfully",
#   "cached": false
# }
```

---

## 📦 Dependencies

```python
# requirements.txt
requests==2.32.5      # For HTTP requests to GraphQL API
```

**That's it!** No special API client libraries needed.

---

## 🔧 Environment Variables

### Backend `.env` (Optional)

```bash
# None required for LeetCode scraping!
# It's a public API with no authentication.

# Only if you want to customize:
# LEETCODE_API_URL=https://leetcode.com/graphql  (default)
# SCRAPER_TIMEOUT=10  (default 10 seconds)
```

### Why No API Key?

Because LeetCode's GraphQL endpoint is **completely public** for reading problem data!

---

## 🐛 Common Issues & Solutions

### Issue 1: "Problem not found"

**Cause**: Invalid slug or problem doesn't exist

**Solution**:

```python
# Check URL format
# ✅ Good: https://leetcode.com/problems/two-sum/
# ❌ Bad: https://leetcode.com/problems/twosum/
```

### Issue 2: Timeout errors

**Cause**: Slow network or LeetCode server issues

**Solution**: Retry with exponential backoff

```python
for attempt in range(3):
    try:
        return scrape_leetcode_problem(slug)
    except requests.Timeout:
        time.sleep(2 ** attempt)
```

### Issue 3: 403 Forbidden

**Cause**: Missing User-Agent header

**Solution**: Already implemented in our scraper!

```python
headers = {
    "User-Agent": "Mozilla/5.0 ..."
}
```

### Issue 4: Empty examples/constraints

**Cause**: HTML parsing failed

**Solution**: Check `parse_problem_content()` regex patterns

---

## 🔮 Future Improvements

### Potential Enhancements:

1. **Retry logic** with exponential backoff
2. **Bulk scraping** with rate limiting (e.g., scrape top 100 problems)
3. **Update detection** (check if problem changed on LeetCode)
4. **Premium problem detection** (return user-friendly error)
5. **Multiple language preference** (let user choose default starter code language)
6. **Test case extraction** (parse example test cases into runnable format)

---

## 📚 Learn More

### LeetCode GraphQL Explorer:

Visit: `https://leetcode.com/graphql`
Use browser DevTools → Network tab → Look for GraphQL requests

### Our Implementation:

- **Scraper**: `backend/leetcode_scraper.py`
- **API Endpoint**: `backend/scrape_endpoint.py`
- **Database Storage**: `backend/database.py`

---

## 🎉 Summary

**Q: Why no API key?**
**A: LeetCode's GraphQL API is public for reading problems!**

**Q: Is it reliable?**
**A: Yes! We cache in database to avoid repeated requests.**

**Q: Will it break?**
**A: Possible but unlikely. GraphQL is used by LeetCode's own site.**

**Q: Can we scrape premium problems?**
**A: No - those require authentication.**

---

**Bottom line**: We're using LeetCode's own public infrastructure, just like their website does. No hacks, no secrets, just clever use of publicly available data! 🚀
