// netlify/functions/backup_v005_coach.js

import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async (req, res) => {
  try {
    const { userInput, phase } = req.body;

    if (!userInput || !phase) {
      return res.status(400).json({ error: "Missing userInput or phase" });
    }

    const prompt = `You are a business coach helping a user refine their 90-day goal using SMART criteria. 
The current step is: ${phase}. Based on the user’s latest input: "${userInput}", provide a helpful coaching question or prompt. 
Keep the tone supportive and clear.`;

    const chat = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4",
    });

    const response = chat.choices[0].message.content;
    return res.status(200).json({ response });
  } catch (error) {
    console.error("AI error:", error);
    return res.status(500).json({ error: "AI error", detail: error.message });
  }
};
