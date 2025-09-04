from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import requests
import os
import traceback

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

class Message(BaseModel):
    role: str
    content: str

class Prompt(BaseModel):
    messages: list[Message]

class FarmPrompt(BaseModel):
    plant: str
    location: str
    question: str = ""

KEYWORDS_HUKUM = [
    "pasal", "uu", "undang", "hukum", "perdata", "pidana",
    "pengadilan", "perjanjian", "kontrak", "pengacara", "advokat", "perkara",
    "korupsi", "tindak pidana", "kuhp", "kuhper"
]

def is_legal_question(prompt: Prompt) -> bool:
    combined_text = " ".join(msg.content.lower() for msg in prompt.messages)
    return any(keyword in combined_text for keyword in KEYWORDS_HUKUM)

@app.post("/ask-law")
def ask_law_ai(prompt: Prompt):
    try:
        print("=== AI SERVICE DEBUG START ===")
        
        if not is_legal_question(prompt):
            return {
                "answer": "Maaf, saya hanya dapat membantu menjawab pertanyaan seputar **hukum di Indonesia**."
            }

        # Get latest user question
        latest_question = ""
        if prompt.messages:
            for msg in reversed(prompt.messages):
                if msg.role.lower() == "user":
                    latest_question = msg.content
                    break

        if not latest_question:
            return {"answer": "Silakan ajukan pertanyaan hukum yang spesifik."}

        # Try free models only
        free_models = [
            "mistralai/Mistral-7B-Instruct-v0.3",
            "microsoft/DialoGPT-medium",
            "meta-llama/Llama-2-7b-chat-hf"
        ]
        
        enhanced_question = (
            f"Sebagai asisten hukum Indonesia, jelaskan dengan detail tentang: {latest_question}. "
            f"Berikan penjelasan berdasarkan peraturan perundang-undangan Indonesia yang berlaku."
        )
        
        for model in free_models:
            try:
                print(f"Trying free model: {model}")
                
                payload = {
                    "model": model,
                    "messages": [{"role": "user", "content": enhanced_question}],
                    "max_tokens": 500,
                    "temperature": 0.3
                }
                
                response = requests.post(
                    "https://api.aimlapi.com/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {AIML_API_KEY}",
                        "Content-Type": "application/json",
                    },
                    json=payload,
                    timeout=15
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get('choices') and len(data['choices']) > 0:
                        answer = data["choices"][0]["message"]["content"]
                        print(f"✅ Success with {model}")
                        return {"answer": answer}
                else:
                    print(f"Model {model} failed: {response.status_code}")
                    continue
                    
            except Exception as e:
                print(f"Error with {model}: {e}")
                continue
        
        # If all free models fail, return fallback
        print("All free models failed, using fallback")
        return {"answer": get_fallback_answer(latest_question)}

    except Exception as e:
        print(f"Error: {e}")
        return {"answer": get_fallback_answer(latest_question if 'latest_question' in locals() else "")}

def get_fallback_answer(question: str) -> str:
    """Fallback responses based on keywords"""
    question_lower = question.lower()
    
    if "korupsi" in question_lower:
        return (
            "**Undang-Undang tentang Korupsi di Indonesia:**\n\n"
            "1. **UU No. 31 Tahun 1999** - Pemberantasan Tindak Pidana Korupsi\n"
            "2. **UU No. 20 Tahun 2001** - Perubahan atas UU No. 31/1999\n"
            "3. **UU No. 30 Tahun 2002** - Komisi Pemberantasan Korupsi (KPK)\n\n"
            "**Jenis-jenis Korupsi:**\n"
            "- Penyuapan (suap-menyuap)\n"
            "- Penggelapan dalam jabatan\n"
            "- Pemerasan\n"
            "- Perbuatan curang\n"
            "- Benturan kepentingan\n\n"
            "**Sanksi:** Pidana penjara minimal 4 tahun, maksimal 20 tahun atau seumur hidup, "
            "plus denda hingga Rp 1 miliar.\n\n"
            "*Untuk kasus spesifik, konsultasikan dengan advokat bersertifikat.*"
        )
    
    elif "pasal" in question_lower or "kuhp" in question_lower:
        return (
            "**Informasi Pasal Hukum Indonesia:**\n\n"
            "Untuk memberikan informasi pasal yang akurat, mohon sebutkan:\n"
            "- Jenis tindak pidana yang dimaksud\n"
            "- Undang-undang spesifik (KUHP, KUHPer, dll)\n"
            "- Konteks kasus yang ingin diketahui\n\n"
            "**Contoh pertanyaan yang baik:**\n"
            "- 'Pasal berapa tentang pencurian dalam KUHP?'\n"
            "- 'Sanksi penipuan menurut pasal KUHP?'\n"
            "- 'Pasal tentang KDRT dalam UU yang mana?'\n\n"
            "*Sumber: KUHP, KUHPer, dan UU khusus Indonesia*"
        )
    
    elif any(word in question_lower for word in ["pidana", "hukuman", "sanksi"]):
        return (
            "**Jenis Sanksi Pidana di Indonesia:**\n\n"
            "**Pidana Pokok (Pasal 10 KUHP):**\n"
            "- Pidana mati\n"
            "- Pidana penjara\n"
            "- Kurungan\n"
            "- Denda\n"
            "- Tutupan (khusus tindak pidana politik)\n\n"
            "**Pidana Tambahan:**\n"
            "- Pencabutan hak tertentu\n"
            "- Perampasan barang tertentu\n"
            "- Pengumuman putusan hakim\n\n"
            "Berat ringannya sanksi tergantung pada jenis tindak pidana dan keadaan yang memberatkan atau meringankan.\n\n"
            "*Untuk analisis kasus spesifik, konsultasi dengan pengacara diperlukan.*"
        )
    
    elif "perdata" in question_lower or "kontrak" in question_lower:
        return (
            "**Hukum Perdata Indonesia:**\n\n"
            "Diatur dalam **KUH Perdata (BW)** dan berbagai UU khusus:\n\n"
            "**Bidang Utama:**\n"
            "- Hukum Orang (pribadi, keluarga)\n"
            "- Hukum Harta Kekayaan\n"
            "- Hukum Perikatan (kontrak)\n"
            "- Hukum Waris\n\n"
            "**Syarat Sahnya Kontrak (Pasal 1320 KUHPer):**\n"
            "1. Sepakat mereka yang mengikatkan diri\n"
            "2. Kecakapan untuk membuat perikatan\n"
            "3. Suatu hal tertentu\n"
            "4. Suatu sebab yang halal\n\n"
            "*Untuk sengketa perdata, dapat diselesaikan melalui pengadilan atau mediasi.*"
        )
    
    else:
        return (
            "**Selamat datang di layanan konsultasi hukum Indonesia.**\n\n"
            "Saya dapat membantu Anda dengan:\n"
            "- Informasi peraturan perundang-undangan\n"
            "- Penjelasan pasal-pasal hukum\n"
            "- Prosedur hukum umum\n"
            "- Jenis sanksi pidana dan perdata\n\n"
            "**Contoh pertanyaan:**\n"
            "- 'UU tentang korupsi nomor berapa?'\n"
            "- 'Pasal pencurian dalam KUHP?'\n"
            "- 'Syarat sahnya kontrak menurut hukum Indonesia?'\n\n"
            "Mohon ajukan pertanyaan yang lebih spesifik untuk jawaban yang akurat.\n\n"
            "*Disclaimer: Ini adalah informasi umum, bukan nasihat hukum. "
            "Untuk kasus spesifik, konsultasikan dengan advokat bersertifikat.*"
        )

@app.post("/ask-law-simple")
def ask_law_simple(prompt: Prompt):
    """Simple version with just fallback responses"""
    try:
        if not is_legal_question(prompt):
            return {"answer": "Maaf, saya hanya dapat membantu pertanyaan hukum Indonesia."}
        
        latest_question = ""
        if prompt.messages:
            for msg in reversed(prompt.messages):
                if msg.role.lower() == "user":
                    latest_question = msg.content
                    break
        
        return {"answer": get_fallback_answer(latest_question)}
        
    except Exception as e:
        print(f"Simple error: {e}")
        return {"answer": "Terjadi kesalahan. Silakan coba lagi."}

@app.post("/ask-law-mock")  
def ask_law_mock(prompt: Prompt):
    """Mock version - same as simple for now"""
    return ask_law_simple(prompt)

@app.post("/ask-farm")
def ask_farm_ai(prompt: FarmPrompt):
    return {
        "answer": (
            f"**Panduan Budidaya {prompt.plant.title()} di {prompt.location.title()}:**\n\n"
            "**1. Persiapan Lahan:**\n"
            "- Pastikan drainase baik dan tidak tergenang\n"
            "- Cek pH tanah (ideal 6.0-7.0 untuk kebanyakan tanaman)\n"
            "- Bersihkan gulma dan sisa tanaman sebelumnya\n\n"
            "**2. Penanaman:**\n"
            "- Ikuti jarak tanam yang direkomendasikan\n"
            "- Tanam pada waktu yang tepat (musim hujan/kemarau)\n"
            "- Gunakan bibit/benih berkualitas\n\n"
            "**3. Perawatan Rutin:**\n"
            "- Penyiraman teratur sesuai kebutuhan tanaman\n"
            "- Pemupukan berkala (NPK seimbang)\n"
            "- Penyiangan gulma secara rutin\n\n"
            "**4. Pengendalian Hama/Penyakit:**\n"
            "- Monitor tanaman setiap hari\n"
            "- Identifikasi hama/penyakit sejak dini\n"
            "- Gunakan pestisida organik atau kimia sesuai kebutuhan\n\n"
            "**5. Panen:**\n"
            "- Panen pada waktu yang tepat untuk kualitas optimal\n"
            "- Gunakan alat panen yang bersih dan tajam\n"
            "- Simpan hasil panen di tempat yang sesuai\n\n"
            f"*Konsultasikan dengan penyuluh pertanian di {prompt.location} untuk panduan spesifik lokasi.*"
        )
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Legal & Farm AI",
        "version": "2.0-fallback",
        "message": "Using fallback responses - fully functional"
    }

@app.get("/")
def root():
    return {
        "message": "AI Legal & Farm Assistant",
        "endpoints": [
            "/ask-law - Legal questions (with fallback)",
            "/ask-law-simple - Simple legal responses", 
            "/ask-farm - Farm guidance",
            "/health - Health check"
        ]
    }