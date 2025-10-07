"""
LeetCode Problem Scraper using GraphQL API

This module handles scraping LeetCode problems via their unofficial GraphQL API.
It extracts problem details including title, description, examples, constraints,
difficulty, tags, and starter code.
"""

import requests
import json
import re
from typing import Dict, Any, Optional, List


# LeetCode GraphQL endpoint
LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql"


def extract_leetcode_slug(url: str) -> Optional[str]:
    """
    Extract the problem slug from a LeetCode URL.
    
    Args:
        url: LeetCode problem URL (e.g., https://leetcode.com/problems/two-sum/)
    
    Returns:
        Problem slug (e.g., 'two-sum') or None if invalid URL
    
    Examples:
        >>> extract_leetcode_slug("https://leetcode.com/problems/two-sum/")
        'two-sum'
        >>> extract_leetcode_slug("https://leetcode.com/problems/valid-parentheses/description/")
        'valid-parentheses'
    """
    # Pattern to match LeetCode problem URLs
    pattern = r'leetcode\.com/problems/([a-zA-Z0-9-]+)'
    match = re.search(pattern, url)
    
    if match:
        return match.group(1)
    return None


def scrape_leetcode_problem(leetcode_slug: str) -> Dict[str, Any]:
    """
    Scrape a LeetCode problem using the GraphQL API.
    
    Args:
        leetcode_slug: The problem slug (e.g., 'two-sum')
    
    Returns:
        Dictionary containing problem data:
        {
            'title': str,
            'description': str,
            'difficulty': str,  # 'Easy', 'Medium', or 'Hard'
            'details': {
                'examples': [{'input': str, 'output': str, 'explanation': str}],
                'constraints': [str]
            },
            'starter_codes': {'python': str, 'javascript': str, ...},
            'tags': [str]
        }
    
    Raises:
        Exception: If scraping fails or problem not found
    """
    
    # GraphQL query to fetch problem details
    query = """
    query getQuestionDetail($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        questionId
        title
        titleSlug
        content
        difficulty
        topicTags {
          name
        }
        codeSnippets {
          lang
          langSlug
          code
        }
        exampleTestcases
        sampleTestCase
      }
    }
    """
    
    variables = {
        "titleSlug": leetcode_slug
    }
    
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    
    try:
        # Make GraphQL request
        response = requests.post(
            LEETCODE_GRAPHQL_URL,
            json={"query": query, "variables": variables},
            headers=headers,
            timeout=10
        )
        response.raise_for_status()
        
        data = response.json()
        
        # Check if question exists
        if not data.get("data") or not data["data"].get("question"):
            raise Exception(f"Problem '{leetcode_slug}' not found on LeetCode")
        
        question = data["data"]["question"]
        
        # Parse the content (HTML description)
        description_html = question["content"]
        
        # Extract examples and constraints from HTML
        parsed_details = parse_problem_content(description_html)
        
        # Map language slugs to our supported languages
        language_map = {
            "python3": "python",
            "python": "python",
            "javascript": "javascript",
            "java": "java",
            "cpp": "cpp",
            "c++": "cpp",
            "golang": "go",
            "go": "go",
            "rust": "rust"
        }
        
        # Extract starter code for supported languages
        starter_codes = {}
        for snippet in question["codeSnippets"]:
            lang_slug = snippet["langSlug"].lower()
            if lang_slug in language_map:
                our_lang = language_map[lang_slug]
                # Only keep the first occurrence of each language
                if our_lang not in starter_codes:
                    starter_codes[our_lang] = snippet["code"]
        
        # Extract tags
        tags = [tag["name"] for tag in question["topicTags"]]
        
        # Build result
        result = {
            "title": question["title"],
            "description": description_html,  # Store full HTML for rich formatting
            "difficulty": question["difficulty"],
            "details": parsed_details,
            "starter_codes": starter_codes,
            "tags": tags,
            "leetcode_slug": leetcode_slug
        }
        
        print(f"✅ Successfully scraped problem: {question['title']}")
        return result
        
    except requests.exceptions.Timeout:
        raise Exception("Request to LeetCode timed out. Please try again.")
    except requests.exceptions.RequestException as e:
        raise Exception(f"Failed to fetch problem from LeetCode: {str(e)}")
    except Exception as e:
        raise Exception(f"Error scraping LeetCode problem: {str(e)}")


def parse_problem_content(html_content: str) -> Dict[str, Any]:
    """
    Parse the HTML content to extract examples and constraints.
    
    Args:
        html_content: HTML description from LeetCode
    
    Returns:
        Dictionary with 'examples' and 'constraints' lists
    """
    details = {
        "examples": [],
        "constraints": []
    }
    
    # Extract examples using regex
    # LeetCode format: <strong>Example 1:</strong> or <strong class="example">Example 1:</strong>
    example_pattern = r'<strong[^>]*>Example\s+\d+:?</strong>(.*?)(?=<strong[^>]*>Example\s+\d+:?</strong>|<strong[^>]*>Constraints:?</strong>|$)'
    example_matches = re.finditer(example_pattern, html_content, re.DOTALL | re.IGNORECASE)
    
    for match in example_matches:
        example_text = match.group(1)
        
        # Extract Input, Output, and Explanation
        input_match = re.search(r'<strong>Input:?</strong>\s*(.*?)(?=<strong>|$)', example_text, re.DOTALL)
        output_match = re.search(r'<strong>Output:?</strong>\s*(.*?)(?=<strong>|$)', example_text, re.DOTALL)
        explanation_match = re.search(r'<strong>Explanation:?</strong>\s*(.*?)(?=<strong>|$)', example_text, re.DOTALL)
        
        example = {
            "input": clean_html(input_match.group(1)) if input_match else "",
            "output": clean_html(output_match.group(1)) if output_match else "",
            "explanation": clean_html(explanation_match.group(1)) if explanation_match else ""
        }
        
        details["examples"].append(example)
    
    # Extract constraints
    constraints_pattern = r'<strong[^>]*>Constraints:?</strong>(.*?)(?=</?(?:p|div|strong)>|$)'
    constraints_match = re.search(constraints_pattern, html_content, re.DOTALL | re.IGNORECASE)
    
    if constraints_match:
        constraints_text = constraints_match.group(1)
        # Split by <li> tags or line breaks
        constraint_items = re.findall(r'<li>(.*?)</li>', constraints_text, re.DOTALL)
        
        if not constraint_items:
            # Fallback: split by line breaks
            constraint_items = [line.strip() for line in constraints_text.split('\n') if line.strip()]
        
        details["constraints"] = [clean_html(item) for item in constraint_items if clean_html(item)]
    
    return details


def clean_html(html: str) -> str:
    """
    Remove HTML tags and clean up text.
    
    Args:
        html: HTML string
    
    Returns:
        Clean text string
    """
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', html)
    
    # Replace HTML entities
    text = text.replace('&lt;', '<')
    text = text.replace('&gt;', '>')
    text = text.replace('&amp;', '&')
    text = text.replace('&quot;', '"')
    text = text.replace('&#39;', "'")
    text = text.replace('&nbsp;', ' ')
    
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    text = text.strip()
    
    return text


def validate_leetcode_url(url: str) -> bool:
    """
    Validate if a URL is a valid LeetCode problem URL.
    
    Args:
        url: URL to validate
    
    Returns:
        True if valid LeetCode URL, False otherwise
    """
    pattern = r'https?://leetcode\.com/problems/[a-zA-Z0-9-]+'
    return bool(re.match(pattern, url))


# Example usage for testing
if __name__ == "__main__":
    # Test with Two Sum problem
    test_slug = "two-sum"
    
    try:
        result = scrape_leetcode_problem(test_slug)
        print(f"\n📋 Problem: {result['title']}")
        print(f"🎯 Difficulty: {result['difficulty']}")
        print(f"🏷️ Tags: {', '.join(result['tags'])}")
        print(f"💻 Languages: {', '.join(result['starter_codes'].keys())}")
        print(f"📝 Examples: {len(result['details']['examples'])}")
        print(f"⚠️ Constraints: {len(result['details']['constraints'])}")
    except Exception as e:
        print(f"❌ Error: {e}")
