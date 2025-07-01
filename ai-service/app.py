from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import requests
import os

load_dotenv()

AIML_API_KEY = os.getenv("AIML_API_KEY")  # Ganti dengan kunci dari https://aimlapi.com

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    role: str
    content: str

class Prompt(BaseModel):
    messages: list[Message]

@app.post("/ask")
def ask_ai(prompt: Prompt):
    try:
        response = requests.post(
            "https://api.aimlapi.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {AIML_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model":"meta-llama/Llama-Vision-Free",
                "messages": [msg.dict() for msg in prompt.messages],
            },
            timeout=15
        )

        response.raise_for_status()
        data = response.json()
        return {"answer": data["choices"][0]["message"]["content"]}

    except Exception as e:
        print("AIML API ERROR:", str(e))
        return {"answer": "Maaf, terjadi kesalahan dalam menjawab pertanyaan Anda."}
