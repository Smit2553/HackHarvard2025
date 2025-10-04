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
            created_at TEXT NOT NULL
        )
    """)
    
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
               metadata, created_at
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
        "created_at": row[6]
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
               metadata, created_at
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
            "created_at": row[6]
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
               metadata, created_at
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
        "created_at": row[6]
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


# Initialize database on import
init_db()
