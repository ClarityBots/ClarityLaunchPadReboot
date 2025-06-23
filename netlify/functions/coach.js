// netlify/functions/coach.js
import { OpenAI } from "openai";

export default async (req, res) => {
  console.log("=== Incoming request to /coach ===");

  try {
    const body = JSON.parse(req.body || "{}");
    const { userInput, phase } = body;

    if (!process.env.OPENAI_API_KEY) {
      console.error("Missing OpenAI API Key");
      return res.status(500).json({ error: "Missing OpenAI API key" });
    }

    if (!userInput || !phase) {
      console.warn("Missing userInput or phase:", { userInput, phase });
      return res.status(400).json({ error: "Missing required fields." });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `The user is refining a goal to make it SMART. Help them improve this part: ${phase}. Input: ${userInput}`;
    console.log("Prompt:", prompt);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const response = completion.choices?.[0]?.message?.content || "(no guidance returned)";
    console.log("AI Response:", response);

    return res.status(200).json({ response });
  } catch (err) {
    console.error("Function Error:", err);
    return res.status(502).json({ error: "AI request failed." });
  }
};
