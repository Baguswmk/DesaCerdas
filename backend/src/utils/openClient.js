import axios from 'axios';

export const sendToAI = async (messages) => {
  try {
    const response = await axios.post('http://localhost:8000/ask', {
      messages: messages.map((msg) => ({
        role: msg.sender.toLowerCase(),
        content: msg.message,
      })),
    });

    return response.data.answer || 'Maaf, tidak bisa menjawab saat ini.';
  } catch (err) {
    console.error('AI Error:', err.message);
    return 'Maaf, terjadi kesalahan dalam menjawab pertanyaan Anda.';
  }
};
