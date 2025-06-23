// netlify/functions/coach.js

const { OpenAI } = require("openai");

exports.handler = async (event) => {
  console.log("=== Incoming request to /coach ===");

  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error("Missing OpenAI API Key");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Server misconfigured: Missing OpenAI API key." }),
      };
    }

    const body = JSON.parse(event.body || "{}");
    const { userInput, phase } = body;

    console.log("Parsed body:", body);

    if (!userInput || !phase) {
      console.warn("Missing required fields:", { userInput, phase });
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields: userInput and phase." }),
      };
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = `The user is refining a goal to make it SMART. Help them improve this part: ${phase}. Input: ${userInput}`;

    console.log("Generated prompt:", prompt);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const aiResponse = completion.choices?.[0]?.message?.content || "(no content returned)";
    console.log("AI response:", aiResponse);

    return {
      statusCode: 200,
      body: JSON.stringify({ response: aiResponse }),
    };
  } catch (err) {
    console.error("❌ Error during AI processing:", err.message, err.stack);
    return {
      statusCode: 502,
      body: JSON.stringify({ error: "AI request failed. Check server logs." }),
    };
  }
};
