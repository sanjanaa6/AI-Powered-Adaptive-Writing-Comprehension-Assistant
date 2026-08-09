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

## 🚀 Quickstart & Setup Guide (Virtual Environment `venv`)

### 1. Create and Activate Virtual Environment
Open PowerShell or Command Prompt in the project folder:

**PowerShell:**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**Command Prompt (CMD):**
```cmd
python -m venv venv
.\venv\Scripts\activate.bat
```

### 2. Install Dependencies
```bash
.\venv\Scripts\python.exe -m pip install -r requirements.txt
```

### 3. Launch the Application
```bash
.\venv\Scripts\python.exe -m streamlit run app.py
```
Open your browser at `http://localhost:8503` (or `http://localhost:8501`).

---

## 🧪 How to Work & Test Each Feature

### 1. 📚 Grounded Academic RAG Tab
- **Sidebar API Key**: Enter your Google Gemini API key in the sidebar (obtain a free key from [aistudio.google.com](https://aistudio.google.com/app/apikey)).
- **Index a Document**: Upload a PDF/TXT/DOCX file or paste reference text in the text area and click **"📥 Index Pasted Text"**.
- **Ask Question**: Type an academic query (e.g., *"What is the main finding of the paper?"*) and click **"🔍 Search & Generate Answer"**.
- **Result**: You will get a grounded AI response along with retrieved source chunk references below it.

### 2. ✍️ Style & Readability Transformer Tab
- **Input Text**: Paste any draft text or paragraph.
- **Select Controls**: Choose target **Tone** (*Academic/Formal*, *Simplified*, etc.), **Target Reading Level** (*Undergraduate*, *High School*), and **Length**.
- **Transform**: Click **"✨ Transform Text Style"**.
- **Metrics**: Compare **Flesch-Kincaid Grade Level** and **Reading Ease** score metrics side-by-side.

### 3. 🔍 Originality & Academic Integrity Auditor Tab
- **Inputs**: Paste original reference text in *Original Source Passage* and modified/generated text in *Generated / Student Text*.
- **Audit**: Click **"🛡️ Audit Similarity & Integrity"**.
- **Report**: View **Similarity Percentage Score** and matching **N-gram phrases**.

### 4. 📝 Pedagogical Essay Reviewer Tab
- **Submit Draft**: Paste an essay draft into the essay text area.
- **Review**: Select student academic level and click **"🎓 Review & Critique Essay"**.
- **Critique**: Read constructive feedback on thesis, structure, tone, and action plan without the AI ghostwriting for you.

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
