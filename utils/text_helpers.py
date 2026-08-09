import os
import pypdf
import docx

def read_text_from_file(file_path: str) -> str:
    """Reads raw text from PDF, DOCX, or TXT file."""
    ext = os.path.splitext(file_path)[1].lower()
    
    if ext == ".txt":
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()
            
    elif ext == ".pdf":
        text = ""
        reader = pypdf.PdfReader(file_path)
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
        return text
        
    elif ext in [".docx", ".doc"]:
        doc = docx.Document(file_path)
        return "\n".join([p.text for p in doc.paragraphs if p.text])
        
    else:
        raise ValueError(f"Unsupported file format: {ext}")

def extract_bytes_to_text(file_bytes: bytes, file_name: str) -> str:
    """Reads raw text from uploaded bytes stream."""
    ext = os.path.splitext(file_name)[1].lower()
    
    if ext == ".txt":
        return file_bytes.decode("utf-8", errors="ignore")
        
    elif ext == ".pdf":
        import io
        text = ""
        reader = pypdf.PdfReader(io.BytesIO(file_bytes))
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
        return text
        
    elif ext in [".docx", ".doc"]:
        import io
        doc = docx.Document(io.BytesIO(file_bytes))
        return "\n".join([p.text for p in doc.paragraphs if p.text])
        
    else:
        raise ValueError(f"Unsupported file format: {ext}")
