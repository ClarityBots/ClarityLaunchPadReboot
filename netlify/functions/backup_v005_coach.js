const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.handler = async function(event, context) {
  let body;

  try {
    body = JSON.parse(event.body || '{}');
    console.log("Parsed body:", body);
  } catch (parseErr) {
    console.error("Invalid JSON in request:", parseErr);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON in request body" })
    };
  }

  const { userInput, phase } = body;

  if (!userInput || !phase) {
    console.warn("Missing userInput or phase:", { userInput, phase });
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing 'userInput' or 'phase'" })
    };
  }

  try {
    const prompt = `The user is refining a goal to make it SMART. They are currently on the "${phase}" phase. Their last input was: "${userInput}". Give a coaching prompt question to help them continue refining this SMART goal. Only return the question.`;

    console.log("Sending prompt:", prompt);

    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful EOS® coach guiding a team through SMART goal refinement."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 100
    });

    const aiMessage = response.data.choices[0].message.content;
    console.log("AI response:", aiMessage);

    return {
      statusCode: 200,
      body: JSON.stringify({ response: aiMessage })
    };
  } catch (error) {
    console.error("OpenAI call failed:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "AI error",
        detail: error.message || "Unknown error"
      })
    };
  }
};
