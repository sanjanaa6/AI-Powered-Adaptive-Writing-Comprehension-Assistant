import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class OriginalityEngine:
    def __init__(self):
        pass

    def get_ngrams(self, text: str, n: int = 5) -> set:
        """Extracts set of n-grams (sequence of n words) from text."""
        words = re.findall(r'\b\w+\b', text.lower())
        if len(words) < n:
            return set()
        return set([' '.join(words[i:i+n]) for i in range(len(words)-n+1)])

    def analyze_similarity(self, generated_text: str, source_text: str, n_gram_size: int = 5) -> dict:
        """Computes semantic similarity and exact phrase overlap between generated content and source text."""
        if not generated_text.strip() or not source_text.strip():
            return {
                "cosine_similarity": 0.0,
                "similarity_percentage": 0.0,
                "n_gram_matches": [],
                "risk_level": "Low",
                "message": "Both generated text and source text must be provided for comparison."
            }

        # 1. Cosine Similarity using TF-IDF
        try:
            vectorizer = TfidfVectorizer(stop_words='english')
            tfidf_matrix = vectorizer.fit_transform([generated_text, source_text])
            cos_sim = float(cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0])
        except Exception:
            cos_sim = 0.0

        sim_pct = round(cos_sim * 100, 2)

        # 2. N-gram Overlap
        gen_ngrams = self.get_ngrams(generated_text, n=n_gram_size)
        src_ngrams = self.get_ngrams(source_text, n=n_gram_size)
        
        matches = list(gen_ngrams.intersection(src_ngrams))

        # 3. Determine Risk Level
        if sim_pct > 30.0 or len(matches) > 3:
            risk_level = "High Similarity Risk 🔴"
        elif sim_pct > 15.0 or len(matches) > 0:
            risk_level = "Moderate Similarity 🟡"
        else:
            risk_level = "Original / Low Similarity 🟢"

        return {
            "cosine_similarity": cos_sim,
            "similarity_percentage": sim_pct,
            "n_gram_matches": matches[:10], # top 10 matches
            "n_gram_match_count": len(matches),
            "risk_level": risk_level,
            "message": "Analysis completed successfully."
        }
