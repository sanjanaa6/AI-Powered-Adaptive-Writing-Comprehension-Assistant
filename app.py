import os
import streamlit as st
from config import GEMINI_API_KEY, DEFAULT_MODEL_NAME, AVAILABLE_MODELS, GRADE_LEVEL_TARGETS
from utils.text_helpers import extract_bytes_to_text
from modules.rag_engine import RAGEngine
from modules.style_engine import StyleEngine
from modules.originality_engine import OriginalityEngine
from modules.critique_engine import CritiqueEngine

# Page configuration
st.set_page_config(
    page_title="Academic Adaptive Writing & Comprehension Assistant",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for rich aesthetics, glassmorphism, and clean metrics cards
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Inter', sans-serif;
    }
    
    .main-header {
        background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%);
        padding: 2rem;
        border-radius: 16px;
        color: #ffffff;
        text-align: center;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        margin-bottom: 2rem;
    }
    
    .main-header h1 {
        font-size: 2.2rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        color: #f8fafc;
    }
    
    .main-header p {
        font-size: 1.05rem;
        color: #cbd5e1;
    }
    
    .metric-card {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 1.25rem;
        text-align: center;
        backdrop-filter: blur(10px);
        margin-bottom: 1rem;
    }
    
    .metric-value {
        font-size: 2rem;
        font-weight: 700;
        color: #6366f1;
    }

    .metric-value-green {
        font-size: 2rem;
        font-weight: 700;
        color: #10b981;
    }

    .metric-label {
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #94a3b8;
    }

    .source-box {
        background: #0f172a;
        border-left: 4px solid #6366f1;
        padding: 1rem;
        border-radius: 6px;
        margin-top: 0.5rem;
        font-size: 0.9rem;
    }
    
    .stTabs [data-baseweb="tab-list"] {
        gap: 8px;
    }

    .stTabs [data-baseweb="tab"] {
        padding: 10px 20px;
        border-radius: 8px;
        font-weight: 600;
    }
</style>
""", unsafe_allow_html=True)

# Initialize Session State
if "api_key" not in st.session_state:
    st.session_state.api_key = GEMINI_API_KEY

if "rag_engine" not in st.session_state:
    st.session_state.rag_engine = RAGEngine(st.session_state.api_key)

if "style_engine" not in st.session_state:
    st.session_state.style_engine = StyleEngine(st.session_state.api_key)

if "originality_engine" not in st.session_state:
    st.session_state.originality_engine = OriginalityEngine()

if "critique_engine" not in st.session_state:
    st.session_state.critique_engine = CritiqueEngine(st.session_state.api_key)

# Header Banner
st.markdown("""
<div class="main-header">
    <h1>🎓 AI-Powered Adaptive Writing & Comprehension Assistant</h1>
    <p>Pedagogy-First Academic Workspace | Grounded RAG QA • Readability Transformation • Originality Checker • Essay Critique</p>
</div>
""", unsafe_allow_html=True)

# Sidebar Configuration
with st.sidebar:
    st.title("⚙️ System Settings")
    
    server_key_active = bool(GEMINI_API_KEY)
    
    if server_key_active:
        st.success("🔒 Secure Server API Key Active")
        with st.expander("🔑 Override with Custom API Key"):
            custom_key = st.text_input(
                "Enter Custom Gemini API Key:",
                type="password",
                help="Leave blank to use default secure server key."
            )
            user_key = custom_key.strip() if custom_key.strip() else GEMINI_API_KEY
    else:
        st.warning("⚠️ No Server API Key Configured")
        user_key = st.text_input(
            "Enter Google Gemini API Key:",
            type="password",
            help="Get a free key from Google AI Studio (aistudio.google.com)"
        ).strip()
    
    if user_key != st.session_state.api_key:
        st.session_state.api_key = user_key
        st.session_state.rag_engine.set_api_key(user_key)
        st.session_state.style_engine.set_api_key(user_key)
        st.session_state.critique_engine.set_api_key(user_key)
        
    model_choice = st.selectbox("LLM Backend Model:", AVAILABLE_MODELS)
    st.session_state.rag_engine.model_name = model_choice
    st.session_state.style_engine.model_name = model_choice
    st.session_state.critique_engine.model_name = model_choice
    
    st.divider()
    
    st.markdown("### 📊 Active Document Memory")
    chunk_count = len(st.session_state.rag_engine.chunks)
    st.metric("Loaded Chunks", chunk_count)
    
    if st.button("🗑️ Clear Vector Memory"):
        st.session_state.rag_engine.clear_index()
        st.rerun()

    st.divider()
    st.markdown("Developed for Academic Integrity & Personalized Learning")

# Main Navigation Tabs
tab1, tab2, tab3, tab4 = st.tabs([
    "📚 Grounded Academic RAG",
    "✍️ Style & Readability Transformer",
    "🔍 Originality & Similarity Auditor",
    "📝 Essay Critique & Reviewer"
])

# ----------------------------------------------------
# TAB 1: RAG GROUNDED QUESTION ANSWERING
# ----------------------------------------------------
with tab1:
    st.header("📚 Grounded Academic Query Engine")
    st.markdown("Upload course materials or academic papers to receive factually grounded answers with source citations.")

    col1, col2 = st.columns([1, 2])
    
    with col1:
        st.subheader("1. Load Academic Sources")
        uploaded_file = st.file_uploader("Upload PDF, TXT, or DOCX:", type=["pdf", "txt", "docx"])
        
        if "indexed_files" not in st.session_state:
            st.session_state["indexed_files"] = set()

        if uploaded_file is not None:
            if uploaded_file.name not in st.session_state["indexed_files"]:
                with st.spinner("Parsing & Chunking Document..."):
                    file_text = extract_bytes_to_text(uploaded_file.getvalue(), uploaded_file.name)
                    num_chunks = st.session_state.rag_engine.ingest_document(file_text, uploaded_file.name)
                    st.session_state["indexed_files"].add(uploaded_file.name)
                    st.success(f"Indexed '{uploaded_file.name}' into {num_chunks} chunks!")
            else:
                st.info(f"📄 '{uploaded_file.name}' is currently loaded in memory.")
                    
        st.divider()
        st.markdown("**Sample Quick Input:**")
        sample_text = st.text_area("Or paste reference text directly:", height=150, placeholder="Paste paper text here...")
        if st.button("📥 Index Pasted Text"):
            if sample_text.strip():
                num_chunks = st.session_state.rag_engine.ingest_document(sample_text, "Pasted_Reference")
                st.success(f"Indexed pasted reference into {num_chunks} chunks!")
            else:
                st.warning("Please enter text first.")

    with col2:
        st.subheader("2. Ask Grounded Question")
        query = st.text_input("Enter your research or course question:", placeholder="e.g., What are the main findings regarding Flesch-Kincaid metrics?")
        
        if st.button("🔍 Search & Generate Answer", type="primary", use_container_width=True):
            if not query.strip():
                st.warning("Please enter a question.")
            else:
                with st.spinner("Retrieving context & generating answer..."):
                    result = st.session_state.rag_engine.generate_grounded_answer(query)
                    
                    st.markdown("### 💡 AI Grounded Answer")
                    st.write(result["answer"])
                    
                    st.divider()
                    st.markdown("### 🔖 Retrieved Reference Contexts")
                    if not result["sources"]:
                        st.info("No reference documents were retrieved for this query.")
                    else:
                        for s in result["sources"]:
                            chunk = s["chunk"]
                            with st.expander(f"📌 {chunk['doc_name']} (Relevance Score: {round(s['score'], 3)})"):
                                st.markdown(f"**Chunk ID:** `{chunk['id']}`")
                                st.text(chunk["text"])

# ----------------------------------------------------
# TAB 2: STYLE CONDITIONING & READABILITY TRANSFORMER
# ----------------------------------------------------
with tab2:
    st.header("✍️ Adaptive Style & Readability Transformer")
    st.markdown("Transform text tone, complexity, and reading level while tracking **Flesch-Kincaid Grade Level** scores.")

    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Input Text & Style Options")
        input_text = st.text_area(
            "Original Text:",
            height=200,
            placeholder="Paste text you wish to rewrite or simplify..."
        )
        
        c1, c2, c3 = st.columns(3)
        with c1:
            tone = st.selectbox("Tone:", ["Academic / Formal", "Informal / Conversational", "Technical", "Simplified"])
        with c2:
            reading_level = st.selectbox("Target Reading Level:", list(GRADE_LEVEL_TARGETS.keys()))
        with c3:
            length_opt = st.selectbox("Length:", ["Maintain Original", "Concise Summary", "Expanded Detail"])
            
        custom_inst = st.text_input("Custom Instruction (Optional):", placeholder="e.g., add real-world examples")
        
        transform_btn = st.button("✨ Transform Text Style", type="primary", use_container_width=True)

    with col2:
        st.subheader("Transformation Output & Readability Analytics")
        
        if transform_btn and input_text.strip():
            with st.spinner("Transforming text and calculating readability metrics..."):
                res = st.session_state.style_engine.transform_style(
                    input_text, tone, reading_level, length_opt, custom_inst
                )
                
                st.session_state["last_trans_result"] = res

        if "last_trans_result" in st.session_state:
            res = st.session_state["last_trans_result"]
            
            st.markdown("#### Transformed Output:")
            st.text_area("Transformed Text:", value=res["transformed_text"], height=180)
            
            st.divider()
            st.markdown("#### 📈 Readability Metric Comparison")
            
            m_orig = res.get("metrics_original", {})
            m_trans = res.get("metrics_transformed", {})
            
            mc1, mc2, mc3 = st.columns(3)
            
            with mc1:
                fk_orig = m_orig.get("flesch_kincaid_grade", 0)
                fk_trans = m_trans.get("flesch_kincaid_grade", 0)
                st.metric("Flesch-Kincaid Grade", fk_trans, delta=round(fk_trans - fk_orig, 2), delta_color="inverse")
                
            with mc2:
                fre_orig = m_orig.get("flesch_reading_ease", 0)
                fre_trans = m_trans.get("flesch_reading_ease", 0)
                st.metric("Flesch Reading Ease", fre_trans, delta=round(fre_trans - fre_orig, 2))

            with mc3:
                wc_orig = m_orig.get("word_count", 0)
                wc_trans = m_trans.get("word_count", 0)
                st.metric("Word Count", wc_trans, delta=wc_trans - wc_orig)

# ----------------------------------------------------
# TAB 3: ORIGINALITY & SIMILARITY AUDITOR
# ----------------------------------------------------
with tab3:
    st.header("🔍 Originality & Academic Integrity Auditor")
    st.markdown("Audit rewritten or generated content against source material to prevent accidental plagiarism and high similarity.")

    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Source Material vs Output Text")
        source_txt = st.text_area("Original Source Passage:", height=180, placeholder="Paste original reference text...")
        generated_txt = st.text_area("Generated / Student Text:", height=180, placeholder="Paste text to test for similarity...")
        
        ngram_size = st.slider("N-gram Overlap Size (Words):", min_value=3, max_value=8, value=5)
        
        audit_btn = st.button("🛡️ Audit Similarity & Integrity", type="primary", use_container_width=True)

    with col2:
        st.subheader("Similarity Audit Report")
        
        if audit_btn:
            with st.spinner("Analyzing TF-IDF Cosine Similarity & N-gram Overlaps..."):
                report = st.session_state.originality_engine.analyze_similarity(
                    generated_txt, source_txt, n_gram_size=ngram_size
                )
                
                sim_pct = report["similarity_percentage"]
                risk = report["risk_level"]
                
                m1, m2 = st.columns(2)
                with m1:
                    st.metric("Similarity Score", f"{sim_pct}%")
                with m2:
                    st.markdown(f"### {risk}")
                    
                st.divider()
                st.markdown(f"#### ⚠️ Matching {ngram_size}-gram Phrases ({report['n_gram_match_count']} total matches)")
                
                if not report["n_gram_matches"]:
                    st.success("No exact phrase overlaps detected!")
                else:
                    for m in report["n_gram_matches"]:
                        st.warning(f"Match: \"{m}\"")

# ----------------------------------------------------
# TAB 4: PEDAGOGICAL ESSAY REVIEW & TUTOR
# ----------------------------------------------------
with tab4:
    st.header("📝 Pedagogical Essay Reviewer & Tutor")
    st.markdown("Receive constructive, rubric-based feedback on your essay draft **without AI replacing your writing**.")

    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.subheader("Submit Essay Draft")
        essay_draft = st.text_area(
            "Essay Content:",
            height=320,
            placeholder="Paste your essay draft here..."
        )
        
        level = st.selectbox("Your Academic Level:", ["High School", "Undergraduate", "Postgraduate"])
        
        review_btn = st.button("🎓 Review & Critique Essay", type="primary", use_container_width=True)

    with col2:
        st.subheader("Academic Tutor Feedback")
        
        if review_btn and essay_draft.strip():
            with st.spinner("Evaluating thesis, structure, tone, and evidence..."):
                critique = st.session_state.critique_engine.review_essay(essay_draft, academic_level=level)
                st.markdown(critique)
        elif review_btn:
            st.warning("Please paste an essay draft first.")
