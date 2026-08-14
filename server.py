import os
from typing import Optional, List
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from config import GEMINI_API_KEY, DEFAULT_MODEL_NAME, AVAILABLE_MODELS, GRADE_LEVEL_TARGETS
from utils.text_helpers import extract_bytes_to_text
from modules.rag_engine import RAGEngine
from modules.style_engine import StyleEngine
from modules.originality_engine import OriginalityEngine
from modules.critique_engine import CritiqueEngine

app = FastAPI(
    title="Academic Writing & Comprehension API",
    description="Backend service powering RAG, Readability Transformation, Originality Auditing, and Essay Critique.",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows Vite dev server & production origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global State Container
class State:
    def __init__(self):
        self.api_key = GEMINI_API_KEY
        self.model_name = DEFAULT_MODEL_NAME
        self.rag_engine = RAGEngine(self.api_key, self.model_name)
        self.style_engine = StyleEngine(self.api_key, self.model_name)
        self.originality_engine = OriginalityEngine()
        self.critique_engine = CritiqueEngine(self.api_key, self.model_name)
        self.indexed_files = set()

state = State()

# Pydantic Schemas
class ConfigRequest(BaseModel):
    api_key: Optional[str] = None
    model_name: Optional[str] = None

class IngestTextRequest(BaseModel):
    text: str
    doc_name: Optional[str] = "Pasted_Reference"

class RagQueryRequest(BaseModel):
    query: str

class StyleTransformRequest(BaseModel):
    text: str
    tone: str = "Academic / Formal"
    reading_level: str = "High School (Grades 9-12)"
    length: str = "Maintain Original"
    custom_instruction: Optional[str] = ""

class OriginalityAuditRequest(BaseModel):
    source_text: str
    target_text: str
    ngram_size: int = 5

class CritiqueRequest(BaseModel):
    essay_draft: str
    academic_level: str = "Undergraduate"

# Endpoints
@app.get("/api/health")
def health():
    return {"status": "ok", "service": "Academic Intelligence API"}

@app.get("/api/stats")
def get_stats():
    return {
        "api_key_connected": bool(state.api_key),
        "model_name": state.model_name,
        "available_models": AVAILABLE_MODELS,
        "active_chunks": len(state.rag_engine.chunks),
        "indexed_files": list(state.indexed_files),
        "indexed_files_count": len(state.indexed_files),
        "grade_level_targets": list(GRADE_LEVEL_TARGETS.keys())
    }

@app.post("/api/config")
def update_config(req: ConfigRequest):
    if req.api_key is not None:
        state.api_key = req.api_key.strip()
        state.rag_engine.set_api_key(state.api_key)
        state.style_engine.set_api_key(state.api_key)
        state.critique_engine.set_api_key(state.api_key)

    if req.model_name and req.model_name in AVAILABLE_MODELS:
        state.model_name = req.model_name
        state.rag_engine.model_name = req.model_name
        state.style_engine.model_name = req.model_name
        state.critique_engine.model_name = req.model_name

    return get_stats()

@app.post("/api/rag/ingest-file")
async def ingest_file(file: UploadFile = File(...)):
    try:
        content = await file.read()
        extracted_text = extract_bytes_to_text(content, file.filename)
        if not extracted_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract readable text from uploaded file.")
        
        num_chunks = state.rag_engine.ingest_document(extracted_text, file.filename)
        state.indexed_files.add(file.filename)
        return {
            "filename": file.filename,
            "num_chunks": num_chunks,
            "total_chunks": len(state.rag_engine.chunks)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/rag/ingest-text")
def ingest_text(req: IngestTextRequest):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Text content cannot be empty.")
    
    num_chunks = state.rag_engine.ingest_document(req.text, req.doc_name)
    state.indexed_files.add(req.doc_name)
    return {
        "doc_name": req.doc_name,
        "num_chunks": num_chunks,
        "total_chunks": len(state.rag_engine.chunks)
    }

@app.post("/api/rag/query")
def rag_query(req: RagQueryRequest):
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    
    res = state.rag_engine.generate_grounded_answer(req.query)
    return res

@app.delete("/api/rag/memory")
def clear_memory():
    state.rag_engine.clear_index()
    state.indexed_files.clear()
    return {"message": "Vector memory cleared.", "total_chunks": 0}

@app.post("/api/style/transform")
def transform_style(req: StyleTransformRequest):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Text input cannot be empty.")
    
    res = state.style_engine.transform_style(
        req.text,
        tone=req.tone,
        reading_level=req.reading_level,
        length_option=req.length,
        custom_instructions=req.custom_instruction or ""
    )
    return res

@app.post("/api/originality/audit")
def audit_originality(req: OriginalityAuditRequest):
    if not req.source_text.strip() or not req.target_text.strip():
        raise HTTPException(status_code=400, detail="Both source and target text must be provided.")
    
    report = state.originality_engine.analyze_similarity(
        req.target_text,
        req.source_text,
        n_gram_size=req.ngram_size
    )
    return report

@app.post("/api/critique/review")
def review_essay(req: CritiqueRequest):
    if not req.essay_draft.strip():
        raise HTTPException(status_code=400, detail="Essay draft cannot be empty.")
    
    critique_markdown = state.critique_engine.review_essay(
        req.essay_draft,
        academic_level=req.academic_level
    )
    return {"critique": critique_markdown}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
