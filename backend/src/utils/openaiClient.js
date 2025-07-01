// utils/openaiClient.js
import axios from "axios";

export const sendToAI = async (messages) => {
  try {
    const payload = {
      messages: messages.map((msg) => ({
        role: msg.sender === "USER" ? "user" : "assistant",
        content: msg.message,
      })),
    };

    console.log(">> Kirim ke AI:", JSON.stringify(payload, null, 2));

    const response = await axios.post("http://127.0.0.1:8000/ask", payload);

    console.log(">> Jawaban dari AI:", response.data);
    return response.data.answer;
  } catch (err) {
    console.error("❌ Gagal dari sendToAI:", err.message);
    throw err;
  }
};
