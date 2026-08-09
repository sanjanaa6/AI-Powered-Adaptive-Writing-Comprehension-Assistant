# AI-Powered Adaptive Writing & Comprehension Assistant

An AI-powered academic writing and comprehension workspace designed for students and researchers. Built with Python, Streamlit, Retrieval-Augmented Generation (RAG), textstat readability scoring, TF-IDF originality checking, and pedagogical essay tutoring.

---

## 🌟 Key Features

1. **📚 Grounded Academic RAG Engine**:
   - Ingests course materials (PDF, TXT, DOCX).
   - Generates factually grounded answers with explicit source citations.
   
2. **✍️ Adaptive Style & Readability Transformer**:
   - Rewrites text according to target tone (Academic, Informal, Simplified, Technical) and target reading level.
   - Measures quantitative complexity changes using **Flesch-Kincaid Grade Level** and **Flesch Reading Ease**.

3. **🔍 Originality & Academic Integrity Auditor**:
   - Computes Cosine Similarity and N-gram overlap between generated/rewritten text and source materials.
   - Highlights phrase matches to encourage responsible paraphrasing and attribution.

4. **📝 Pedagogical Essay Reviewer & Tutor**:
   - Critiques student essay drafts across 5 rubric dimensions (Thesis, Structure, Tone, Evidence, Clarity).
   - Serves as an academic mentor by providing actionable feedback **without writing the paper for the student**.

---

## 🚀 Quickstart Guide

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Set Up Gemini API Key
Create a `.env` file in the project root directory or enter it in the sidebar when running the app:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### 3. Launch the Application
```bash
python -m streamlit run app.py
```

Open your browser at `http://localhost:8501` to use the interactive dashboard.

---

## 📁 Project Structure

- `app.py`: Main Streamlit Web Application Dashboard
- `config.py`: Configuration and environment settings
- `modules/rag_engine.py`: Document ingestion, TF-IDF vector index, grounded RAG QA
- `modules/style_engine.py`: Style conditioning & textstat Flesch-Kincaid readability scoring
- `modules/originality_engine.py`: Similarity scoring and N-gram overlap detection
- `modules/critique_engine.py`: Multi-criteria pedagogical essay reviewer
- `utils/text_helpers.py`: PDF, DOCX, and TXT file parsing utilities
- `requirements.txt`: Python package dependencies
