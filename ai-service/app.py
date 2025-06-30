from fastapi import FastAPI
from pydantic import BaseModel
import openai

openai.api_key = "YOUR_OPENAI_API_KEY"  # Ganti dengan token OpenAI-mu

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
