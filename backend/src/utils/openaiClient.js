import axios from "axios";

/**
 * Kirim chat pertanyaan ke AI untuk modul Tanya Hukum.
 * @param {Array} messages - daftar pesan { sender: "USER"|"AI", message: string }
 * @returns {Promise<string>} - jawaban dari AI
 */
export const sendToAI = async (messages) => {
  try {
    const payload = {
      messages: messages.map((msg) => ({
        role: msg.sender === "USER" ? "user" : "assistant",
        content: msg.message,
      })),
    };

    console.log(">> Kirim ke AI Hukum:", JSON.stringify(payload, null, 2));

    const response = await axios.post("http://127.0.0.1:8000/ask-law", payload);

    console.log(">> Jawaban dari AI Hukum:", response.data);
    return response.data.answer;
  } catch (err) {
    console.error("❌ Gagal dari sendToAI:", err.message);
    throw err;
  }
};

/**
 * Kirim pertanyaan ke AI untuk rekomendasi pertanian.
 * @param {Object} data - data pertanyaan.
 * @param {string} data.plant - jenis tanaman.
 * @param {string} data.location - lokasi tanam.
 * @param {string} [data.question] - pertanyaan tambahan (opsional).
 * @returns {Promise<string>} - jawaban dari AI
 */
export const sendFarmAI = async ({ plant, location, question }) => {
  try {
    const payload = { plant, location, question: question || "" };

    console.log(">> Kirim ke AI FarmSmart:", JSON.stringify(payload, null, 2));

    const response = await axios.post("http://127.0.0.1:8000/ask-farm", payload);

    console.log(">> Jawaban dari AI FarmSmart:", response.data);
    return response.data.answer;
  } catch (err) {
    console.error("❌ Gagal dari sendFarmAI:", err.message);
    throw err;
  }
};
