from fastapi import APIRouter
import random
from database import get_all_problems

router = APIRouter()

# NOTE: The hardcoded LEETCODE_PROBLEMS list below is now deprecated.
# These problems have been migrated to the database as source='socratic'.
# The /api/leetcode endpoint now queries the database for ALL problems
# (both socratic and user-scraped leetcode problems).

# List of 5 LeetCode problems (DEPRECATED - kept for reference only)

@router.get("/api/leetcode")
async def get_random_leetcode_problem():
    """
    Returns a random problem from the database.
    This includes BOTH the original 5 Socratic problems AND any user-scraped LeetCode problems.
    """
    # Get all problems from database (socratic + leetcode sources)
    all_problems = get_all_problems()
    
    
    
    # Pick a random problem from the database
    random_problem = random.choice(all_problems)
    
    # Transform database format to match the original API response format
    # This ensures frontend compatibility
    return {
        "id": random_problem["id"],
        "title": random_problem["title"],
        "type": random_problem.get("tags", ["General"])[0].lower() if random_problem.get("tags") else "general",
        "description": random_problem["description"],
        "example_test_case": random_problem["details"].get("examples", [{}])[0] if random_problem["details"].get("examples") else {},
        "expected_solution": random_problem["details"].get("expected_solution", ""),
        "starter_code": random_problem["starter_codes"].get("python", "# No starter code available"),
        "difficulty": random_problem["difficulty"],
        "tags": random_problem.get("tags", []),
        "source": random_problem.get("source", "unknown")
    }

