from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Literal
from datetime import datetime
import database
from gemini_rating_service import get_rating_service, TranscriptRating

router = APIRouter()


class TranscriptSegment(BaseModel):
    type: Literal["transcript", "call-start", "call-end"]
    role: Optional[Literal["user", "assistant"]] = None
    text: Optional[str] = None
    timestamp: str
    secondsSinceStart: float


class TranscriptRequest(BaseModel):
    transcript: List[TranscriptSegment]
    metadata: Optional[dict] = None


@router.post("/api/transcript")
async def receive_transcript(request: TranscriptRequest):
    """
    POST endpoint to receive call transcript from frontend.
    
    Expected JSON payload:
    {
        "transcript": [
            {
                "type": "call-start",
                "timestamp": "2025-10-04T12:00:00.000Z",
                "secondsSinceStart": 0
            },
            {
                "type": "transcript",
                "role": "user",
                "text": "Hello, I need help with this problem",
                "timestamp": "2025-10-04T12:00:05.000Z",
                "secondsSinceStart": 5.0
            },
            {
                "type": "transcript",
                "role": "assistant",
                "text": "I'd be happy to help you",
                "timestamp": "2025-10-04T12:00:08.000Z",
                "secondsSinceStart": 8.0
            },
            {
                "type": "call-end",
                "timestamp": "2025-10-04T12:05:00.000Z",
                "secondsSinceStart": 300.0
            }
        ],
        "metadata": {
            "userId": "optional-user-id",
            "sessionId": "optional-session-id"
        }
    }
    
    Returns:
    {
        "status": "success",
        "message": "Transcript received",
        "segments_count": <number of transcript segments>,
        "call_duration": <duration in seconds>,
        "transcript_summary": {
            "user_messages": <count>,
            "assistant_messages": <count>
        }
    }
    """
    try:
        if not request.transcript or len(request.transcript) == 0:
            raise HTTPException(status_code=400, detail="Transcript cannot be empty")
        
        # Extract statistics
        user_messages = sum(1 for seg in request.transcript if seg.type == "transcript" and seg.role == "user")
        assistant_messages = sum(1 for seg in request.transcript if seg.type == "transcript" and seg.role == "assistant")
        
        # Get call duration from the last segment
        call_duration = request.transcript[-1].secondsSinceStart if request.transcript else 0
        
        if request.metadata:
            print(f"Metadata: {request.metadata}")
        
        print(f"\nTranscript content:")
        for segment in request.transcript:
            if segment.type == "call-start":
                print(f"  [START] {segment.timestamp}")
            elif segment.type == "call-end":
                print(f"  [END] {segment.timestamp} (Duration: {segment.secondsSinceStart:.2f}s)")
            elif segment.type == "transcript":
                print(f"  [{segment.secondsSinceStart:6.2f}s] {segment.role:9s}: {segment.text}")
        
        print(f"{'='*60}\n")
        
        # Save to database
        transcript_dict = [seg.dict() for seg in request.transcript]
        transcript_id = database.save_transcript(
            transcript=transcript_dict,
            call_duration=call_duration,
            user_messages=user_messages,
            assistant_messages=assistant_messages,
            metadata=request.metadata
        )
        
        # Automatically rate the transcript with Gemini AI
        ratings_dict = None
        try:
            print(f"\n{'='*60}")
            print(f"🤖 Auto-rating transcript ID: {transcript_id}")
            print(f"   Duration: {call_duration:.1f}s")
            print(f"   Messages: {user_messages} user, {assistant_messages} assistant")
            
            rating_service = get_rating_service()
            print(f"   Sending to Gemini API for rating...")
            
            rating = rating_service.rate_transcript(
                transcript=transcript_dict,
                metadata=request.metadata
            )
            
            # Save ratings to database
            ratings_dict = rating.dict()
            database.save_ratings(transcript_id, ratings_dict)
            
            print(f"   ✅ Auto-rating complete and saved!")
            print(f"   Communication: {rating.communication_grade}")
            print(f"   Problem Solving: {rating.problem_solving_grade}")
            print(f"   Implementation: {rating.implementation_grade}")
            print(f"{'='*60}\n")
            
        except Exception as rating_error:
            print(f"⚠️  Warning: Failed to auto-rate transcript: {str(rating_error)}")
            print(f"   Transcript saved but ratings not available")
            # Continue even if rating fails - transcript is still saved
        
        response_data = {
            "status": "success",
            "message": "Transcript received and saved to database",
            "transcript_id": transcript_id,
            "segments_count": len(request.transcript),
            "call_duration": call_duration,
            "transcript_summary": {
                "user_messages": user_messages,
                "assistant_messages": assistant_messages
            },
            "ratings": ratings_dict,
            "auto_rated": ratings_dict is not None
        }
        
        return response_data
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error processing transcript: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing transcript: {str(e)}")


@router.get("/api/transcripts")
async def get_all_transcripts():
    """
    GET endpoint to retrieve all transcripts.
    
    Returns:
    [
        {
            "id": 2,
            "transcript": [...],
            "call_duration": 300.0,
            "user_messages": 5,
            "assistant_messages": 5,
            "metadata": {...},
            "created_at": "2025-10-04T12:00:00"
        },
        {...}
    ]
    """
    try:
        transcripts = database.get_all_transcripts()
        return transcripts
        
    except Exception as e:
        print(f"Error retrieving transcripts: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving transcripts: {str(e)}")


@router.get("/api/transcript/latest")
async def get_latest_transcript():
    """
    GET endpoint to retrieve the most recent transcript.
    
    Returns:
    {
        "id": 5,
        "transcript": [...],
        "call_duration": 300.0,
        "user_messages": 5,
        "assistant_messages": 5,
        "metadata": {...},
        "created_at": "2025-10-04T12:00:00"
    }
    """
    try:
        transcript = database.get_latest_transcript()
        
        if not transcript:
            raise HTTPException(status_code=404, detail="No transcripts found")
        
        return transcript
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error retrieving latest transcript: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving latest transcript: {str(e)}")


@router.get("/api/transcript/{transcript_id}")
async def get_transcript(transcript_id: int):
    """
    GET endpoint to retrieve a specific transcript by ID.
    
    Returns:
    {
        "id": 1,
        "transcript": [...],
        "call_duration": 300.0,
        "user_messages": 5,
        "assistant_messages": 5,
        "metadata": {...},
        "created_at": "2025-10-04T12:00:00"
    }
    """
    try:
        transcript = database.get_transcript(transcript_id)
        
        if not transcript:
            raise HTTPException(status_code=404, detail=f"Transcript with ID {transcript_id} not found")
        
        return transcript
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error retrieving transcript: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving transcript: {str(e)}")


@router.delete("/api/transcript/{transcript_id}")
async def delete_transcript(transcript_id: int):
    """
    DELETE endpoint to remove a transcript by ID.
    
    Returns:
    {
        "status": "success",
        "message": "Transcript deleted",
        "transcript_id": 1
    }
    """
    try:
        deleted = database.delete_transcript(transcript_id)
        
        if not deleted:
            raise HTTPException(status_code=404, detail=f"Transcript with ID {transcript_id} not found")
        
        return {
            "status": "success",
            "message": "Transcript deleted",
            "transcript_id": transcript_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting transcript: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting transcript: {str(e)}")


@router.get("/api/transcript/health")
async def transcript_health():
    """Health check for transcript endpoint"""
    return {"status": "healthy", "endpoint": "transcript"}


@router.get("/api/transcript/{transcript_id}/improvements")
async def get_improvement_points(transcript_id: int):
    """
    GET endpoint to generate and retrieve 3 improvement points for a specific transcript.
    """
    try:
        # Retrieve the transcript from the database
        transcript_data = database.get_transcript(transcript_id)
        if not transcript_data:
            raise HTTPException(status_code=404, detail=f"Transcript with ID {transcript_id} not found")

        # Initialize the Gemini service
        rating_service = get_rating_service()

        # Generate improvement points
        improvement_points = rating_service.generate_improvement_points(
            transcript=transcript_data['transcript'],
            metadata=transcript_data.get('metadata')
        )

        return improvement_points.dict()

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error generating improvement points for transcript {transcript_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating improvement points: {str(e)}")
