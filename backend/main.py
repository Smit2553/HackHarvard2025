from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from vapi_endpoint import router as vapi_router
from leetcode_endpoint import router as leetcode_router
from transcript_endpoint import router as transcript_router

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(vapi_router)
app.include_router(leetcode_router)
app.include_router(transcript_router)

@app.get("/")
async def hello_world():
    return {"message": "Hello World"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
