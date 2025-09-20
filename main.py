from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware  # <- important
from pydantic import BaseModel
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for testing, allow all. Later restrict to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # allow POST, GET, OPTIONS etc.
    allow_headers=["*"],  # allow Content-Type, Authorization etc.
)

# Initialize LLM
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash")


class WordRequest(BaseModel):
    word: str
    text: str


def extract_meaning_context(text: str):
    parts = text.split("context:")
    if len(parts) != 2:
        return {
            "meaning": text,
            "context": "Context could not be extracted due to unexpected format.",
        }
    meaning = parts[0].replace("meaning:", "", 1).strip()
    context = parts[1].strip()
    return {"meaning": meaning, "context": context}


def get_result(word: str, text: str):
    prompt = f"""
    You are an expert dictionary and context analyzer.
    Word: {word}
    Text: {text}

    Return strictly in following format:
    meaning: meaning of the word
    context: how the word is used (keep it short, one liner)
    """
    result = llm.invoke(prompt)
    return extract_meaning_context(result.content)


@app.post("/api/analyze-word")
def analyze_word(request: WordRequest):
    try:
        result = get_result(request.word, request.text)
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
