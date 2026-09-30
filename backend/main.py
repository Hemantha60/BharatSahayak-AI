import os
import time

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai import errors

# --------------------------------------------------
# Trusted BharatSahayak sources
# --------------------------------------------------

TRUSTED_SOURCES = [
    {
        "title": "National Portal of India",
        "url": "https://www.india.gov.in/",
        "keywords": [
            "government",
            "scheme",
            "service",
            "aadhaar",
            "passport",
            "driving licence",
            "government service",
            "सरकार",
            "सरकारी",
            "ಸರ್ಕಾರ",
            "ಸರ್ಕಾರಿ",
        ],
    },
    {
        "title": "Government Services Portal",
        "url": "https://services.india.gov.in/",
        "keywords": [
            "apply",
            "certificate",
            "license",
            "licence",
            "service",
            "online service",
            "आवेदन",
            "सेवा",
            "ಅರ್ಜಿ",
            "ಸೇವೆ",
        ],
    },
    {
        "title": "PM-KISAN Samman Nidhi",
        "url": "https://pmkisan.gov.in/",
        "keywords": [
            "farmer",
            "farmers",
            "agriculture",
            "pm kisan",
            "pm-kisan",
            "kisan",
            "crop",
            "किसान",
            "कृषि",
            "ರೈತ",
            "ಕೃಷಿ",
        ],
    },
]
# --------------------------------------------------
# Find relevant trusted sources
# --------------------------------------------------

def find_relevant_sources(user_message: str):
    text = user_message.lower()

    matches = []

    for source in TRUSTED_SOURCES:
        for keyword in source["keywords"]:
            if keyword.lower() in text:
                matches.append({
                    "title": source["title"],
                    "url": source["url"],
                })
                break

    return matches[:3]
# --------------------------------------------------
# Load environment variables
# --------------------------------------------------

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY is missing from backend/.env"
    )


# --------------------------------------------------
# Gemini client
# --------------------------------------------------

client = genai.Client(
    api_key=GEMINI_API_KEY
)


# --------------------------------------------------
# FastAPI application
# --------------------------------------------------

app = FastAPI(
    title="BharatSahayak AI",
    description="AI assistant for Bharat in Indian languages",
    version="1.0.0",
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Request model
# --------------------------------------------------

class ChatRequest(BaseModel):
    message: str
    language: str = "English"


# --------------------------------------------------
# Root endpoint
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "BharatSahayak AI",
        "version": "1.0.0",
    }


# --------------------------------------------------
# Health check
# --------------------------------------------------

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "gemini": "configured",
    }


# --------------------------------------------------
# AI Chat
# --------------------------------------------------

@app.post("/api/chat")
def chat(request: ChatRequest):

    # Clean user message
    user_message = request.message.strip()

    if not user_message:
        return {
            "success": False,
            "answer": "Please enter a question.",
            "language": request.language,
        }


    # --------------------------------------------------
    # BharatSahayak system prompt
    # --------------------------------------------------

    prompt = f"""
You are BharatSahayak AI, a helpful multilingual AI assistant
designed for people across India.

The user's preferred language is:
{request.language}

User's question:
{user_message}

Instructions:

1. Answer naturally and clearly.
2. Respond in the user's preferred language.
3. If the language is Kannada, answer in Kannada.
4. If the language is Hindi, answer in Hindi.
5. If the language is English, answer in English.
6. Keep explanations easy to understand.
7. Use examples when useful.
8. Do not unnecessarily use complicated technical words.
9. If you are uncertain about a fact, clearly say that the information
   should be verified.
10. Do not invent sources, statistics, government schemes, or facts.
11. Be respectful and useful to Indian users.
"""


    # --------------------------------------------------
    # Models
    #
    # First try Flash-Lite for speed.
    # If it is temporarily unavailable, try 3.8 Flash.
    # --------------------------------------------------

    models_to_try = [
        "gemini-3.5-flash-lite",
        "gemini-3.8-flash",
    ]


    response = None
    last_error = None


    # --------------------------------------------------
    # Try models with retry
    # --------------------------------------------------

    for model_name in models_to_try:

        print(
            f"Trying Gemini model: {model_name}"
        )

        for attempt in range(2):

            try:

                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                )

                # Make sure Gemini returned text
                if response and response.text:

                    print(
                        f"Gemini response received from {model_name}"
                    )

                    return {
                        "success": True,
                        "answer": response.text,
                        "language": request.language,
                        "model": model_name,
                        "sources": find_relevant_sources(request.message)
                    }

            except errors.ServerError as error:

                last_error = error

                print(
                    f"Gemini server error with {model_name} "
                    f"(attempt {attempt + 1}/2): {error}"
                )

                # Wait before retrying
                if attempt < 1:
                    time.sleep(2)


            except errors.APIError as error:

                last_error = error

                print(
                    f"Gemini API error with {model_name}: {error}"
                )

                # Try the next model
                break


            except Exception as error:

                last_error = error

                print(
                    f"Unexpected Gemini error with {model_name}: "
                    f"{error}"
                )

                # Try the next model
                break


    # --------------------------------------------------
    # If every Gemini model failed
    # --------------------------------------------------

    print(
        f"All Gemini models failed. Last error: {last_error}"
    )

    return {
        "success": False,
        "answer": (
            "BharatSahayak is temporarily busy connecting "
            "to its AI service. Please try again in a few seconds."
        ),
        "language": request.language,
    }