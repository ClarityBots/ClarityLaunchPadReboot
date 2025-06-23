// netlify/functions/backup_v005_coach.js
const { Configuration, OpenAIApi } = require("openai");

exports.handler = async function (event, context) {
  try {
    const { userInput, phase } = JSON.parse(event.body || "{}");

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

    const prompt = `You're helping an EOS® team refine a vague 90-day goal (Rock) into a SMART one.\n\nStep: ${phase}\nRock: ${userInput}\n\nRespond with a question to clarify or refine this step.`;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const responseText = completion.data.choices[0]?.message?.content?.trim();

    return {
      statusCode: 200,
      body: JSON.stringify({ response: responseText }),
    };
  } catch (error) {
    console.error("AI error:", error.message || error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "AI error",
        detail: error.message || "Unexpected error",
      }),
    };
  }
};
