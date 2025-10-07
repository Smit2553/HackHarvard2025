"""
LeetCode Scraping API Endpoint

This module provides endpoints to scrape LeetCode problems and retrieve cached problems.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import database
from leetcode_scraper import (
    extract_leetcode_slug,
    scrape_leetcode_problem,
    validate_leetcode_url
)

router = APIRouter()


class ScrapeLeetCodeRequest(BaseModel):
    """Request model for scraping a LeetCode problem."""
    url: str


class ScrapeLeetCodeResponse(BaseModel):
    """Response model for scrape endpoint."""
    problem_id: int
    title: str
    cached: bool
    message: str


class ProblemResponse(BaseModel):
    """Response model for problem retrieval."""
    id: int
    title: str
    description: str
    difficulty: str
    details: dict
    starter_codes: dict
    tags: list
    source: str
    leetcode_slug: Optional[str] = None


@router.post("/api/scrape_leetcode", response_model=ScrapeLeetCodeResponse)
async def scrape_leetcode(request: ScrapeLeetCodeRequest):
    """
    Scrape a LeetCode problem from a URL or retrieve from cache.
    
    This endpoint:
    1. Validates the LeetCode URL
    2. Extracts the problem slug
    3. Checks if the problem exists in the database (cache)
    4. If cached, returns the cached problem ID
    5. If not cached, scrapes from LeetCode, saves to database, and returns new problem ID
    
    Args:
        request: ScrapeLeetCodeRequest with URL
    
    Returns:
        ScrapeLeetCodeResponse with problem_id and cache status
    
    Raises:
        HTTPException: If URL is invalid or scraping fails
    """
    url = request.url.strip()
    
    # Validate URL format
    if not validate_leetcode_url(url):
        raise HTTPException(
            status_code=400,
            detail="Invalid LeetCode URL. Expected format: https://leetcode.com/problems/problem-name/"
        )
    
    # Extract problem slug
    leetcode_slug = extract_leetcode_slug(url)
    if not leetcode_slug:
        raise HTTPException(
            status_code=400,
            detail="Could not extract problem slug from URL"
        )
    
    print(f"🔍 Processing LeetCode problem: {leetcode_slug}")
    
    # Check if problem exists in cache
    cached_problem = database.get_problem_by_leetcode_slug(leetcode_slug)
    
    if cached_problem:
        # Problem found in cache
        problem_id = cached_problem["id"]
        title = cached_problem["title"]
        
        # Update last_fetched_at timestamp
        database.update_problem_last_fetched(problem_id)
        
        print(f"✅ Found cached problem: {title} (ID: {problem_id})")
        
        return ScrapeLeetCodeResponse(
            problem_id=problem_id,
            title=title,
            cached=True,
            message=f"Retrieved cached problem: {title}"
        )
    
    # Problem not in cache - scrape from LeetCode
    try:
        print(f"🌐 Scraping problem from LeetCode: {leetcode_slug}")
        
        scraped_data = scrape_leetcode_problem(leetcode_slug)
        
        # Save to database
        problem_id = database.save_problem(
            title=scraped_data["title"],
            description=scraped_data["description"],
            difficulty=scraped_data["difficulty"],
            details=scraped_data["details"],
            source="leetcode",
            leetcode_slug=leetcode_slug,
            starter_codes=scraped_data["starter_codes"],
            tags=scraped_data["tags"]
        )
        
        print(f"✅ Scraped and saved problem: {scraped_data['title']} (ID: {problem_id})")
        
        return ScrapeLeetCodeResponse(
            problem_id=problem_id,
            title=scraped_data["title"],
            cached=False,
            message=f"Successfully scraped problem: {scraped_data['title']}"
        )
        
    except Exception as e:
        error_message = str(e)
        print(f"❌ Error scraping problem: {error_message}")
        
        raise HTTPException(
            status_code=500,
            detail=f"Failed to scrape LeetCode problem: {error_message}"
        )


@router.get("/api/problem/{problem_id}", response_model=ProblemResponse)
async def get_problem(problem_id: int):
    """
    Retrieve a problem by ID.
    
    This endpoint fetches a complete problem with all related data including
    starter code snippets and tags.
    
    Args:
        problem_id: The database ID of the problem
    
    Returns:
        ProblemResponse with complete problem data
    
    Raises:
        HTTPException: If problem not found
    """
    print(f"🔍 Fetching problem with ID: {problem_id}")
    
    problem = database.get_problem_by_id(problem_id)
    
    if not problem:
        raise HTTPException(
            status_code=404,
            detail=f"Problem with ID {problem_id} not found"
        )
    
    print(f"✅ Retrieved problem: {problem['title']}")
    
    return ProblemResponse(
        id=problem["id"],
        title=problem["title"],
        description=problem["description"],
        difficulty=problem["difficulty"],
        details=problem["details"],
        starter_codes=problem["starter_codes"],
        tags=problem["tags"],
        source=problem["source"],
        leetcode_slug=problem.get("leetcode_slug")
    )


@router.get("/api/problems/stats")
async def get_problems_stats():
    """
    Get statistics about cached problems.
    
    Returns:
        Dictionary with problem statistics
    """
    # This is a simple endpoint for monitoring/debugging
    # Could be expanded to return more detailed stats
    return {
        "status": "ok",
        "message": "Problem database is operational"
    }
