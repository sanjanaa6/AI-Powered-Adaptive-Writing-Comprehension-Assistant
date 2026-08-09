import os
try:
    from google import genai
    USE_NEW_GENAI = True
except ImportError:
    import google.generativeai as genai
    USE_NEW_GENAI = False

try:
    from langchain_text_splitters import RecursiveCharacterTextSplitter
except ImportError:
    from langchain.text_splitter import RecursiveCharacterTextSplitter
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class RAGEngine:
    def __init__(self, api_key: str, model_name: str = "gemini-1.5-flash"):
        self.api_key = api_key
        self.model_name = model_name
        self.client = None
        self.model = None
        
        if api_key:
            self.set_api_key(api_key)
            
        self.documents = []
        self.chunks = []
        self.vectorizer = None
        self.tfidf_matrix = None

    def set_api_key(self, api_key: str):
        self.api_key = api_key
        if USE_NEW_GENAI:
            self.client = genai.Client(api_key=api_key)
        else:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel(self.model_name)

    def ingest_document(self, text: str, doc_name: str = "Source Doc"):
        """Splits document text into chunks and builds a TF-IDF vector retrieval index."""
        if not text.strip():
            return 0

        splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=150)
        raw_chunks = splitter.split_text(text)
        
        chunk_objs = []
        for i, c in enumerate(raw_chunks):
            chunk_objs.append({
                "id": f"{doc_name}_chunk_{i+1}",
                "doc_name": doc_name,
                "text": c
            })
            
        self.chunks.extend(chunk_objs)
        
        # Build TF-IDF search index over all ingested chunks
        all_texts = [c["text"] for c in self.chunks]
        self.vectorizer = TfidfVectorizer(stop_words="english")
        self.tfidf_matrix = self.vectorizer.fit_transform(all_texts)
        
        return len(raw_chunks)

    def clear_index(self):
        self.documents = []
        self.chunks = []
        self.vectorizer = None
        self.tfidf_matrix = None

    def retrieve_context(self, query: str, top_k: int = 3):
        """Retrieves top-k relevant text chunks for a query using TF-IDF cosine similarity."""
        if not self.chunks or self.vectorizer is None:
            return []
            
        query_vec = self.vectorizer.transform([query])
        sims = cosine_similarity(query_vec, self.tfidf_matrix).flatten()
        top_indices = np.argsort(sims)[::-1][:top_k]
        
        results = []
        for idx in top_indices:
            if sims[idx] > 0.05:
                results.append({
                    "chunk": self.chunks[idx],
                    "score": float(sims[idx])
                })
        return results

    def generate_grounded_answer(self, query: str, top_k: int = 3) -> dict:
        """Generates a grounded academic answer using retrieved context passages."""
        retrieved = self.retrieve_context(query, top_k=top_k)
        
        if not retrieved:
            context_str = "No specific reference documents loaded."
        else:
            context_blocks = []
            for item in retrieved:
                c = item["chunk"]
                context_blocks.append(f"[Source: {c['doc_name']} | Chunk ID: {c['id']}]\n{c['text']}")
            context_str = "\n\n".join(context_blocks)

        prompt = f"""
You are an Academic Grounded Assistant. Your goal is to answer the student's question accurately using ONLY the provided reference context below.

Rules:
1. Cite specific sources using [Source: DocName | Chunk ID] where relevant.
2. If the reference context does NOT contain enough information to answer the question fully, state clearly what is available and what is missing. Do NOT make up unverified facts.
3. Keep the tone academic, objective, and clear.

REFERENCE CONTEXT:
{context_str}

STUDENT QUESTION:
{query}

ANSWER:
"""

        if not self.api_key or (not self.client and not self.model):
            return {
                "answer": "⚠️ Gemini API key is missing. Please provide a valid Gemini API Key in the sidebar to generate AI answers.",
                "sources": retrieved
            }

        try:
            if USE_NEW_GENAI and self.client:
                response = self.client.models.generate_content(
                    model=self.model_name,
                    contents=prompt
                )
                answer_text = response.text
            else:
                response = self.model.generate_content(prompt)
                answer_text = response.text

            return {
                "answer": answer_text,
                "sources": retrieved
            }
        except Exception as e:
            return {
                "answer": f"Error generating grounded answer: {str(e)}",
                "sources": retrieved
            }
