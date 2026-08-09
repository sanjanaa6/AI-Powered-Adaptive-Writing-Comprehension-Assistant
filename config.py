import os
from dotenv import load_dotenv

# Load environment variables from .env file if available
load_dotenv()

# Google Gemini API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Default LLM Model Name
DEFAULT_MODEL_NAME = "gemini-1.5-flash"

# Vector Store Path
CHROMA_PERSIST_DIR = os.path.join(os.path.dirname(__file__), "chroma_db")

# Chunking Parameters
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200

# Target Grade Levels mapping for Flesch-Kincaid
GRADE_LEVEL_TARGETS = {
    "Middle School (Grade 6-8)": 7.0,
    "High School (Grade 9-12)": 10.5,
    "Undergraduate (Grade 13-16)": 14.5,
    "Postgraduate / Academic": 17.0
}
