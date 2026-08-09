import os
from dotenv import load_dotenv

# Load environment variables from .env file if available
load_dotenv()

def get_config_api_key() -> str:
    """Safely retrieves API key from Streamlit secrets or environment variables."""
    key = ""
    try:
        import streamlit as st
        if hasattr(st, "secrets") and "GEMINI_API_KEY" in st.secrets:
            key = st.secrets["GEMINI_API_KEY"]
    except Exception:
        pass
        
    if not key:
        key = os.getenv("GEMINI_API_KEY", "")
    return key

GEMINI_API_KEY = get_config_api_key()

# Default LLM Model Name
DEFAULT_MODEL_NAME = "gemini-2.5-flash"

# Available Models List
AVAILABLE_MODELS = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-2.5-pro",
    "gemini-1.5-pro"
]

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
