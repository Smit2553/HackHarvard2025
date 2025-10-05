"""
Gemini AI service for rating interview transcripts.
"""
import os
import enum
from typing import List, Optional
from pydantic import BaseModel, Field
from google import genai


class Grade(str, enum.Enum):
    """Letter grades from A+ to F"""
    A_PLUS = "A+"
    A = "A"
    A_MINUS = "A-"
    B_PLUS = "B+"
    B = "B"
    B_MINUS = "B-"
    C_PLUS = "C+"
    C = "C"
    C_MINUS = "C-"
    D = "D"
    F = "F"


class TranscriptRating(BaseModel):
    """Structured rating response from Gemini"""
    communication_grade: Grade = Field(description="Grade for communication skills - ability to clearly articulate thought process and approach")
    communication_feedback: str = Field(description="Detailed feedback on communication performance")
    
    problem_solving_grade: Grade = Field(description="Grade for problem solving - how effectively the problem was broken down and approached")
    problem_solving_feedback: str = Field(description="Detailed feedback on problem solving performance")
    
    implementation_grade: Grade = Field(description="Grade for implementation - code quality, correctness, and attention to edge cases")
    implementation_feedback: str = Field(description="Detailed feedback on implementation performance")
    
    overall_comments: str = Field(description="Overall assessment and key takeaways")
    strengths: List[str] = Field(description="List of 2-3 key strengths demonstrated")


class ImprovementPoints(BaseModel):
    """Structured improvement points response from Gemini"""
    points: List[str] = Field(
        description="List of 3 specific and actionable improvement points for the candidate.",
        min_items=3,
        max_items=3
    )


class GeminiRatingService:
    """Service to rate interview transcripts using Gemini AI"""
    
    def __init__(self, api_key: Optional[str] = None):
        """Initialize the Gemini client"""
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY environment variable not set")
        
        self.client = genai.Client(api_key=self.api_key)
        self.model = 'gemini-2.5-flash'
    
    def format_transcript_for_rating(self, transcript: List[dict], metadata: Optional[dict] = None) -> str:
        """
        Format transcript data into a readable string for Gemini.
        
        Args:
            transcript: List of transcript segments
            metadata: Optional metadata about the interview
            
        Returns:
            Formatted string representation of the transcript
        """
        formatted = []
        
        # Add metadata if available
        if metadata:
            formatted.append("=== INTERVIEW CONTEXT ===")
            if 'problemTitle' in metadata:
                formatted.append(f"Problem: {metadata['problemTitle']}")
            if 'problemType' in metadata:
                formatted.append(f"Difficulty: {metadata['problemType']}")
            if 'language' in metadata:
                formatted.append(f"Language: {metadata['language']}")
            if 'duration' in metadata:
                formatted.append(f"Duration: {metadata['duration']:.1f} seconds")
            formatted.append("")
        
        formatted.append("=== INTERVIEW TRANSCRIPT ===")
        
        # Format each transcript segment
        for segment in transcript:
            seg_type = segment.get('type')
            
            if seg_type == 'call-start':
                formatted.append("[INTERVIEW STARTED]")
            elif seg_type == 'call-end':
                formatted.append(f"[INTERVIEW ENDED after {segment.get('secondsSinceStart', 0):.1f}s]")
            elif seg_type == 'transcript':
                role = segment.get('role', 'unknown')
                text = segment.get('text', '')
                seconds = segment.get('secondsSinceStart', 0)
                
                # Format as conversation
                speaker = "INTERVIEWER" if role == "assistant" else "CANDIDATE"
                formatted.append(f"[{seconds:6.1f}s] {speaker}: {text}")
        
        return "\n".join(formatted)

    def generate_improvement_points(self, transcript: List[dict], metadata: Optional[dict] = None) -> ImprovementPoints:
        """
        Generate 3 improvement points for an interview transcript using Gemini AI.
        
        Args:
            transcript: List of transcript segments from the interview
            metadata: Optional metadata about the interview
            
        Returns:
            ImprovementPoints object with a list of suggestions.
        """
        formatted_transcript = self.format_transcript_for_rating(transcript, metadata)
        
        prompt = f"""You are an expert technical interviewer providing feedback on a coding interview.
Based on the following transcript, provide exactly three specific and actionable improvement points for the candidate.
Focus on areas where they could have performed better in communication, problem-solving, or implementation.

{formatted_transcript}

Return a list of three strings, each being a concrete suggestion for improvement."""

        try:
            # Call Gemini API with structured output
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
                config={
                    'response_mime_type': 'application/json',
                    'response_schema': ImprovementPoints,
                }
            )
            
            # Parse the response
            import json
            if not response.text:
                raise ValueError("Empty response from Gemini API for improvement points")
            improvement_data = json.loads(response.text)
            return ImprovementPoints(**improvement_data)
            
        except Exception as e:
            print(f"Error generating improvement points with Gemini: {str(e)}")
            raise

    def rate_transcript(self, transcript: List[dict], metadata: Optional[dict] = None) -> TranscriptRating:
        """
        Rate an interview transcript using Gemini AI.
        
        Args:
            transcript: List of transcript segments from the interview
            metadata: Optional metadata about the interview
            
        Returns:
            TranscriptRating object with grades and feedback
        """
        # Format the transcript
        formatted_transcript = self.format_transcript_for_rating(transcript, metadata)
        
        # Create the prompt
        prompt = f"""You are an expert technical interviewer evaluating a coding interview transcript.

{formatted_transcript}

Please evaluate this interview transcript and provide detailed ratings in THREE categories:

1. **COMMUNICATION** - Evaluate how clearly the candidate articulated their thought process:
   - Do they explain their approach before coding?
   - Do they communicate assumptions and constraints?
   - Do they ask clarifying questions?
   - Is their explanation clear and well-structured?

2. **PROBLEM SOLVING** - Evaluate how effectively they approached the problem:
   - Do they break down the problem into manageable parts?
   - Do they consider multiple approaches?
   - Do they analyze time/space complexity?
   - Do they identify edge cases?

3. **IMPLEMENTATION** - Evaluate code quality and correctness:
   - Is the code syntactically correct?
   - Does it handle edge cases?
   - Is it well-structured and readable?
   - Are variable names meaningful?
   - Does it solve the problem correctly?

For each category, provide:
- A letter grade (A+, A, A-, B+, B, B-, C+, C, C-, D, or F)
- Specific, actionable feedback

Also provide:
- Overall comments summarizing the interview
- 2-3 key strengths demonstrated

Be constructive but honest in your assessment. Focus on specific examples from the transcript."""

        try:
            # Call Gemini API with structured output
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
                config={
                    'response_mime_type': 'application/json',
                    'response_schema': TranscriptRating,
                }
            )
            
            # Parse the response
            import json
            if not response.text:
                raise ValueError("Empty response from Gemini API")
            rating_data = json.loads(response.text)
            return TranscriptRating(**rating_data)
            
        except Exception as e:
            print(f"Error rating transcript with Gemini: {str(e)}")
            raise


# Singleton instance
_rating_service: Optional[GeminiRatingService] = None


def get_rating_service() -> GeminiRatingService:
    """Get or create the Gemini rating service singleton"""
    global _rating_service
    if _rating_service is None:
        _rating_service = GeminiRatingService()
    return _rating_service
