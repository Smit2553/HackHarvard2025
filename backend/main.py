from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from vapi_endpoint import router as vapi_router
from leetcode_endpoint import router as leetcode_router
from transcript_endpoint import router as transcript_router
from scrape_endpoint import router as scrape_router
from database import migrate_hardcoded_problems
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Migrate hardcoded Socratic problems to database on startup
# This only runs once - subsequent startups will skip if problems already exist
@app.on_event("startup")
async def startup_event():
    print("🚀 Starting up server...")
    migrate_hardcoded_problems()
    print("✅ Server ready!")

# Include routers
app.include_router(vapi_router)
app.include_router(leetcode_router)
app.include_router(transcript_router)
app.include_router(scrape_router)

@app.get("/")
async def hello_world():
    return {"message": "Hello World"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
