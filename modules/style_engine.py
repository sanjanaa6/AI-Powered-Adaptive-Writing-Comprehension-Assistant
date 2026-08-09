import textstat
import warnings
warnings.filterwarnings("ignore", category=FutureWarning)

try:
    from google import genai
    USE_NEW_GENAI = True
except ImportError:
    import google.generativeai as genai
    USE_NEW_GENAI = False

class StyleEngine:
    def __init__(self, api_key: str, model_name: str = "gemini-2.5-flash"):
        self.api_key = api_key
        self.model_name = model_name
        self.client = None
        self.model = None
        
        if api_key:
            self.set_api_key(api_key)

    def set_api_key(self, api_key: str):
        self.api_key = api_key
        if USE_NEW_GENAI:
            self.client = genai.Client(api_key=api_key)
        else:
            genai.configure(api_key=api_key)
            try:
                self.model = genai.GenerativeModel(self.model_name)
            except Exception:
                self.model = genai.GenerativeModel("gemini-1.5-flash-latest")

    def evaluate_readability(self, text: str) -> dict:
        """Calculates quantitative readability metrics for a given text block."""
        if not text.strip():
            return {
                "flesch_reading_ease": 0.0,
                "flesch_kincaid_grade": 0.0,
                "gunning_fog": 0.0,
                "word_count": 0,
                "sentence_count": 0
            }
            
        try:
            fre = textstat.flesch_reading_ease(text)
            fkg = textstat.flesch_kincaid_grade(text)
            fog = textstat.gunning_fog(text)
            word_count = textstat.lexicon_count(text, removepunct=True)
            sentence_count = textstat.sentence_count(text)
            
            return {
                "flesch_reading_ease": round(fre, 2),
                "flesch_kincaid_grade": round(fkg, 2),
                "gunning_fog": round(fog, 2),
                "word_count": word_count,
                "sentence_count": sentence_count
            }
        except Exception:
            return {
                "flesch_reading_ease": 0.0,
                "flesch_kincaid_grade": 0.0,
                "gunning_fog": 0.0,
                "word_count": len(text.split()),
                "sentence_count": text.count(".") + 1
            }

    def transform_style(self, text: str, tone: str, target_reading_level: str, length_option: str, custom_instruction: str = "") -> dict:
        """Transforms text according to target tone, target reading level, and length while preserving core semantic meaning."""
        if not text.strip():
            return {"transformed_text": "", "metrics_original": {}, "metrics_transformed": {}}

        orig_metrics = self.evaluate_readability(text)

        prompt = f"""
You are an Adaptive Writing Assistant specializing in style conditioning and readability transformation.

Task: Rewrite the following text while strictly preserving its core factual meaning and arguments.

Target Requirements:
- Tone: {tone}
- Target Audience Reading Level: {target_reading_level}
- Output Length: {length_option}
{f'- Additional Instructions: {custom_instruction}' if custom_instruction else ''}

Original Text:
{text}

Rewritten Text (provide only the transformed text without meta comments):
"""

        if not self.api_key or (not self.client and not self.model):
            return {
                "transformed_text": "⚠️ Gemini API Key missing. Please set your API key in the sidebar.",
                "metrics_original": orig_metrics,
                "metrics_transformed": {}
            }

        try:
            if USE_NEW_GENAI and self.client:
                try:
                    response = self.client.models.generate_content(
                        model=self.model_name,
                        contents=prompt
                    )
                    transformed_text = response.text.strip()
                except Exception as e_model:
                    err_msg = str(e_model).lower()
                    if "404" in err_msg or "not found" in err_msg or "not supported" in err_msg:
                        fallbacks = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash-latest", "gemini-1.5-pro", "gemini-pro"]
                        fallback_success = False
                        for fb in fallbacks:
                            if fb == self.model_name:
                                continue
                            try:
                                response = self.client.models.generate_content(model=fb, contents=prompt)
                                transformed_text = response.text.strip()
                                fallback_success = True
                                break
                            except Exception:
                                continue
                        if not fallback_success:
                            raise e_model
                    else:
                        raise e_model
            else:
                # Legacy google.generativeai fallback mechanism
                fallbacks = [self.model_name, "gemini-1.5-flash-latest", "gemini-1.5-pro-latest", "gemini-1.5-pro", "gemini-pro"]
                fallback_success = False
                last_err = None
                for fb in fallbacks:
                    try:
                        m = genai.GenerativeModel(fb)
                        response = m.generate_content(prompt)
                        transformed_text = response.text.strip()
                        fallback_success = True
                        break
                    except Exception as ex:
                        last_err = ex
                        continue
                if not fallback_success:
                    raise last_err if last_err else Exception("GenerativeModel execution failed.")

            trans_metrics = self.evaluate_readability(transformed_text)

            return {
                "transformed_text": transformed_text,
                "metrics_original": orig_metrics,
                "metrics_transformed": trans_metrics
            }
        except Exception as e:
            return {
                "transformed_text": f"Error during transformation: {str(e)}",
                "metrics_original": orig_metrics,
                "metrics_transformed": {}
            }
