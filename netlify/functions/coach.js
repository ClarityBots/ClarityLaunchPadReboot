// coach.js — Netlify Function to proxy OpenAI API calls

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Stored securely in Netlify environment variables
});
const openai = new OpenAIApi(configuration);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  const { userInput, phase } = JSON.parse(event.body || "{}");

  if (!userInput || !phase) {
    return {
      statusCode: 400,
      body: "Missing input or phase",
    };
  }

  const prompt = `You are a professional EOS Implementer guiding a user through SMART Rock creation. The user has entered: "${userInput}". Provide a coaching-style follow-up for the ${phase} phase. Be direct, specific, and helpful.`;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.7,
    });

    const aiResponse = response.data.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ response: aiResponse }),
    };
  } catch (error) {
    console.error("OpenAI error:", error);
    return {
      statusCode: 500,
      body: "Internal Server Error",
    };
  }
};
