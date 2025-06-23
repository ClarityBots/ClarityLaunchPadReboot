const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.handler = async function(event, context) {
  try {
    const body = JSON.parse(event.body || '{}');
    const { userInput, phase } = body;

    if (!userInput || !phase) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing 'userInput' or 'phase'" })
      };
    }

    const prompt = `The user is refining a goal to make it SMART. They are currently on the "${phase}" phase. Their last input was: "${userInput}". Give a coaching prompt question to help them continue refining this SMART goal. Only return the question.`;

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

    return {
      statusCode: 200,
      body: JSON.stringify({ response: aiMessage })
    };

  } catch (error) {
    console.error("AI Function Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "AI error",
        detail: error.message || "Unknown error"
      })
    };
  }
};
