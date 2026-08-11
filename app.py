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
    page_title="Academic Adaptive AI Workspace",
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

# Inject modern, high-end custom CSS
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', sans-serif;
    }
    
    /* Navbar styling */
    .top-navbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%);
        padding: 1.25rem 2rem;
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 10px 30px rgba(0,0,0,0.25);
        margin-bottom: 1.5rem;
    }
    
    .nav-brand {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .nav-brand-title {
        font-size: 1.4rem;
        font-weight: 800;
        background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin: 0;
    }

    .nav-brand-subtitle {
        font-size: 0.82rem;
        color: #94a3b8;
        margin: 0;
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
        gap: 6px;
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255,255,255,0.12);
    }
    
    .badge-green {
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
        border-color: rgba(52, 211, 153, 0.3);
    }
    
    .badge-amber {
        background: rgba(245, 158, 11, 0.15);
        color: #fbbf24;
        border-color: rgba(251, 191, 36, 0.3);
    }
    
    .badge-indigo {
        background: rgba(99, 102, 241, 0.15);
        color: #818cf8;
        border-color: rgba(129, 140, 248, 0.3);
    }
    
    /* Professional dashboard card */
    .dash-card {
        background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 16px;
        padding: 1.5rem;
        transition: all 0.3s ease;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        height: 100%;
    }
    
    .dash-card:hover {
        border-color: rgba(99, 102, 241, 0.4);
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(99, 102, 241, 0.15);
    }
    
    .dash-card-icon {
        font-size: 2rem;
        margin-bottom: 0.75rem;
    }
    
    .dash-card-title {
        font-size: 1.15rem;
        font-weight: 700;
        color: #f8fafc;
        margin-bottom: 0.5rem;
    }
    
    .dash-card-desc {
        font-size: 0.88rem;
        color: #94a3b8;
        line-height: 1.5;
        margin-bottom: 1rem;
    }
    
    /* Stat Metric Box */
    .stat-box {
        background: rgba(30, 41, 59, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        padding: 1.25rem;
        text-align: center;
    }
    
    .stat-val {
        font-size: 1.8rem;
        font-weight: 800;
        background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    
    .stat-lbl {
        font-size: 0.78rem;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: #94a3b8;
        margin-top: 4px;
    }
    
    /* Sidebar polish */
    [data-testid="stSidebar"] {
        background-color: #0b0f19;
        border-right: 1px solid rgba(255, 255, 255, 0.08);
    }
    
    .sidebar-section-title {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #64748b;
        margin: 1.2rem 0 0.6rem 0.5rem;
        font-weight: 700;
    }
    
    /* Section headers inside tabs */
    .section-header {
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        padding-bottom: 0.75rem;
        margin-bottom: 1.5rem;
    }
    
    .section-header h2 {
        font-size: 1.5rem;
        font-weight: 700;
        color: #f1f5f9;
        margin: 0;
    }
    
    .section-header p {
        font-size: 0.9rem;
        color: #94a3b8;
        margin: 4px 0 0 0;
    }

    /* Buttons enhancement */
    div.stButton > button {
        border-radius: 10px;
        font-weight: 600;
        transition: all 0.2s ease;
    }
</style>
""", unsafe_allow_html=True)

# Render Top Navbar Header
server_key_active = bool(GEMINI_API_KEY)
user_api_key = st.session_state.get("api_key", "")
api_status_badge = f'<span class="status-badge badge-green">🔒 API Key Ready</span>' if user_api_key else '<span class="status-badge badge-amber">⚠️ Key Required</span>'
chunk_count = len(st.session_state.rag_engine.chunks)
model_name = st.session_state.rag_engine.model_name

st.markdown(f"""
<div class="top-navbar">
    <div class="nav-brand">
        <div style="font-size: 2.2rem;">🎓</div>
        <div>
            <h1 class="nav-brand-title">Academic AI Studio</h1>
            <p class="nav-brand-subtitle">Pedagogy-First Intelligence & Comprehension Platform</p>
        </div>
    </div>
    <div class="nav-badges">
        {api_status_badge}
        <span class="status-badge badge-indigo">🤖 {model_name}</span>
        <span class="status-badge badge-indigo">📚 {chunk_count} RAG Chunks</span>
    </div>
</div>
""", unsafe_allow_html=True)

# Sidebar Task Navigation
with st.sidebar:
    st.markdown('<div class="sidebar-section-title">NAVIGATION MENU</div>', unsafe_allow_html=True)
    
    # Navigation Menu using option_menu
    selected_task = option_menu(
        menu_title=None,
        options=[
            "Dashboard Overview",
            "Grounded Academic RAG",
            "Style Transformer",
            "Originality Auditor",
            "Essay Critique"
        ],
        icons=[
            "speedometer2",
            "journal-bookmark-fill",
            "sliders",
            "shield-check",
            "vector-pen"
        ],
        default_index=0,
        styles={
            "container": {"padding": "0!important", "background-color": "transparent"},
            "icon": {"color": "#818cf8", "font-size": "16px"},
            "nav-link": {
                "font-size": "14px",
                "text-align": "left",
                "margin": "4px 0",
                "padding": "10px 14px",
                "border-radius": "10px",
                "color": "#cbd5e1",
                "font-weight": "500"
            },
            "nav-link-selected": {
                "background-color": "#4338ca",
                "color": "#ffffff",
                "font-weight": "700",
                "box-shadow": "0 4px 12px rgba(67, 56, 202, 0.4)"
            }
        }
    )
    
    st.markdown('<div class="sidebar-section-title">SYSTEM CONFIGURATION</div>', unsafe_allow_html=True)
    
    with st.expander("⚙️ Models & Credentials", expanded=not bool(user_api_key)):
        if server_key_active:
            st.caption("🔒 Default Secure Server Key Active")
            custom_key = st.text_input(
                "Custom Gemini Key:",
                type="password",
                help="Leave blank to use default server key."
            )
            active_key = custom_key.strip() if custom_key.strip() else GEMINI_API_KEY
        else:
            st.caption("⚠️ No Server Key Configured")
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

    with st.expander("📊 Active Memory Stats", expanded=False):
        st.write(f"**Loaded Chunks:** {chunk_count}")
        if st.button("🗑️ Clear Vector Index", use_container_width=True):
            st.session_state.rag_engine.clear_index()
            st.session_state["indexed_files"] = set()
            st.success("Vector memory cleared!")
            st.rerun()
            
    st.caption("Academic Integrity Workspace v2.0")

# ----------------------------------------------------
# PAGE 1: DASHBOARD OVERVIEW
# ----------------------------------------------------
if selected_task == "Dashboard Overview":
    st.markdown("""
    <div class="section-header">
        <h2>📊 Academic Workspace Overview</h2>
        <p>Welcome to your intelligent writing, comprehension, and academic auditing environment.</p>
    </div>
    """, unsafe_allow_html=True)
    
    # 4 Quick Stat Counters
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
            <div class="stat-lbl">Indexed Sources</div>
        </div>
        """, unsafe_allow_html=True)
    with m3:
        st.markdown(f"""
        <div class="stat-box">
            <div class="stat-val">{model_name.split('-')[1].upper() if '-' in model_name else model_name}</div>
            <div class="stat-lbl">LLM Engine Version</div>
        </div>
        """, unsafe_allow_html=True)
    with m4:
        status_txt = "Active" if user_api_key else "Action Required"
        st.markdown(f"""
        <div class="stat-box">
            <div class="stat-val" style="font-size: 1.4rem;">{status_txt}</div>
            <div class="stat-lbl">API Authentication</div>
        </div>
        """, unsafe_allow_html=True)
        
    st.markdown("<br>", unsafe_allow_html=True)
    st.subheader("🚀 Academic Tools Launcher")
    
    c1, c2 = st.columns(2)
    
    with c1:
        st.markdown("""
        <div class="dash-card">
            <div class="dash-card-icon">📚</div>
            <div class="dash-card-title">Grounded Academic RAG</div>
            <div class="dash-card-desc">Query lecture notes, research papers, and textbook PDFs with verifiable inline citations and zero hallucinations.</div>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("<br>", unsafe_allow_html=True)
        
        st.markdown("""
        <div class="dash-card">
            <div class="dash-card-icon">🔍</div>
            <div class="dash-card-title">Originality & Integrity Auditor</div>
            <div class="dash-card-desc">Compare draft passages against source materials using TF-IDF cosine similarity and n-gram overlap detection.</div>
        </div>
        """, unsafe_allow_html=True)

    with c2:
        st.markdown("""
        <div class="dash-card">
            <div class="dash-card-icon">✍️</div>
            <div class="dash-card-title">Style & Readability Transformer</div>
            <div class="dash-card-desc">Adapt tone, vocabulary complexity, and target grade levels while tracking Flesch-Kincaid reading metrics in real time.</div>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("<br>", unsafe_allow_html=True)
        
        st.markdown("""
        <div class="dash-card">
            <div class="dash-card-icon">📝</div>
            <div class="dash-card-title">Pedagogical Essay Reviewer</div>
            <div class="dash-card-desc">Receive detailed rubric-based feedback on thesis strength, evidence structure, and clarity without replacing student voice.</div>
        </div>
        """, unsafe_allow_html=True)

# ----------------------------------------------------
# PAGE 2: GROUNDED ACADEMIC RAG
# ----------------------------------------------------
elif selected_task == "Grounded Academic RAG":
    st.markdown("""
    <div class="section-header">
        <h2>📚 Grounded Academic Query Engine</h2>
        <p>Ingest course materials or academic papers to receive factually grounded answers with source citations.</p>
    </div>
    """, unsafe_allow_html=True)

    col1, col2 = st.columns([1, 2])
    
    with col1:
        st.subheader("1. Ingest Sources")
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
                    st.rerun()
            else:
                st.info(f"📄 '{uploaded_file.name}' is currently loaded in memory.")
                    
        st.divider()
        st.markdown("**Paste Quick Reference Text:**")
        sample_text = st.text_area("Reference Text:", height=140, placeholder="Paste text here...", label_visibility="collapsed")
        if st.button("📥 Index Reference Text", use_container_width=True):
            if sample_text.strip():
                num_chunks = st.session_state.rag_engine.ingest_document(sample_text, "Pasted_Reference")
                st.success(f"Indexed reference into {num_chunks} chunks!")
                st.rerun()
            else:
                st.warning("Please enter text first.")

    with col2:
        st.subheader("2. Ask Grounded Question")
        query = st.text_input("Enter your research or course question:", placeholder="e.g., What are the main findings regarding readability metrics?")
        
        if st.button("🔍 Search & Generate Answer", type="primary", use_container_width=True):
            if not query.strip():
                st.warning("Please enter a question.")
            else:
                with st.spinner("Retrieving context & generating grounded answer..."):
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
# PAGE 3: STYLE & READABILITY TRANSFORMER
# ----------------------------------------------------
elif selected_task == "Style Transformer":
    st.markdown("""
    <div class="section-header">
        <h2>✍️ Style & Readability Transformer</h2>
        <p>Transform tone, complexity, and target grade level while analyzing Flesch-Kincaid metrics.</p>
    </div>
    """, unsafe_allow_html=True)

    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Input Passage & Target Options")
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
            
        custom_inst = st.text_input("Custom Directive (Optional):", placeholder="e.g., add real-world domain examples")
        
        transform_btn = st.button("✨ Transform Text Style", type="primary", use_container_width=True)

    with col2:
        st.subheader("Transformed Output & Readability Metrics")
        
        if transform_btn and input_text.strip():
            with st.spinner("Transforming text and running readability analytics..."):
                res = st.session_state.style_engine.transform_style(
                    input_text, tone, reading_level, length_opt, custom_inst
                )
                st.session_state["last_trans_result"] = res

        if "last_trans_result" in st.session_state:
            res = st.session_state["last_trans_result"]
            
            st.markdown("#### Transformed Text Output:")
            st.text_area("Output:", value=res["transformed_text"], height=180, label_visibility="collapsed")
            
            st.divider()
            st.markdown("#### 📈 Readability Metrics Comparison")
            
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
        <h2>🔍 Originality & Academic Integrity Auditor</h2>
        <p>Audit rewritten or generated content against source material for cosine similarity and phrase overlaps.</p>
    </div>
    """, unsafe_allow_html=True)

    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Source Material vs Target Passage")
        source_txt = st.text_area("Original Source Passage:", height=180, placeholder="Paste reference source text...")
        generated_txt = st.text_area("Generated / Student Text:", height=180, placeholder="Paste text to evaluate...")
        
        ngram_size = st.slider("N-gram Overlap Size (Words):", min_value=3, max_value=8, value=5)
        
        audit_btn = st.button("🛡️ Audit Similarity & Integrity", type="primary", use_container_width=True)

    with col2:
        st.subheader("Similarity Audit Report")
        
        if audit_btn:
            if not source_txt.strip() or not generated_txt.strip():
                st.warning("Please provide both source and target passages to analyze.")
            else:
                with st.spinner("Calculating TF-IDF Cosine Similarity & N-gram Overlaps..."):
                    report = st.session_state.originality_engine.analyze_similarity(
                        generated_txt, source_txt, n_gram_size=ngram_size
                    )
                    
                    sim_pct = report["similarity_percentage"]
                    risk = report["risk_level"]
                    
                    m1, m2 = st.columns(2)
                    with m1:
                        st.metric("TF-IDF Cosine Similarity", f"{sim_pct}%")
                    with m2:
                        st.markdown(f"### {risk}")
                        
                    st.divider()
                    st.markdown(f"#### ⚠️ Matching {ngram_size}-gram Phrases ({report['n_gram_match_count']} detected)")
                    
                    if not report["n_gram_matches"]:
                        st.success("No exact phrase overlaps detected!")
                    else:
                        for m in report["n_gram_matches"]:
                            st.warning(f"Match: \"{m}\"")

# ----------------------------------------------------
# PAGE 5: ESSAY CRITIQUE & TUTOR
# ----------------------------------------------------
elif selected_task == "Essay Critique":
    st.markdown("""
    <div class="section-header">
        <h2>📝 Pedagogical Essay Reviewer & Tutor</h2>
        <p>Receive rubric-based constructive feedback on thesis, evidence, and structure without replacing student writing.</p>
    </div>
    """, unsafe_allow_html=True)

    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.subheader("Submit Essay Draft")
        essay_draft = st.text_area(
            "Essay Content:",
            height=320,
            placeholder="Paste your essay draft here..."
        )
        
        level = st.selectbox("Academic Level:", ["High School", "Undergraduate", "Postgraduate"])
        
        review_btn = st.button("🎓 Review & Critique Essay", type="primary", use_container_width=True)

    with col2:
        st.subheader("Academic Tutor Feedback")
        
        if review_btn and essay_draft.strip():
            with st.spinner("Evaluating thesis, evidence structure, tone, and organization..."):
                critique = st.session_state.critique_engine.review_essay(essay_draft, academic_level=level)
                st.markdown(critique)
        elif review_btn:
            st.warning("Please paste an essay draft first.")
