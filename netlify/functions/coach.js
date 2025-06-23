// netlify/functions/coach.js
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.handler = async function (event) {
  try {
    const { userInput, phase } = JSON.parse(event.body);

    console.log("📨 Received input:", { userInput, phase });

    const messages = [
      {
        role: "system",
        content: `You are a world-class EOS Implementer helping a business leader refine a vague Rock into a SMART Rock. Be clear, practical, conversational, and helpful. Your job is to ask a single phase-specific coaching question, optionally with an example.`
      },
      {
        role: "user",
        content: `We're working on this Rock: "${userInput}". We're currently refining the '${phase}' aspect of SMART.

Please return ONE helpful coaching question that guides the user to revise their Rock at this phase. Use an example if it helps.`
      }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      temperature: 0.7
    });

    const response = completion.choices?.[0]?.message?.content?.trim();

    console.log("🤖 AI responded:", response);

    return {
      statusCode: 200,
      body: JSON.stringify({ response: response || "(no response returned)" })
    };
  } catch (err) {
    console.error("💥 Error in coach function:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "AI error", detail: err.message })
    };
  }
};
