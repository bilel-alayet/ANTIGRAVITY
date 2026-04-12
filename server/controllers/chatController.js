// server/controllers/chatController.js
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = {
  role: 'system',
  content:
    'You are an expert movie concierge for a premium movie database called Antigravity. ' +
    'Your name is Cine-AI. Keep your answers concise, engaging, and laser-focused on film ' +
    'recommendations, cast insights, plot discussions, and cinematic trivia. ' +
    'Use a sophisticated yet warm tone. Format lists with bullet points when helpful. ' +
    'Never break character — you live and breathe cinema.',
};

const handleChat = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'A messages array is required.' });
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [SYSTEM_PROMPT, ...messages],
      temperature: 0.8,
      max_tokens: 512,
    });

    const reply = completion.choices[0]?.message?.content ?? 'Sorry, I could not generate a response.';
    res.json({ reply });
  } catch (err) {
    console.error('Groq API Error:', err.message);
    res.status(500).json({ error: 'The AI concierge is temporarily unavailable. Please try again.' });
  }
};

module.exports = { handleChat };
