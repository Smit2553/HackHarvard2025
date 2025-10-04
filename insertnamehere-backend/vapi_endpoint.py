from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any

router = APIRouter()


class VapiWebhookRequest(BaseModel):
    transcript: str
    code_context: Optional[Dict[str, str]] = None  # expects {'code': '<entire code as string>'}


@router.post("/api/vapi_webhook")
async def vapi_webhook(request: VapiWebhookRequest):
    """
    POST endpoint to receive VAPI webhook data.
    
    Expected JSON payload:
    {
        "transcript": "speech-to-text output string",
        "code_context": {
            "code": "<entire code as string>"
        }
    }
    """
    try:
        if not request.transcript or not request.transcript.strip():
            raise HTTPException(status_code=400, detail="Transcript cannot be empty")
        
        response_data = {
            "status": "success",
            "message": "Webhook received successfully",
            "received": {
                "transcript": request.transcript,
                "code_context": request.code_context,
            }
        }
        
        return response_data
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
