from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import requests
import os

load_dotenv()
AIML_API_KEY = os.getenv("AIML_API_KEY")

if not AIML_API_KEY:
    raise RuntimeError("AIML_API_KEY tidak ditemukan di .env")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

### ==== Models ====

class Message(BaseModel):
    role: str  # 'user' atau 'assistant'
    content: str

class Prompt(BaseModel):
    messages: list[Message]

class FarmPrompt(BaseModel):
    plant: str
    location: str
    question: str = ""  # opsional

### ==== Tanya Hukum ====

KEYWORDS_HUKUM = [
    "pasal", "uu", "undang", "hukum", "perdata", "pidana",
    "pengadilan", "perjanjian", "kontrak", "pengacara", "advokat", "perkara"
]

def is_legal_question(prompt: Prompt) -> bool:
    combined_text = " ".join(msg.content.lower() for msg in prompt.messages)
    return any(keyword in combined_text for keyword in KEYWORDS_HUKUM)

@app.post("/ask-law")
def ask_law_ai(prompt: Prompt):
    if not is_legal_question(prompt):
        return {
            "answer": (
                "Maaf, saya hanya dapat membantu menjawab pertanyaan seputar **hukum di Indonesia**. "
                "Silakan ajukan pertanyaan yang relevan dengan topik hukum seperti pasal, undang-undang, atau pengadilan."
            )
        }

    try:
        response = requests.post(
            "https://api.aimlapi.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {AIML_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "meta-llama/Llama-Vision-Free",
                "messages": [
                    {
                        "role": "system",
                        "content": (
                            "Kamu adalah asisten hukum berbasis AI yang bertugas membantu masyarakat awam di Indonesia. "
                            "Tugasmu adalah memberikan penjelasan hukum yang netral, mudah dipahami, dan sesuai dengan peraturan perundang-undangan di Indonesia. "
                            "Dasar hukum dapat mencakup UUD 1945, KUHP, KUHPer, UU Ketenagakerjaan, UU Perlindungan Konsumen, dan lainnya. "
                            "Jangan menjawab topik di luar hukum, dan arahkan pengguna untuk konsultasi dengan advokat bila perlu. "
                            "Jawaban harus sopan, edukatif, dan tidak bersifat mengikat."
                        )
                    },
                    *[msg.dict() for msg in prompt.messages]
                ],
            },
            timeout=15
        )

        response.raise_for_status()
        data = response.json()
        return {"answer": data["choices"][0]["message"]["content"]}

    except Exception as e:
        print("❌ Error Tanya Hukum:", str(e))
        raise HTTPException(status_code=500, detail="Gagal memproses permintaan hukum.")

### ==== FarmSmart ====

@app.post("/ask-farm")
def ask_farm_ai(prompt: FarmPrompt):
    try:
        full_prompt = (
            f"Saya menanam {prompt.plant} di daerah {prompt.location}. "
            f"{prompt.question.strip() if prompt.question else ''} "
            "Beri saya panduan lengkap: langkah perawatan, potensi risiko, dan tips panen."
        )

        response = requests.post(
            "https://api.aimlapi.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {AIML_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "meta-llama/Llama-Vision-Free",
                "messages": [
                    {
                        "role": "system",
                        "content": (
                            "Kamu adalah asisten pertanian cerdas. Tugasmu adalah memberikan panduan budidaya tanaman "
                            "yang sesuai dengan kondisi umum di Indonesia, termasuk perawatan, hama, panen, dan efisiensi hasil. "
                            "Berikan informasi langkah demi langkah yang mudah dipahami oleh petani awam. "
                            "Jangan bahas hukum, agama, atau topik non-pertanian."
                        )
                    },
                    {
                        "role": "user",
                        "content": full_prompt
                    }
                ],
            },
            timeout=15
        )

        response.raise_for_status()
        data = response.json()
        return {"answer": data["choices"][0]["message"]["content"]}

    except Exception as e:
        print("❌ Error FarmSmart:", str(e))
        raise HTTPException(status_code=500, detail="Gagal memproses permintaan pertanian.")
