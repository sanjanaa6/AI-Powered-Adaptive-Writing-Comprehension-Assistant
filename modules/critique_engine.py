import warnings
warnings.filterwarnings("ignore", category=FutureWarning)

try:
    from google import genai
    USE_NEW_GENAI = True
except ImportError:
    import google.generativeai as genai
    USE_NEW_GENAI = False

class CritiqueEngine:
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

    def review_essay(self, essay_text: str, academic_level: str = "Undergraduate") -> str:
        """Evaluates a student's essay draft pedagogically without ghostwriting it."""
        if not essay_text.strip():
            return "Please enter or paste your essay draft for review."

        prompt = f"""
You are an expert Academic Writing Tutor and Pedagogical Reviewer.
Your goal is to critique the student's essay draft constructively. You must help the student learn and refine their own writing.

CRITICAL PEDAGOGICAL RULE:
Do NOT rewrite the whole paper or provide a completed replacement essay. Instead, provide targeted feedback, point out structural or grammatical weaknesses, highlight strong points, and give concrete revision tasks.

Academic Level of Student: {academic_level}

ESSAY DRAFT:
{essay_text}

Provide your critique formatted in Markdown with the following sections:
1. 🎯 **Overall Impression & Summary of Thesis**
2. 🏛️ **Structure, Flow & Paragraph Transitions** (What works, what needs work)
3. 🎓 **Academic Tone & Vocabulary** (Identify informal phrasing or weak choices)
4. 🔬 **Argumentation & Evidence** (Are claims adequately backed up?)
5. 🛠️ **Step-by-Step Action Plan for Revision** (3-5 concrete tasks the student should complete next)
"""

        if not self.api_key or (not self.client and not self.model):
            return "⚠️ Gemini API Key missing. Please enter your API key in the sidebar to run the essay reviewer."

        try:
            if USE_NEW_GENAI and self.client:
                try:
                    response = self.client.models.generate_content(
                        model=self.model_name,
                        contents=prompt
                    )
                    return response.text
                except Exception as e_model:
                    err_msg = str(e_model).lower()
                    if "404" in err_msg or "not found" in err_msg or "not supported" in err_msg:
                        fallbacks = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash-latest", "gemini-1.5-pro", "gemini-pro"]
                        for fb in fallbacks:
                            if fb == self.model_name:
                                continue
                            try:
                                response = self.client.models.generate_content(model=fb, contents=prompt)
                                return response.text
                            except Exception:
                                continue
                        raise e_model
                    else:
                        raise e_model
            else:
                fallbacks = [self.model_name, "gemini-1.5-flash-latest", "gemini-1.5-pro-latest", "gemini-1.5-pro", "gemini-pro"]
                last_err = None
                for fb in fallbacks:
                    try:
                        m = genai.GenerativeModel(fb)
                        response = m.generate_content(prompt)
                        return response.text
                    except Exception as ex:
                        last_err = ex
                        continue
                raise last_err if last_err else Exception("GenerativeModel execution failed.")
        except Exception as e:
            return f"Error evaluating essay: {str(e)}"
