import sqlite3
import json
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any, Optional

# Database file path
DB_PATH = Path(__file__).parent / "transcripts.db"


def init_db():
    """Initialize the database and create tables if they don't exist."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create transcripts table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS transcripts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            transcript_data TEXT NOT NULL,
            call_duration REAL,
            user_messages INTEGER,
            assistant_messages INTEGER,
            metadata TEXT,
            ratings TEXT,
            rated_at TEXT,
            created_at TEXT NOT NULL
        )
    """)
    
    # Create problems table (core problem data)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS problems (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source TEXT NOT NULL DEFAULT 'socratic',
            leetcode_slug TEXT UNIQUE,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            details TEXT NOT NULL DEFAULT '{}',
            difficulty TEXT NOT NULL,
            created_at TEXT NOT NULL,
            last_fetched_at TEXT,
            CHECK (source IN ('socratic', 'leetcode')),
            CHECK (difficulty IN ('Easy', 'Medium', 'Hard'))
        )
    """)
    
    # Create starter_code_snippets table (one-to-many with problems)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS starter_code_snippets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            problem_id INTEGER NOT NULL,
            language TEXT NOT NULL,
            code TEXT NOT NULL,
            FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE,
            CHECK (language IN ('python', 'javascript', 'java', 'cpp', 'go', 'rust'))
        )
    """)
    
    # Create tags table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tags (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL
        )
    """)
    
    # Create problem_tags join table (many-to-many)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS problem_tags (
            problem_id INTEGER NOT NULL,
            tag_id INTEGER NOT NULL,
            PRIMARY KEY (problem_id, tag_id),
            FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE,
            FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
        )
    """)
    
    # Create indexes for performance
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_problems_leetcode_slug ON problems(leetcode_slug)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_starter_code_problem_id ON starter_code_snippets(problem_id)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_problem_tags_problem_id ON problem_tags(problem_id)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_problem_tags_tag_id ON problem_tags(tag_id)")
    
    conn.commit()
    conn.close()
    print(f"✅ Database initialized at {DB_PATH}")


def save_transcript(
    transcript: List[Dict[str, Any]],
    call_duration: float,
    user_messages: int,
    assistant_messages: int,
    metadata: Optional[Dict[str, Any]] = None
) -> int:
    """
    Save a transcript to the database.
    
    Args:
        transcript: List of transcript segments
        call_duration: Total call duration in seconds
        user_messages: Number of user messages
        assistant_messages: Number of assistant messages
        metadata: Optional metadata dictionary
    
    Returns:
        The ID of the newly created transcript record
    """
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    transcript_json = json.dumps(transcript)
    metadata_json = json.dumps(metadata) if metadata else None
    created_at = datetime.now().isoformat()
    
    cursor.execute("""
        INSERT INTO transcripts 
        (transcript_data, call_duration, user_messages, assistant_messages, metadata, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (transcript_json, call_duration, user_messages, assistant_messages, metadata_json, created_at))
    
    transcript_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    if transcript_id is None:
        raise Exception("Failed to get transcript ID")
    
    print(f"💾 Saved transcript with ID: {transcript_id}")
    return transcript_id


def get_transcript(transcript_id: int) -> Optional[Dict[str, Any]]:
    """
    Retrieve a transcript by ID.
    
    Args:
        transcript_id: The ID of the transcript to retrieve
    
    Returns:
        Dictionary containing transcript data or None if not found
    """
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT id, transcript_data, call_duration, user_messages, assistant_messages, 
               metadata, ratings, rated_at, created_at
        FROM transcripts
        WHERE id = ?
    """, (transcript_id,))
    
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        return None
    
    return {
        "id": row[0],
        "transcript": json.loads(row[1]),
        "call_duration": row[2],
        "user_messages": row[3],
        "assistant_messages": row[4],
        "metadata": json.loads(row[5]) if row[5] else None,
        "ratings": json.loads(row[6]) if row[6] else None,
        "rated_at": row[7],
        "created_at": row[8]
    }


def get_all_transcripts() -> List[Dict[str, Any]]:
    """
    Retrieve all transcripts from the database.
    
    Returns:
        List of transcript dictionaries
    """
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT id, transcript_data, call_duration, user_messages, assistant_messages, 
               metadata, ratings, rated_at, created_at
        FROM transcripts
        ORDER BY id DESC
    """)
    
    rows = cursor.fetchall()
    conn.close()
    
    transcripts = []
    for row in rows:
        transcripts.append({
            "id": row[0],
            "transcript": json.loads(row[1]),
            "call_duration": row[2],
            "user_messages": row[3],
            "assistant_messages": row[4],
            "metadata": json.loads(row[5]) if row[5] else None,
            "ratings": json.loads(row[6]) if row[6] else None,
            "rated_at": row[7],
            "created_at": row[8]
        })
    
    return transcripts


def get_latest_transcript() -> Optional[Dict[str, Any]]:
    """
    Get the most recently saved transcript.
    
    Returns:
        Dictionary containing transcript data or None if no transcripts exist
    """
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT id, transcript_data, call_duration, user_messages, assistant_messages, 
               metadata, ratings, rated_at, created_at
        FROM transcripts
        ORDER BY id DESC
        LIMIT 1
    """)
    
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        return None
    
    return {
        "id": row[0],
        "transcript": json.loads(row[1]),
        "call_duration": row[2],
        "user_messages": row[3],
        "assistant_messages": row[4],
        "metadata": json.loads(row[5]) if row[5] else None,
        "ratings": json.loads(row[6]) if row[6] else None,
        "rated_at": row[7],
        "created_at": row[8]
    }


def delete_transcript(transcript_id: int) -> bool:
    """
    Delete a transcript by ID.
    
    Args:
        transcript_id: The ID of the transcript to delete
    
    Returns:
        True if deleted, False if not found
    """
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM transcripts WHERE id = ?", (transcript_id,))
    deleted = cursor.rowcount > 0
    
    conn.commit()
    conn.close()
    
    return deleted


def save_ratings(transcript_id: int, ratings: Dict[str, Any]) -> bool:
    """
    Save ratings for a transcript.
    
    Args:
        transcript_id: The ID of the transcript to rate
        ratings: Dictionary containing the rating data
    
    Returns:
        True if successful, False if transcript not found
    """
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    ratings_json = json.dumps(ratings)
    rated_at = datetime.now().isoformat()
    
    cursor.execute("""
        UPDATE transcripts
        SET ratings = ?, rated_at = ?
        WHERE id = ?
    """, (ratings_json, rated_at, transcript_id))
    
    updated = cursor.rowcount > 0
    conn.commit()
    conn.close()
    
    if updated:
        print(f"💾 Saved ratings for transcript ID: {transcript_id}")
    
    return updated


def save_problem(
    title: str,
    description: str,
    difficulty: str,
    details: Dict[str, Any],
    source: str = "socratic",
    leetcode_slug: Optional[str] = None,
    starter_codes: Optional[Dict[str, str]] = None,
    tags: Optional[List[str]] = None
) -> int:
    """
    Save a problem to the database.
    
    Args:
        title: Problem title
        description: Problem description
        difficulty: Problem difficulty (Easy/Medium/Hard)
        details: JSON object containing examples, constraints, etc.
        source: Problem source ('socratic' or 'leetcode')
        leetcode_slug: LeetCode problem slug (e.g., 'two-sum')
        starter_codes: Dictionary of language -> starter code
        tags: List of tag names
    
    Returns:
        The ID of the newly created problem record
    """
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        details_json = json.dumps(details)
        created_at = datetime.now().isoformat()
        last_fetched_at = datetime.now().isoformat() if source == "leetcode" else None
        
        # Insert problem
        cursor.execute("""
            INSERT INTO problems 
            (source, leetcode_slug, title, description, details, difficulty, created_at, last_fetched_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (source, leetcode_slug, title, description, details_json, difficulty, created_at, last_fetched_at))
        
        problem_id = cursor.lastrowid
        
        if problem_id is None:
            raise Exception("Failed to get problem ID")
        
        # Insert starter code snippets
        if starter_codes:
            for language, code in starter_codes.items():
                cursor.execute("""
                    INSERT INTO starter_code_snippets (problem_id, language, code)
                    VALUES (?, ?, ?)
                """, (problem_id, language, code))
        
        # Insert tags
        if tags:
            for tag_name in tags:
                # Insert tag if it doesn't exist
                cursor.execute("""
                    INSERT OR IGNORE INTO tags (name) VALUES (?)
                """, (tag_name,))
                
                # Get tag ID
                cursor.execute("SELECT id FROM tags WHERE name = ?", (tag_name,))
                tag_id = cursor.fetchone()[0]
                
                # Link problem to tag
                cursor.execute("""
                    INSERT INTO problem_tags (problem_id, tag_id)
                    VALUES (?, ?)
                """, (problem_id, tag_id))
        
        conn.commit()
        print(f"💾 Saved problem '{title}' with ID: {problem_id}")
        return problem_id
        
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()


def get_problem_by_id(problem_id: int) -> Optional[Dict[str, Any]]:
    """
    Retrieve a problem by ID with all related data.
    
    Args:
        problem_id: The ID of the problem to retrieve
    
    Returns:
        Dictionary containing problem data with starter codes and tags
    """
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Get problem data
    cursor.execute("""
        SELECT id, source, leetcode_slug, title, description, details, 
               difficulty, created_at, last_fetched_at
        FROM problems
        WHERE id = ?
    """, (problem_id,))
    
    row = cursor.fetchone()
    if not row:
        conn.close()
        return None
    
    problem = {
        "id": row[0],
        "source": row[1],
        "leetcode_slug": row[2],
        "title": row[3],
        "description": row[4],
        "details": json.loads(row[5]),
        "difficulty": row[6],
        "created_at": row[7],
        "last_fetched_at": row[8]
    }
    
    # Get starter code snippets
    cursor.execute("""
        SELECT language, code
        FROM starter_code_snippets
        WHERE problem_id = ?
    """, (problem_id,))
    
    starter_codes = {}
    for lang_row in cursor.fetchall():
        starter_codes[lang_row[0]] = lang_row[1]
    problem["starter_codes"] = starter_codes
    
    # Get tags
    cursor.execute("""
        SELECT t.name
        FROM tags t
        JOIN problem_tags pt ON t.id = pt.tag_id
        WHERE pt.problem_id = ?
    """, (problem_id,))
    
    tags = [tag_row[0] for tag_row in cursor.fetchall()]
    problem["tags"] = tags
    
    conn.close()
    return problem


def get_problem_by_leetcode_slug(leetcode_slug: str) -> Optional[Dict[str, Any]]:
    """
    Retrieve a problem by LeetCode slug.
    
    Args:
        leetcode_slug: The LeetCode slug (e.g., 'two-sum')
    
    Returns:
        Dictionary containing problem data or None if not found
    """
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT id
        FROM problems
        WHERE leetcode_slug = ?
    """, (leetcode_slug,))
    
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        return None
    
    return get_problem_by_id(row[0])


def update_problem_last_fetched(problem_id: int) -> bool:
    """
    Update the last_fetched_at timestamp for a problem.
    
    Args:
        problem_id: The ID of the problem to update
    
    Returns:
        True if successful, False if problem not found
    """
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    last_fetched_at = datetime.now().isoformat()
    
    cursor.execute("""
        UPDATE problems
        SET last_fetched_at = ?
        WHERE id = ?
    """, (last_fetched_at, problem_id))
    
    updated = cursor.rowcount > 0
    conn.commit()
    conn.close()
    
    return updated


def get_all_problems() -> List[Dict[str, Any]]:
    """
    Retrieve all problems from the database (both socratic and leetcode sources).
    
    Returns:
        List of dictionaries containing problem data with starter codes and tags
    """
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Get all problems
    cursor.execute("""
        SELECT id, source, leetcode_slug, title, description, details, 
               difficulty, created_at, last_fetched_at
        FROM problems
    """)
    
    problems = []
    for row in cursor.fetchall():
        problem = {
            "id": row[0],
            "source": row[1],
            "leetcode_slug": row[2],
            "title": row[3],
            "description": row[4],
            "details": json.loads(row[5]),
            "difficulty": row[6],
            "created_at": row[7],
            "last_fetched_at": row[8]
        }
        
        # Get starter code snippets
        cursor.execute("""
            SELECT language, code
            FROM starter_code_snippets
            WHERE problem_id = ?
        """, (row[0],))
        
        starter_codes = {}
        for lang_row in cursor.fetchall():
            starter_codes[lang_row[0]] = lang_row[1]
        problem["starter_codes"] = starter_codes
        
        # Get tags
        cursor.execute("""
            SELECT t.name
            FROM tags t
            JOIN problem_tags pt ON t.id = pt.tag_id
            WHERE pt.problem_id = ?
        """, (row[0],))
        
        tags = [tag_row[0] for tag_row in cursor.fetchall()]
        problem["tags"] = tags
        
        problems.append(problem)
    
    conn.close()
    return problems


def migrate_hardcoded_problems():
    """
    Migrate the 5 hardcoded Socratic problems to the database.
    Only runs once - checks if problems already exist.
    """
    # Hardcoded problems from leetcode_endpoint.py
    SOCRATIC_PROBLEMS = [
        {
            "title": "Two Sum",
            "type": "arrays",
            "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
            "difficulty": "Easy",
            "details": {
                "examples": [
                    {
                        "input": "nums = [2,7,11,15], target = 9",
                        "output": "[0,1]",
                        "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."
                    }
                ],
                "expected_solution": "Use a hash map to store complements while iterating."
            },
            "starter_code": {
                "python": "def twoSum(nums, target):\n    # TODO: Implement solution\n    pass\n\n# Example usage:\n# print(twoSum([2,7,11,15], 9))  # Expected output: [0,1]\n"
            },
            "tags": ["Array", "Hash Table"]
        },
        {
            "title": "Valid Parentheses",
            "type": "strings",
            "description": "Determine if a string containing only (), {}, and [] is valid.",
            "difficulty": "Easy",
            "details": {
                "examples": [
                    {
                        "input": "s = \"()[]{}\"",
                        "output": "true",
                        "explanation": "All brackets are properly matched."
                    }
                ],
                "expected_solution": "Use a stack to validate parentheses order."
            },
            "starter_code": {
                "python": "def isValid(s):\n    # TODO: Implement validation logic\n    pass\n\n# Example usage:\n# print(isValid(\"()[]{}\"))  # Expected output: True\n"
            },
            "tags": ["String", "Stack"]
        },
        {
            "title": "Maximum Depth of Binary Tree",
            "type": "recursion",
            "description": "Return the maximum depth (height) of a binary tree.",
            "difficulty": "Easy",
            "details": {
                "examples": [
                    {
                        "input": "root = [3,9,20,null,null,15,7]",
                        "output": "3",
                        "explanation": "The maximum depth is 3."
                    }
                ],
                "expected_solution": "Use recursion: maxDepth = 1 + max(left, right)."
            },
            "starter_code": {
                "python": "class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef maxDepth(root):\n    # TODO: Implement recursive solution\n    pass\n\n# Example usage:\n# root = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))\n# print(maxDepth(root))  # Expected output: 3\n"
            },
            "tags": ["Tree", "Depth-First Search", "Binary Tree"]
        },
        {
            "title": "Reverse Linked List",
            "type": "linked-list",
            "description": "Reverse a singly linked list.",
            "difficulty": "Easy",
            "details": {
                "examples": [
                    {
                        "input": "head = [1,2,3,4,5]",
                        "output": "[5,4,3,2,1]",
                        "explanation": "The linked list is reversed."
                    }
                ],
                "expected_solution": "Iterate through and reverse node pointers."
            },
            "starter_code": {
                "python": "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef reverseList(head):\n    # TODO: Implement iterative reversal\n    pass\n\n# Example usage:\n# head = ListNode(1, ListNode(2, ListNode(3, ListNode(4, ListNode(5)))))\n# print(reverseList(head))  # Expected: 5 -> 4 -> 3 -> 2 -> 1\n"
            },
            "tags": ["Linked List", "Recursion"]
        },
        {
            "title": "Merge Two Sorted Lists",
            "type": "linked-list",
            "description": "Merge two sorted linked lists and return the head of the merged list.",
            "difficulty": "Easy",
            "details": {
                "examples": [
                    {
                        "input": "list1 = [1,2,4], list2 = [1,3,4]",
                        "output": "[1,1,2,3,4,4]",
                        "explanation": "Lists are merged in sorted order."
                    }
                ],
                "expected_solution": "Use dummy node and merge iteratively."
            },
            "starter_code": {
                "python": "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef mergeTwoLists(list1, list2):\n    # TODO: Implement merge logic\n    pass\n\n# Example usage:\n# list1 = ListNode(1, ListNode(2, ListNode(4)))\n# list2 = ListNode(1, ListNode(3, ListNode(4)))\n# print(mergeTwoLists(list1, list2))  # Expected: 1 -> 1 -> 2 -> 3 -> 4 -> 4\n"
            },
            "tags": ["Linked List", "Recursion"]
        }
    ]
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Check if any socratic problems already exist
    cursor.execute("SELECT COUNT(*) FROM problems WHERE source = 'socratic'")
    count = cursor.fetchone()[0]
    
    if count > 0:
        print(f"✅ Socratic problems already migrated ({count} found)")
        conn.close()
        return
    
    print("🔄 Migrating hardcoded Socratic problems to database...")
    
    migrated_count = 0
    for problem in SOCRATIC_PROBLEMS:
        try:
            save_problem(
                title=problem["title"],
                description=problem["description"],
                difficulty=problem["difficulty"],
                details=problem["details"],
                source="socratic",
                leetcode_slug=None,
                starter_codes=problem["starter_code"],
                tags=problem["tags"]
            )
            migrated_count += 1
            print(f"  ✅ Migrated: {problem['title']}")
        except Exception as e:
            print(f"  ❌ Failed to migrate {problem['title']}: {e}")
    
    conn.close()
    print(f"✅ Migration complete! {migrated_count}/{len(SOCRATIC_PROBLEMS)} problems migrated")


# Initialize database on import
init_db()
