// netlify/functions/backup_v005_coach.js
const { Configuration, OpenAIApi } = require("openai");

exports.handler = async (event) => {
  // Ensure only POST requests are allowed
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { userInput, phase } = body;

    if (!userInput || !phase) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing user input or phase." }),
      };
    }

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const prompt = `
You are an expert EOS Implementer coaching an entrepreneur to clarify their Rock (90-day business goal).

The user’s input is:
"${userInput}"

Your job is to respond with ONE powerful follow-up question aligned with the current SMART phase:
${phase}

Guidelines:
- Ask a coaching-style question, no statements.
- No phase labels.
- Keep it practical and encouraging.
`;

    const completion = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a world-class EOS Implementer helping refine business goals." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const reply = completion.data.choices[0].message.content.trim();

    return {
      statusCode: 200,
      body: JSON.stringify({ response: reply }),
    };
  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "AI error", detail: err.message }),
    };
  }
};
