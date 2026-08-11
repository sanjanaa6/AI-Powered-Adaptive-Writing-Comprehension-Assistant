import os
import streamlit as st
from streamlit_option_menu import option_menu

from config import GEMINI_API_KEY, DEFAULT_MODEL_NAME, AVAILABLE_MODELS, GRADE_LEVEL_TARGETS
from utils.text_helpers import extract_bytes_to_text
from modules.rag_engine import RAGEngine
from modules.style_engine import StyleEngine
from modules.originality_engine import OriginalityEngine
from modules.critique_engine import CritiqueEngine

# Page configuration
st.set_page_config(
    page_title="Academic Intelligence Platform",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded"
)

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

# Inject High-Contrast Enterprise Dark Theme CSS
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    html, body, [class*="css"], .stMarkdown, p, div, span, label {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    
    /* Ensure global background */
    .stApp {
        background-color: #0b0f17 !important;
        color: #f8fafc !important;
    }
    
    /* Top Navbar container */
    .top-navbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #161e2e !important;
        padding: 1.25rem 2rem;
        border-radius: 12px;
        border: 1px solid #2d3748 !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        margin-bottom: 1.5rem;
    }
    
    .nav-brand-title {
        font-size: 1.35rem !important;
        font-weight: 700 !important;
        color: #ffffff !important;
        margin: 0 !important;
        letter-spacing: -0.01em;
    }

    .nav-brand-subtitle {
        font-size: 0.85rem !important;
        color: #94a3b8 !important;
        margin: 4px 0 0 0 !important;
    }
    
    .nav-badges {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
    }
    
    .status-badge {
        display: inline-flex;
        align-items: center;
        padding: 5px 14px;
        border-radius: 6px;
        font-size: 0.8rem !important;
        font-weight: 600 !important;
        border: 1px solid transparent;
    }
    
    .badge-success {
        background-color: #064e3b !important;
        color: #34d399 !important;
        border-color: #059669 !important;
    }
    
    .badge-warning {
        background-color: #78350f !important;
        color: #fbbf24 !important;
        border-color: #d97706 !important;
    }
    
    .badge-neutral {
        background-color: #1e293b !important;
        color: #cbd5e1 !important;
        border-color: #475569 !important;
    }
    
    .badge-brand {
        background-color: #1e3a8a !important;
        color: #60a5fa !important;
        border-color: #2563eb !important;
    }
    
    /* Dashboard card */
    .dash-card {
        background-color: #161e2e !important;
        border: 1px solid #2d3748 !important;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        height: 100%;
        transition: border-color 0.2s ease, transform 0.2s ease;
    }
    
    .dash-card:hover {
        border-color: #3b82f6 !important;
        transform: translateY(-1px);
    }
    
    .dash-card-title {
        font-size: 1.1rem !important;
        font-weight: 700 !important;
        color: #f8fafc !important;
        margin-bottom: 0.5rem !important;
    }
    
    .dash-card-desc {
        font-size: 0.88rem !important;
        color: #94a3b8 !important;
        line-height: 1.5 !important;
        margin: 0 !important;
    }
    
    /* Stat Metric Box */
    .stat-box {
        background-color: #161e2e !important;
        border: 1px solid #2d3748 !important;
        border-radius: 10px;
        padding: 1.25rem 1rem;
        text-align: center;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }
    
    .stat-val {
        font-size: 1.8rem !important;
        font-weight: 700 !important;
        color: #ffffff !important;
        letter-spacing: -0.02em;
    }
    
    .stat-lbl {
        font-size: 0.75rem !important;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: #94a3b8 !important;
        font-weight: 600 !important;
        margin-top: 4px;
    }
    
    /* Sidebar styling */
    [data-testid="stSidebar"] {
        background-color: #0f172a !important;
        border-right: 1px solid #1e293b !important;
    }

    [data-testid="stSidebar"] p, [data-testid="stSidebar"] span, [data-testid="stSidebar"] div, [data-testid="stSidebar"] label {
        color: #cbd5e1 !important;
    }
    
    .sidebar-section-title {
        font-size: 0.72rem !important;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #64748b !important;
        margin: 1.2rem 0 0.5rem 0.5rem;
        font-weight: 700 !important;
    }
    
    /* Section headers */
    .section-header {
        border-bottom: 1px solid #1e293b !important;
        padding-bottom: 0.75rem;
        margin-bottom: 1.5rem;
    }
    
    .section-header h2 {
        font-size: 1.4rem !important;
        font-weight: 700 !important;
        color: #ffffff !important;
        margin: 0 !important;
        letter-spacing: -0.01em;
    }
    
    .section-header p {
        font-size: 0.9rem !important;
        color: #94a3b8 !important;
        margin: 4px 0 0 0 !important;
    }

    /* Buttons */
    div.stButton > button {
        background-color: #1e293b !important;
        color: #f8fafc !important;
        border: 1px solid #334155 !important;
        border-radius: 8px !important;
        font-weight: 600 !important;
    }
    
    div.stButton > button[kind="primary"] {
        background-color: #2563eb !important;
        color: #ffffff !important;
        border: 1px solid #3b82f6 !important;
    }
    
    div.stButton > button:hover {
        border-color: #3b82f6 !important;
        color: #ffffff !important;
    }
    
    /* Inputs */
    .stTextInput input, .stTextArea textarea, .stSelectbox > div > div {
        background-color: #1e293b !important;
        color: #f8fafc !important;
        border: 1px solid #334155 !important;
        border-radius: 8px !important;
    }

    /* Expander styling */
    .stExpander {
        background-color: #161e2e !important;
        border: 1px solid #2d3748 !important;
        border-radius: 8px !important;
    }
</style>
""", unsafe_allow_html=True)

# Render Top Navbar Header
server_key_active = bool(GEMINI_API_KEY)
user_api_key = st.session_state.get("api_key", "")
api_status_badge = '<span class="status-badge badge-success">API Key Connected</span>' if user_api_key else '<span class="status-badge badge-warning">API Key Missing</span>'
chunk_count = len(st.session_state.rag_engine.chunks)
model_name = st.session_state.rag_engine.model_name

st.markdown(f"""
<div class="top-navbar">
    <div>
        <h1 class="nav-brand-title">Academic Writing & Comprehension Assistant</h1>
        <p class="nav-brand-subtitle">Grounded RAG QA • Readability Transformation • Originality Auditor • Essay Critique</p>
    </div>
    <div class="nav-badges">
        {api_status_badge}
        <span class="status-badge badge-brand">Model: {model_name}</span>
        <span class="status-badge badge-neutral">Memory: {chunk_count} Chunks</span>
    </div>
</div>
""", unsafe_allow_html=True)

# Sidebar Navigation
with st.sidebar:
    st.markdown('<div class="sidebar-section-title">TASKS</div>', unsafe_allow_html=True)
    
    selected_task = option_menu(
        menu_title=None,
        options=[
            "Overview",
            "Grounded RAG QA",
            "Style Transformer",
            "Originality Auditor",
            "Essay Critique"
        ],
        icons=[
            "grid-1x2",
            "journal-text",
            "sliders",
            "shield-check",
            "pencil-square"
        ],
        default_index=0,
        styles={
            "container": {"padding": "0!important", "background-color": "transparent"},
            "icon": {"color": "#94a3b8", "font-size": "15px"},
            "nav-link": {
                "font-size": "13.5px",
                "text-align": "left",
                "margin": "3px 0",
                "padding": "9px 12px",
                "border-radius": "8px",
                "color": "#cbd5e1",
                "font-weight": "500"
            },
            "nav-link-selected": {
                "background-color": "#2563eb",
                "color": "#ffffff",
                "font-weight": "600",
                "border": "none"
            }
        }
    )
    
    st.markdown('<div class="sidebar-section-title">SYSTEM CONFIGURATION</div>', unsafe_allow_html=True)
    
    with st.expander("Settings & Credentials", expanded=not bool(user_api_key)):
        if server_key_active:
            st.caption("Default Secure Server Key Active")
            custom_key = st.text_input(
                "Custom Gemini Key:",
                type="password",
                help="Leave blank to use default server key."
            )
            active_key = custom_key.strip() if custom_key.strip() else GEMINI_API_KEY
        else:
            st.caption("No Server Key Configured")
            active_key = st.text_input(
                "Gemini API Key:",
                type="password",
                help="Get a free key at aistudio.google.com"
            ).strip()
            
        if active_key != st.session_state.api_key:
            st.session_state.api_key = active_key
            st.session_state.rag_engine.set_api_key(active_key)
            st.session_state.style_engine.set_api_key(active_key)
            st.session_state.critique_engine.set_api_key(active_key)
            st.rerun()

        model_choice = st.selectbox("Backend Model:", AVAILABLE_MODELS, index=0)
        if model_choice != st.session_state.rag_engine.model_name:
            st.session_state.rag_engine.model_name = model_choice
            st.session_state.style_engine.model_name = model_choice
            st.session_state.critique_engine.model_name = model_choice
            st.rerun()

    with st.expander("Active Memory", expanded=False):
        st.write(f"**Loaded Chunks:** {chunk_count}")
        if st.button("Clear Vector Memory", use_container_width=True):
            st.session_state.rag_engine.clear_index()
            st.session_state["indexed_files"] = set()
            st.success("Vector memory cleared.")
            st.rerun()

# ----------------------------------------------------
# PAGE 1: DASHBOARD OVERVIEW
# ----------------------------------------------------
if selected_task == "Overview":
    st.markdown("""
    <div class="section-header">
        <h2>Workspace Overview</h2>
        <p>Pedagogy-first academic writing, comprehension, and integrity auditing tools.</p>
    </div>
    """, unsafe_allow_html=True)
    
    m1, m2, m3, m4 = st.columns(4)
    with m1:
        st.markdown(f"""
        <div class="stat-box">
            <div class="stat-val">{chunk_count}</div>
            <div class="stat-lbl">Active RAG Chunks</div>
        </div>
        """, unsafe_allow_html=True)
    with m2:
        files_cnt = len(st.session_state.get("indexed_files", []))
        st.markdown(f"""
        <div class="stat-box">
            <div class="stat-val">{files_cnt}</div>
            <div class="stat-lbl">Indexed Documents</div>
        </div>
        """, unsafe_allow_html=True)
    with m3:
        st.markdown(f"""
        <div class="stat-box">
            <div class="stat-val" style="font-size: 1.4rem;">{model_name}</div>
            <div class="stat-lbl">LLM Backend</div>
        </div>
        """, unsafe_allow_html=True)
    with m4:
        status_txt = "Ready" if user_api_key else "Key Required"
        status_color = "#34d399" if user_api_key else "#fbbf24"
        st.markdown(f"""
        <div class="stat-box">
            <div class="stat-val" style="font-size: 1.4rem; color: {status_color} !important;">{status_txt}</div>
            <div class="stat-lbl">API Connection</div>
        </div>
        """, unsafe_allow_html=True)
        
    st.markdown("<br>", unsafe_allow_html=True)
    st.subheader("Core Academic Modules")
    
    c1, c2 = st.columns(2)
    
    with c1:
        st.markdown("""
        <div class="dash-card">
            <div class="dash-card-title">Grounded Academic RAG</div>
            <div class="dash-card-desc">Ingest lecture notes, research papers, and textbook PDFs to receive factually grounded answers with inline chunk citations.</div>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("<br>", unsafe_allow_html=True)
        
        st.markdown("""
        <div class="dash-card">
            <div class="dash-card-title">Originality & Integrity Auditor</div>
            <div class="dash-card-desc">Compare student drafts against source materials using TF-IDF cosine similarity and n-gram overlap detection.</div>
        </div>
        """, unsafe_allow_html=True)

    with c2:
        st.markdown("""
        <div class="dash-card">
            <div class="dash-card-title">Style & Readability Transformer</div>
            <div class="dash-card-desc">Transform tone, complexity, and target reading level while calculating Flesch-Kincaid Grade Level scores in real time.</div>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("<br>", unsafe_allow_html=True)
        
        st.markdown("""
        <div class="dash-card">
            <div class="dash-card-title">Pedagogical Essay Reviewer</div>
            <div class="dash-card-desc">Receive structured, rubric-based feedback on thesis strength, argument organization, and evidence support.</div>
        </div>
        """, unsafe_allow_html=True)

# ----------------------------------------------------
# PAGE 2: GROUNDED ACADEMIC RAG
# ----------------------------------------------------
elif selected_task == "Grounded RAG QA":
    st.markdown("""
    <div class="section-header">
        <h2>Grounded Academic Query Engine</h2>
        <p>Upload source materials to generate factual, cited responses from loaded documents.</p>
    </div>
    """, unsafe_allow_html=True)

    col1, col2 = st.columns([1, 2])
    
    with col1:
        st.subheader("1. Source Ingestion")
        uploaded_file = st.file_uploader("Upload Document (PDF, TXT, DOCX):", type=["pdf", "txt", "docx"])
        
        if "indexed_files" not in st.session_state:
            st.session_state["indexed_files"] = set()

        if uploaded_file is not None:
            if uploaded_file.name not in st.session_state["indexed_files"]:
                with st.spinner("Indexing document..."):
                    file_text = extract_bytes_to_text(uploaded_file.getvalue(), uploaded_file.name)
                    num_chunks = st.session_state.rag_engine.ingest_document(file_text, uploaded_file.name)
                    st.session_state["indexed_files"].add(uploaded_file.name)
                    st.success(f"Indexed '{uploaded_file.name}' into {num_chunks} chunks.")
                    st.rerun()
            else:
                st.info(f"'{uploaded_file.name}' is currently loaded in memory.")
                    
        st.divider()
        st.markdown("**Paste Reference Text:**")
        sample_text = st.text_area("Reference Text:", height=140, placeholder="Paste reference text here...", label_visibility="collapsed")
        if st.button("Index Text Passage", use_container_width=True):
            if sample_text.strip():
                num_chunks = st.session_state.rag_engine.ingest_document(sample_text, "Pasted_Reference")
                st.success(f"Indexed passage into {num_chunks} chunks.")
                st.rerun()
            else:
                st.warning("Please enter text first.")

    with col2:
        st.subheader("2. Ask Grounded Question")
        query = st.text_input("Question:", placeholder="e.g., What are the key findings presented in the text?")
        
        if st.button("Search & Generate Answer", type="primary", use_container_width=True):
            if not query.strip():
                st.warning("Please enter a question.")
            else:
                with st.spinner("Generating grounded answer..."):
                    result = st.session_state.rag_engine.generate_grounded_answer(query)
                    
                    st.markdown("### Answer")
                    st.write(result["answer"])
                    
                    st.divider()
                    st.markdown("### Referenced Source Passages")
                    if not result["sources"]:
                        st.info("No reference documents were retrieved for this query.")
                    else:
                        for s in result["sources"]:
                            chunk = s["chunk"]
                            with st.expander(f"Source: {chunk['doc_name']} (Relevance: {round(s['score'], 3)})"):
                                st.markdown(f"**Chunk ID:** `{chunk['id']}`")
                                st.text(chunk["text"])

# ----------------------------------------------------
# PAGE 3: STYLE & READABILITY TRANSFORMER
# ----------------------------------------------------
elif selected_task == "Style Transformer":
    st.markdown("""
    <div class="section-header">
        <h2>Style & Readability Transformer</h2>
        <p>Adapt text tone, complexity, and target reading level while analyzing readability metrics.</p>
    </div>
    """, unsafe_allow_html=True)

    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Input Text & Settings")
        input_text = st.text_area(
            "Original Text:",
            height=200,
            placeholder="Paste text to rewrite or simplify..."
        )
        
        c1, c2, c3 = st.columns(3)
        with c1:
            tone = st.selectbox("Tone:", ["Academic / Formal", "Informal / Conversational", "Technical", "Simplified"])
        with c2:
            reading_level = st.selectbox("Target Grade:", list(GRADE_LEVEL_TARGETS.keys()))
        with c3:
            length_opt = st.selectbox("Length:", ["Maintain Original", "Concise Summary", "Expanded Detail"])
            
        custom_inst = st.text_input("Custom Instruction (Optional):", placeholder="e.g., provide concrete examples")
        
        transform_btn = st.button("Transform Text", type="primary", use_container_width=True)

    with col2:
        st.subheader("Transformation Output")
        
        if transform_btn and input_text.strip():
            with st.spinner("Processing text and calculating metrics..."):
                res = st.session_state.style_engine.transform_style(
                    input_text, tone, reading_level, length_opt, custom_inst
                )
                st.session_state["last_trans_result"] = res

        if "last_trans_result" in st.session_state:
            res = st.session_state["last_trans_result"]
            
            st.markdown("#### Transformed Text:")
            st.text_area("Output Text:", value=res["transformed_text"], height=180, label_visibility="collapsed")
            
            st.divider()
            st.markdown("#### Readability Metrics")
            
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
# PAGE 4: ORIGINALITY & INTEGRITY AUDITOR
# ----------------------------------------------------
elif selected_task == "Originality Auditor":
    st.markdown("""
    <div class="section-header">
        <h2>Originality & Academic Integrity Auditor</h2>
        <p>Audit text similarity against source passages using cosine similarity and n-gram overlap detection.</p>
    </div>
    """, unsafe_allow_html=True)

    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Passage Comparison")
        source_txt = st.text_area("Original Source Passage:", height=180, placeholder="Paste reference source text...")
        generated_txt = st.text_area("Target Passage:", height=180, placeholder="Paste student or generated text...")
        
        ngram_size = st.slider("N-gram Overlap Length (Words):", min_value=3, max_value=8, value=5)
        
        audit_btn = st.button("Run Similarity Audit", type="primary", use_container_width=True)

    with col2:
        st.subheader("Audit Report")
        
        if audit_btn:
            if not source_txt.strip() or not generated_txt.strip():
                st.warning("Please enter both source and target passages.")
            else:
                with st.spinner("Analyzing similarity..."):
                    report = st.session_state.originality_engine.analyze_similarity(
                        generated_txt, source_txt, n_gram_size=ngram_size
                    )
                    
                    sim_pct = report["similarity_percentage"]
                    risk = report["risk_level"]
                    
                    m1, m2 = st.columns(2)
                    with m1:
                        st.metric("Cosine Similarity", f"{sim_pct}%")
                    with m2:
                        st.metric("Risk Level", risk)
                        
                    st.divider()
                    st.markdown(f"#### Matching {ngram_size}-gram Phrases ({report['n_gram_match_count']} found)")
                    
                    if not report["n_gram_matches"]:
                        st.success("No exact phrase overlaps detected.")
                    else:
                        for m in report["n_gram_matches"]:
                            st.warning(f"Phrase Match: \"{m}\"")

# ----------------------------------------------------
# PAGE 5: ESSAY CRITIQUE & TUTOR
# ----------------------------------------------------
elif selected_task == "Essay Critique":
    st.markdown("""
    <div class="section-header">
        <h2>Pedagogical Essay Reviewer</h2>
        <p>Receive rubric-based feedback on thesis clarity, argument structure, and evidence support.</p>
    </div>
    """, unsafe_allow_html=True)

    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.subheader("Submit Draft")
        essay_draft = st.text_area(
            "Essay Content:",
            height=320,
            placeholder="Paste your essay draft here..."
        )
        
        level = st.selectbox("Academic Target Level:", ["High School", "Undergraduate", "Postgraduate"])
        
        review_btn = st.button("Review Essay Draft", type="primary", use_container_width=True)

    with col2:
        st.subheader("Rubric Feedback")
        
        if review_btn and essay_draft.strip():
            with st.spinner("Analyzing essay structure and thesis..."):
                critique = st.session_state.critique_engine.review_essay(essay_draft, academic_level=level)
                st.markdown(critique)
        elif review_btn:
            st.warning("Please paste an essay draft first.")
