from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
import openai
import os

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

class Prompt(BaseModel):
    question: str

app = FastAPI()

@app.post("/ask")
def ask_ai(prompt: Prompt):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful legal assistant."},
            {"role": "user", "content": prompt.question},
        ]
    )
    return {"answer": response['choices'][0]['message']['content']}
