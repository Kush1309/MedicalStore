const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Google AI Initialization will be done inside the route to prevent hangs if key is invalid or missing during startup

const systemInstruction = `You are the AI Assistant for "Raj pharma", a trusted online medical store located in Kanpur nagar. 
Your goal is to help customers with medicine inquiries, healthcare tips, and store information.
Store Owner: Kushagra
Contact: 6394109197
Location: Kanpur nagar
Services: Online medicine delivery, healthcare consultations, and medical supplies.

IMPORTANT RESTRICTION:
You are strictly a MEDICAL and WEBSITE assistant.
- You must ONLY answer questions related to:
  1. Medicines, health conditions, symptoms, and medical advice.
  2. "Raj pharma" store information, location, contact details, and services.
- If a user asks about ANY other topic (e.g., sports, politics, movies, coding, math, general knowledge), you must politely REFUSE to answer.
- Example refusal: "I apologize, but I can only assist with medical or Raj pharma related queries. How can I help with your health today?"

Guidelines:
1. Always be professional, empathetic, and helpful.
2. If asked about specific medicines, advise the user to consult a doctor for serious conditions.
3. Mention that "Raj pharma" provides quality medicines at affordable prices.
4. Keep responses concise and easy to read.
5. If you don't know the answer, suggest the user contact the store directly at 6394109197.`;

router.post('/', async (req, res) => {
    try {
        const { message, history } = req.body || {};

        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }

        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'REPLACE_WITH_YOUR_KEY') {
            let fallbackText = "Hello! I'm currently in 'Demo Mode' because the Gemini API Key is missing. However, I can still help! Raj pharma is located in Kanpur nagar and owned by Kushagra. You can reach us at 6394109197.";

            const lowerMsg = message.toLowerCase();
            if (lowerMsg.includes('contact') || lowerMsg.includes('number')) {
                fallbackText = "You can contact Raj pharma at 6394109197.";
            } else if (lowerMsg.includes('medicines') || lowerMsg.includes('shop')) {
                fallbackText = "We offer a wide range of medicines! Check our Shop page for details.";
            } else if (lowerMsg.includes('hi') || lowerMsg.includes('hello')) {
                fallbackText = "Hello! I'm the Raj pharma assistant (Demo Mode). Once my owner adds the Gemini API key, I'll be much smarter!";
            } else if (lowerMsg.includes('location') || lowerMsg.includes('where')) {
                fallbackText = "Raj pharma is located in Kanpur nagar.";
            }

            return res.json({
                text: fallbackText,
                isDemo: true
            });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: systemInstruction
        });

        const chat = model.startChat({
            history: history || [],
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.json({ text });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ message: "I'm having trouble thinking right now. Please try again later." });
    }
});

module.exports = router;
